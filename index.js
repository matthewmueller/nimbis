/*
  Module dependencies
*/
var express = require('express'),
    thimble = require('thimble'),
    resource = require('express-resource');

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
  Development-only Routing 
*/
server.configure('development', function(){
  server.resource('ui/:view?/:example?', require(controllerPath + '/development').examples);
});

/*
  Socket.io
*/


/*
  Routing
*/

server.resource('/', require(controllerPath + '/app'));

/*
  Listen
*/
server.listen(3000);
console.log("server listening on port %d in %s mode", server.address().port, server.settings.env);