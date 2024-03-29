var _ = require('underscore'),
    bus = require('../support/bus'),
    Message = require('../models/message'),
    User = require('../models/user'),
    Group = require('../models/group'),
    isArray = Array.isArray;

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

  // Trim the whitespace
  body.groups = groups = groups.map(function(group) {
    return group.trim();
  });

  // TODO: new Error in res.send sending 200 OK.
  if(!groups || !user.hasGroup(groups)) {
    return res.send(500, { error : 'You are not a member of group(s)!' });
  }

  // Add the author
  body.author = user;

  // Create a message
  Message.create(body, function(err, message) {
    if(err) return res.send(500, { error : err });
    groups.forEach(function(id) {
      // Optimistic (no error handling), might need tweeking
      bus.emit(['group', id, 'message'].join(':'), message);
    });

    res.send(message);
  });
  
};

// GET message/:id
exports.show = function(req, res) {
  var id = req.params.id,
      messages = req.user.get('messages');

  if(!~messages.indexOf(id)) {
    return res.send(500, { error : 'Cannot find this message' });
  }

  Message.find(id, function(err, message) {
    if(err) return res.send(500, { error : err });
    return res.send(message);
  });
};
