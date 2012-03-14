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
    utils = require('./utils'),
    express = require('express'),
    load = utils.loadDirectorySync,
    extname = path.extname,
    basename = path.basename,
    resolve = path.resolve,
    normalize = path.normalize,
    join = path.join,
    _ = require('underscore');
    
/**
 * Export the `app` object
 */
var app = module.exports = {};

/**
 * Global Application Paths
 */
var paths = app.paths = {
  server : __dirname,
  root : resolve('./'),
};

// Set up the rest of the paths
paths.client = join(paths.root, 'client');
paths.models = join(paths.server, 'models');
paths.controllers = join(paths.server, 'controllers');

/**
 * Application environment
 */
var env = app.env = process.env.NODE_ENV || 'development';

/**
 * Lazy-load Controllers
 */
var controllers = app.controllers = load({}, paths.controllers);

/**
 * Lazy-load Models
 */
var models = app.models = load({}, app.paths.models);

/**
 * Express server
 * 
 * Configuration:
 * - methodOverride
 * - bodyParser
 * - favicon
 * 
 */
var server = app.server = express.createServer();

// Configuration for all environments
server.configure(function() {
  server.use(express.methodOverride());
  server.use(express.bodyParser());
  server.use(express.favicon());
});

/**
 * Thimble for development
 * 
 * 
 */
var thimble = app.thimble = require('thimble');

// Set the root as the client
thimble.set('root', app.paths.client);

// Set the client-side namespace
thimble.set('namespace', 'App');

// Configiration for all environments
thimble.configure(function(use) {
  use(thimble.flatten());
  use(thimble.embed({
    'json' : 'JSON'
  }));
});

thimble.start(server);

/**
 * Socket.io for realtime
 * 
 * 
 * 
 */
var io = app.io = require('socket.io').listen(server);

// Configuration for all environments
io.configure(function() {
  this.set('log level', 2);
  this.set('transports', ['websocket']);
});

// Bind events on connect
io.on('connection', function(socket) {
  _.each(app.controllers.socket, function(action, event) {
    socket.on(event, function(payload) {
      return action.call(null, socket, payload);
    });
  });
});

/**
 * Redis client for database
 * 
 * Detect Buffers - If set to true, then replies will be sent to callbacks as node 
 * Buffer objects if any of the input arguments to the original command were 
 * Buffer objects.
 * 
 */
var redis = app.redis = require('redis').createClient(null, null, {
  detect_buffers : true
});

// Redis events
redis.on('ready', function() {
  console.log('Redis listening on port: %d', port);
});

redis.on('error', function() {
  console.log('Redis: Unable to connect to redis database');
});
