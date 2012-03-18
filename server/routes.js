var app = require('./app'),
    server = app.server,
    controllers = app.controllers,
    auth = controllers.auth;

/**
 * Set up the routing
 */

// UI
var ui = controllers.ui;
server.get('/ui/:view?/:example?', ui.index);

// Signup
var signup = controllers.signup;
server.get('/signup', signup.index);
server.post('/signup', signup.create);

// App
var app = controllers.index;
server.get('/*', auth, app.index);