/*
  Module dependencies
*/
var express = require('express'),
    thimble = require('thimble'),
    socketIO = require('socket.io'),
    _ = require('underscore'),
    resource = require('express-resource'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/*
  Application variable
*/
var app = module.exports = {
  paths : {},
  controllers : {},
  models : {}
};

/*
  Set up the paths
*/
var controllerPath = app.paths.controllers = './server/controllers';
var modelPath = app.paths.models = './server/models';

/*
  Express
*/
// Create the server
var server = express.createServer();

// Express Configuration
server.configure(function() {
  server.use(express.methodOverride());
  server.use(express.bodyParser());
  server.use(express.favicon());
});
/*
  Thimble
*/

// Thimble Settings
thimble({
  namespace : "App",
  root : "./client"
});

// Thimble Configuration
thimble.configure(function(use) {
  use(thimble.flatten());
  use(require('./thimble/environment.js'));
  use(thimble.embed({
    'json' : 'JSON'
  }));
});

// Start thimble
thimble.start(server);

/*
  Socket.io
*/

// Start socket.io
var io = socketIO.listen(server),
    socketController = require(controllerPath + '/socket');

// socket.io configuration
io.configure('development', function() {
  io.set('log level', 2);
  io.set('transports', ['websocket']);
});

io.sockets.on('connection', function(socket) {
  _.each(socketController, function(fn, event) {
    socket.on(event, function(data) {
      return fn.call(socket, data, socket);
    });
  });
});

/*
  Authentication
*/
var authenticate = function(req, res, next) {
  var query = req.query;

  // If we are in development, allow query to log us in
  if(query.user && env === 'development') {
    var users = JSON.parse(require('fs').readFileSync('./client/development/data/users.json', 'utf8'));
    req.user = (users[query.user]) ? users[query.user] : users[0];
  } else {
    console.log('TODO: Connect to database');
  }

  next();
};

/*
  Development-only Routing 
*/
server.configure('development', function(){
  server.resource('ui/:view?/:example?', require(controllerPath + '/development').examples);
});

/*
  Routing
*/
server.get('/', authenticate, require(controllerPath + '/app').index);

/*
  Listen
*/
server.listen(3000);
console.log("server listening on port %d in %s mode", server.address().port, server.settings.env);

