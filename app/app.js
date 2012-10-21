/**
 * Module dependencies
 */

var express = require('express'),
    jay = require('jay'),
    cons = require('consolidate'),
    path = require('path'),
    request = require('superagent'),
    join = path.join,
    app = module.exports = express();

/**
 * Configure `jay`
 */

jay.root(__dirname)
   .include('/vendor/normalize.css')
   // Include this, because we want our UI tests to inherit
   .include('/views/layout/layout.styl')
   .include('hogan.js', '/vendor/hogan.js')
   .alias('app', '/support/app.js')
   .alias('jquery', '/vendor/jquery.js')
   .alias('underscore', '/vendor/underscore.js')
   .alias('backbone', '/vendor/backbone.js')
   .alias('superagent', '/vendor/superagent.js')
   .alias('bus', '/support/bus.js');

/**
 * Configuration
 */

app.configure(function() {
  app.set('views', join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.query());
  app.use(express.bodyParser());
  app.use(express.cookieParser('keyboard cat'));
  app.use(express['static'](join(__dirname, 'build')));
  app.use(express['static'](join(__dirname, 'vendor')));
});

app.configure('development', function() {
  app.engine('jade', jay(cons.jade));
});

/**
 * Routes
 */

var controllers = join(__dirname, 'controllers'),
    index = require(controllers + '/index'),
    authorize = require(controllers + '/authorize');

// Index
app.get('/', fetchData, index.index);

// Pass-throughs
// TODO: Find a cleaner way to do this, should *all* pass-through?
// - I kind of doubt it, probably want to be explicit, annoying though..
app.get('/join', fetchData, index.index);
app.get('/create', fetchData, index.index);
app.get('/messages/:id', fetchData, index.index);

// Login/Logout
app.get('/login', authorize.index);
app.post('/login', authorize.create);
app.get('/logout', authorize.destroy);

// Test a UI component
app.get('/ui/:component/test', fetchData, function(req, res) {
  var component = req.params.component,
      p = join(__dirname, 'ui', component, 'test');

  res.render(p, {
    user : JSON.stringify(req.user),
    messages : JSON.stringify(req.messages)
  });
});
// // Test dialog route
// app.get('/test/dialog', fetchData, function(req, res) {
//   res.render('../ui/dialogs/test');
// });

/**
 * Fetch the user and message data from the API
 */

function fetchData(req, res, next) {
  var token = req.cookies.token;
      pending = 2;

  if(!token) return res.redirect('/login');

  // Fetch user data
  request
    .get('api.nimbis.com:8080/users')
    .set('Cookie', 'token=' + token)
    .end(function(r) {
      if(!r.ok) return res.redirect('/login');
      req.user = r.body;
      if(!--pending) return next();
    });

  // Fetch the messages
  request
    .get('api.nimbis.com:8080/messages')
    .set('Cookie', 'token=' + token)
    .end(function(r) {
      if(!r.ok) return next();
      req.messages = r.body;
      if(!--pending) return next();
    });
}

/**
 * Listen if we are running this file directly
 */

if(!module.parent) {
  var port = process.argv[2] || 8080;
  app.listen(port);
  console.log('Server started on port', port);
}
