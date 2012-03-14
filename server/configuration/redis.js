/**
 * Redis.js - Contains all the redis configuration to connect to the database
 * 
 * Also initializes and connects to the database
 */

var app = require('../app'),
    redis = app.redis,
    options = {},
    port, host;

/**
 * Redis port
 */
port = 6379;

/**
 * Redis host
 */
host = '127.0.0.1';

/**
 * Redis options
 * 
 * Detect Buffers - If set to true, then replies will be sent to callbacks as node 
 * Buffer objects if any of the input arguments to the original command were 
 * Buffer objects.
 * 
 */
options.detect_buffers = true;

/**
 * Create the redis client
 */
redis = app.redis = redis.createClient(port, host, options);

/**
 * Redis: when `ready`, fire this event
 */
redis.on('ready', function() {
  console.log('Redis:', 'Connected to redis!');
});

/**
 * Redis: if `error`, fire this event
 */
redis.on('error', function() {
  console.log('Redis:', 'Unabled to connect to redis');
});