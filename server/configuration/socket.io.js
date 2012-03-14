var _ = require('underscore'),
    app = require('../app'),
    io  = app.io,
    controller = app.controllers.socket;

/**
 * Socket.io configuration in the development environment
 */
io.configure('development', function() {
  io.set('log level', 2);
  io.set('transports', ['websocket']);
});

/**
 * Socket.io: Fired when socket.io establishes a `connection`
 */
io.sockets.on('connection', function(socket) {

  // Bind the socket events to controller actions
  _.each(controller, function(fn, event) {
    
    socket.on(event, function(data) {
      return fn.call(socket, data, socket);
    });

  });
});
