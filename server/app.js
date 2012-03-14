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
    load = utils.loadDirectorySync,
    extname = path.extname,
    basename = path.basename,
    normalize = path.normalize,
    join = path.join,
    _ = require('underscore');
    
/**
 * Our server's main object
 * 
 * Export the `app` object
 * 
 */
var app = module.exports = {};

/**
 * Global Application Paths
 */
var paths = app.paths = {
  server : __dirname,
  root : normalize('../'),
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
 * Plugins
 * 
 * These will be used to enrich our server. They should 
 * probably be self-contained.
 * 
 */

/**
 * Express server
 */
var server = app.server = require('./plugins/express');

/**
 * Thimble for development
 */
var thimble = app.thimble = require('./plugins/thimble');
thimble.start(server);

/**
 * Socket.io for realtime
 */
var io = require('./plugins/socket.io');
app.io = io.listen(server);

/**
 * Redis client for database
 */
var redis = require('./plugins/redis');
app.redis = redis.createClient(redis.port, redis.host, redis.options);

/**
 * Load the routes
 * 
 * TODO: Fix.
 * 
 */
require('./routes');

/**
 * Connection events and bindings
 * 
 * This section sets up the listening and bindings.
 * 
 */

// Socket.io - Bind the socket events to controller actions
app.io.sockets.on('connection', function(socket) {
  _.each(app.controllers.socket, io.bind, socket);
});

// Redis events
app.redis.on('ready', redis.ready);
app.redis.on('error', redis.error);

