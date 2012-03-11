/*
  socket.js - controller for socket communications
*/
var _ = require('underscore');

/*
  user:connect - used to obtain user information when clients connect
*/
exports['user:connect'] = function(groupIDs) {
  var sender = this.id,
      groupID;

  for(var i = 0; i < groupIDs.length; i++) {
    groupID = groupIDs[i];

    // Join 'group:id' room
    this.join('group:' + groupID);
  }

};

/*
  message:create - called when messages are created, will broadcast
  to connected clients that are in the groups that the sender sent to.

  Also will add message to database.
*/
exports['message:create'] = function(message, socket) {
  var sender = socket.id,
      groups = [],
      clients = {};

  _.each(message.groups, function(group, i) {
    groups.push(group.id);
  });

  // Replace message.group object with array of group IDs
  message.groups = groups;

  // Broadcast to member of each of the message's groups
  _.each(groups, function(groupID) {
    socket.broadcast.to('group:' + groupID).emit('message:create', message);
  });
  
};

