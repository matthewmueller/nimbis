/**
 * app.js - This file initializes the server's `app` object
 * 
 * The app object has the following contents:
 *
 *  paths : paths throughout our application
 *  env : application environment (development, production, staging, etc..)
 *  server : express server
 *  thimble : thimble object
 *  io : socket.io object
 *  redis : redis object
 *  controllers : controller classes in our application
 *  models : model classes in our application
 *  
 */

var fs = require('fs'),
    path = require('path'),
    extname = path.extname,
    basename = path.basename,
    normalize = path.normalize,
    join = path.join,
    app = {};

/**
 * Global Application Path
 */
var paths = app.paths = {
  server : __dirname,
  root : normalize('../'),
  client : join(root, 'client'),
  models : join(server, 'models'),
  controllers : join(server, 'controllers')
};

/**
 * Application environment
 */
var env = app.env = process.env.NODE_ENV || 'development';

/**
 * Express server
 */ 
var server = app.server = require('express').createServer();

/**
 * Thimble
 */
var thimble = app.thimble = require('thimble');

/**
 * Socket.io
 */
app.io = require('socket.io').listen(server);

/**
 * Redis client
 */
app.redis = require('redis');

/**
 * Lazy-load Controllers
 */
var controllers = app.controllers = {};
fs.readdirSync(paths.controllers).forEach(function(filename) {
  // If it's not a .js or .coffee file, skip
  if(!(/\.(js|coffee)$/).test(filename)) return;

  var name = basename(filename, extname(filename));

  function load() {
    return require(join(paths.controllers, name));
  }
  
  // Lazy load plugins
  controllers.__defineGetter__(name, load);
});

/**
 * Lazy-load Models
 */
var models = app.models = {};
fs.readdirSync(paths.models).forEach(function(filename) {
  // If it's not a .js or .coffee file, skip
  if(!(/\.(js|coffee)$/).test(filename)) return;
      
  function load() {
    return require(join(paths.models, filename));
  }
  
  // Lazy load plugins
  models.__defineGetter__(filename, load);
});

// Export the `app` object
module.exports = app;