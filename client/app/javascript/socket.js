(function(io) {

  /*
    connect - Initiated when socket.io connects
  */
  io.on('connect', function() {
    // Pass groupIDs up to server for fast lookup
    io.emit('user:connect', App.DS.groups.pluck('id'));    
  });

  /*
    message:create - Called when message is added
  */
  io.on('message:create', function(message) {
    App.DS.messages.add(message);
  });

  /*
    comment:create - Called when a comment is added
  */
  io.on('comment:create', function(comment) {
    console.log(comment);
  });

}(App.IO));