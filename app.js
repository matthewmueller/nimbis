/*
  Module dependencies
*/
var express = require('express'),
    thimble = require('thimble'),
    resource = require('express-resource');

/*
  Set up the paths
*/
var paths = {
  controllers : './app/controllers',
  models : './app/models'
};

/*
  Express
*/
// Create the server
var app = express.createServer();

// Express Configuration
app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.favicon());
});

/*
  Thimble
*/
// Thimble Settings
thimble({
  root : "./views",
  build : "./build",
  public : "./public"
});

// Thimble Configuration
thimble.configure(function(use) {
  use(thimble.flatten());
  use(thimble.embed());
});

// Start thimble
thimble.start(app);

/*
  Routing
*/

app.resource('/', require(paths.controllers + '/index'));


/*
  Listen
*/
app.listen(8080);
console.log("server listening on port %d in %s mode", 
  app.address().port, app.settings.env);