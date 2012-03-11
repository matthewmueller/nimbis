(function(io) {

  /*
    connect - Initiated when socket.io connects
  */
  io.on('connect', function() {
    // Pass groupIDs up to server for fast lookup
    io.emit('user:connect', App.DS.groups.pluck('id'));    
  });

  /*
    message:create - Run when message is recieved
  */
  io.on('message:create', function(message) {
    App.DS.messages.add(message);
  });

}(App.IO));