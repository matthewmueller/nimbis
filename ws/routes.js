exports.authenticate = function(id, socket) {
  socket.user = id;
  socket.emit('authenticated');
};