/**
 * FINISH ME: This should be on a per-socket basis...
 */

/**
 * Module dependencies
 */

var Emitter = require('events').EventEmitter;

/**
 * Export `IO`
 */

module.exports = IO;

/**
 * Initialize `IO`
 */

function IO(socket) {
  this.socket = socket;
  Emitter.call(this);
  socket.on('message', this.message.bind(this));
}

/**
 * Inherit from `Emitter.prototype`.
 */

IO.prototype.__proto__ = Emitter.prototype;

/**
 * Called when a message is recieved
 *
 * @param {Object} message
 * @return {IO}
 */

IO.prototype.message = function(message) {
  message = JSON.parse(message);
  this.emit.apply(this, [message.event].concat(message.message));
  return this;
};

/**
 * Send a message to a particular client
 *
 * @param {Object} client
 * @param {String} event
 * @param {Mixed, ...} message
 * @return {IO}
 */

IO.prototype.send = function(client, event, message) {
    message = Array.prototype.slice.call(arguments);
    client = message.shift();
    event = message.shift();

    client.send(JSON.stringify({
      event : event,
      message : message
    }));
};


