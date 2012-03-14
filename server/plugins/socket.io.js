var socketIO = require('socket.io'),
    _ = require('underscore');


/**
 * Export the `listen` function
 */
var listen = exports.listen = function(server) { 
  var io = socketIO.listen(server);

  // Configuration
  io.configure(configure);
  io.configure('development', configure.development);

  return io;
};

/**
 * Configure: All environments
 */
var configure = exports.configure = function() {

};

/**
 * Configure: Development environment
 */
configure.development = function() {
  io.set('log level', 2);
  io.set('transports', ['websocket']);
};

/**
 * Bind the socket event to an action
 */
var bind = exports.bind = function(action, event) {
  var socket = this;

  socket.on(event, function(payload) {
    return action.call(socket, payload, socket);
  });
};