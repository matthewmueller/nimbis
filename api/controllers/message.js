var _ = require('underscore'),
    bus = require('../support/bus'),
    Message = require('../models/message'),
    User = require('../models/user'),
    Groups = require('../collections/groups'),
    Group = require('../models/group'),
    List = require('../structures/List'),
    isArray = Array.isArray,
    after = require('../support/utils').after;

// GET /messages
// curl localhost:8080/messages
// This will get messages available to specific user
exports.index = function(req, res) {
  var user = req.user,
      messages = user.get('messages');

  Message.find(messages, function(err, messages) {
    if(err) res.send(500, { error : err });
    res.send(messages);
  });
};

// POST /messages
// watch "curl -d \"message=hi+there&groups%5B%5D=123456&groups%5B%5D=654321\"
exports.create = function(req, res) {
  var body = req.body,
      groups = body.groups,
      user = req.user;

  groups = isArray(groups) ? groups : [groups];

  // TODO: new Error in res.send sending 200 OK.
  if(!groups || !user.hasGroup(groups))
    return res.send(500, { error : 'You are not a member of group(s)!' });

  // Add the author
  body.author = user;

  // Create a message
  Message.create(body, function(err, message) {
    if(err) return res.send(err);

    groups.forEach(function(id) {
      bus.emit(['group', id, 'message'].join(':'), message);
    });

    res.send(message);
    // // Find the groups members the message should be send to
    // Group.find(group, function(err, group) {
    //   if(err || !group) return res.send(new Error('Cannot find the group'));

    //   var members = group.get('members'),
    //       finished = after(members.length);



    //   // Add the message to each of the members of the group
    //   _.each(members, function(userId) {
    //     User.find(userId, function(err, user) {
    //       if(err || !user) return res.send(new Error('Cannot find the user'));
    //       // Push the message
    //       user.push('messages', message.id, function(err, doc) {
    //         if(err) return res.send(err);
    //         return res.send(message);
    //       });
    //     });
    //   });

    // });
  });
  
};




