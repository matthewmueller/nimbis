var app = require('./app'),
    server = app.server,
    controllers = app.controllers,
    auth = controllers.auth;

var auth = function(req, res, next) {
  var query = req.query,
      User  = app.models.User;

  var redirect = function(err, user) {
    if(err) return next(err);
    if(!user) res.redirect('/signup');
    else {
      req.user = user;
      next();
    }
  };

  // If we are in development, allow query to log us in
  if(query.user && app.env === 'development') {
    User.devAuthenticate(query.user, redirect);
  } else {
    User.authenticate(req.body, req.password, redirect);
  }

};

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

// Application index
var index = controllers.index;
server.get('/*', auth, index.index);