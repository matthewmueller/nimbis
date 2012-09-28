var _ = require('underscore'),
    Message = require('../models/message'),
    User = require('../models/user'),
    Groups = require('../collections/groups'),
    Group = require('../models/group'),
    List = require('../structures/List'),
    after = require('../support/utils').after;

// GET /messages
// curl localhost:8080/messages
// This will get messages available to specific user
exports.index = function(req, res) {
  var messageIds = [],
      user = req.user.toJSON(),
      ids = _(user.groups).pluck('id');

  if(!ids.length) return res.send([]);

  var finished = after(ids.length),
      list = new List();

  _.each(ids, function(id) {
    list.key = 'list:group:'+ id +':messages';
    list.get(0, 50, function(err, data) {
      if(err) return res.send(err);
      // Merge with other messageIds
      messageIds = messageIds.concat(data);
      if(finished()) fetchMessages(messageIds);
    });
  });

  function fetchMessages(messages) {
    messages = _.uniq(messages);
    Messages.find(messages, done);
  }

  function done(err, messages) {
    if(err) return res.send(err);
    res.send(messages);
  }

};

// POST /messages
// watch "curl -d \"message=hi+there&groups%5B%5D=123456&groups%5B%5D=654321\"
exports.create = function(req, res) {
  var body = req.body,
      group = body.group,
      user = req.user;

  // TODO: new Error in res.send sending 200 OK.
  if(!group || !user.hasGroup(group))
    return res.send(new Error('You are not a member of group(s)!'));

  // Add the author
  body.author = user;

  // Create a message
  Message.create(body, function(err, message) {
    if(err) return res.send(err);

    // Find the groups members the message should be send to
    Group.find(group, function(err, group) {
      if(err || !group) return res.send(new Error('Cannot find the group'));

      var members = group.get('members'),
          finished = after(members.length);

      // Add the message to each of the members of the group
      _.each(members, function(userId) {
        User.find(userId, function(err, user) {
          if(err || !user) return res.send(new Error('Cannot find the user'));
          // Push the message
          user.push('messages', message.id).save(function(err) {
            if(err) return res.send(err);
            if(finished()) return res.send(201);
          });
        });
      });

    });
  });
  
};




