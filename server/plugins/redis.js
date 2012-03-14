/**
 * Redis.js - Contains all the redis configuration to connect to the database
 */
exports = module.exports = require('redis');

/**
 * Redis port
 */
var port = exports.port = 6379;

/**
 * Redis host
 */
var host = exports.host = '127.0.0.1';

/**
 * Redis options
 * 
 * Detect Buffers - If set to true, then replies will be sent to callbacks as node 
 * Buffer objects if any of the input arguments to the original command were 
 * Buffer objects.
 * 
 */
var options = exports.options = {
  detect_buffers : true
};

/**
 * On `ready` function
 */
exports.ready = function() {
  console.log('Redis listening on port: %d', port);
};

/**
 * On `error` function
 */
exports.error = function() {
  console.log('Redis: unable to connect to redis database');
};
