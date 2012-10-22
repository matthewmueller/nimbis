/**
 * Module Dependencies
 */

var Emitter = require('emitter'),
    EIO = window.eio; // TODO: Fork and fix

/**
 * Export `IO`
 */

module.exports = IO;

/**
 * Initialize `IO`
 */

function IO(options) {
  var socket = this.socket = new EIO.Socket(options || {});
  Emitter.call(this);

  // Events
  socket.on('open', this.open.bind(this));
  socket.on('close', this.close.bind(this));
  socket.on('error', this.error.bind(this));
  socket.on('message', this.message.bind(this));
}

/**
 * Called when the socket is opened
 *
 * @return {IO}
 */

IO.prototype.open = function() {
  this.emit('open');
  return this;
};

/**
 * Called when the socket is closed
 *
 * @param {Object} message
 * @return {IO}
 */

IO.prototype.close = function(message) {
  this.emit('close', message);
  return this;
};

/**
 * Called when an error has occurred
 *
 * @param {Object} message
 * @return {IO}
 */

IO.prototype.error = function(message) {
  this.emit('error', message);
  return this;
};

/**
 * Called when a message is recieved
 *
 * @param {Object} message
 * @return {IO}
 */

IO.prototype.message = function(message) {
  this.emit('message', message);
  return this;
};
