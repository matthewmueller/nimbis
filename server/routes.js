/**
 * routes.js - Routes contains all the routing that our application will use. 
 */

var app = require('./app'),
    controllers = app.controllers,
    auth = controllers.auth,
    server = app.server;

/*
  General
*/
app = controllers.app;
server.get('/', auth, app.index);

/*
  UI (development only)
*/
var ui = controllers.ui;
server.get('/ui/:view?/:example?', ui.index);