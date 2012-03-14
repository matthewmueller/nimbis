/*
  socket.js - controller for socket communications
*/
var _ = require('underscore');

/*
  TEMPORARY: Until we have database
*/
var messages = require('fs').readFileSync('./client/development/data/messages.json', 'utf8');
messageList = JSON.parse(messages);
messages = {};
_.each(messageList, function(message) {
  messages[message.id] = message;
});
/*
  END TEMPORARY
*/

/*
  user:connect - used to obtain user information when clients connect
*/
exports['user:connect'] = function(socket, groupIDs) {
  var sender = socket.id,
      groupID;

  for(var i = 0; i < groupIDs.length; i++) {
    groupID = groupIDs[i];

    // Join 'group:id' room
    socket.join('group:' + groupID);
  }

};

/*
  message:create - called when messages are created, will broadcast
  to connected clients that are in the groups that the sender sent to.

  Also will add message to database.
*/
exports['message:create'] = function(socket, message) {
  var sender = socket.id,
      groups = [],
      clients = {};

  console.log('lol');
  _.each(message.groups, function(group, i) {
    groups.push(group.id);
  });

  console.log('message id (from socket.js message:create)', message.id);

  // Replace message.group object with array of group IDs
  message.groups = groups;

  // Broadcast to member of each of the message's groups
  _.each(groups, function(groupID) {
    socket.broadcast.to('group:' + groupID).emit('message:create', message);
  });
  
};

/*
  comment:create - called when comments are created, will broadcast
*/

