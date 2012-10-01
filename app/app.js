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
   .main('boot.js')
   .include('/vendor/normalize.css')
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
 * Controllers
 */

var controllers = join(__dirname, 'controllers'),
    index = require(controllers + '/index'),
    authorize = require(controllers + '/authorize');

app.get('/test/dialog', function(req, res) {
  res.render('../ui/dialogs/test.jade');
});

app.get('/', fetchUser, fetchMessages, index.index);

// Pass-throughs
// TODO: Find a cleaner way to do this, should *all* pass-through?
// - I kind of doubt it, probably want to be explicit, annoying though..
app.get('/join', fetchUser, fetchMessages, index.index);
app.get('/create', fetchUser, fetchMessages, index.index);

app.get('/messages/:id', fetchUser, fetchMessages, index.index);

// Login/Logout
app.get('/login', authorize.index);
app.post('/login', authorize.create);
app.get('/logout', authorize.destroy);

function fetchUser(req, res, next) {
  var token = req.cookies.token;
  if(!token) return res.redirect('/login');

  request
    .get('api.localhost:8080/users')
    .set('Cookie', 'token=' + token)
    .end(function(r) {
      if(!r.ok) return res.redirect('/login');
      req.user = r.body;
      next();
    });
}

function fetchMessages(req, res, next) {
  var token = req.cookies.token,
      user = req.user,
      messages = req.messages = [];

  if(!user) return next();

  request
    .get('api.localhost:8080/messages')
    .set('Cookie', 'token=' + token)
    .end(function(r) {
      if(!r.ok) return next();
      req.messages = r.body;
      return next();
    });
}

// Refactor
// app.get('/messages/:id', function(req, res, next) {
//   res.render('index/index.mu', {
//     layout : 'layouts/base/base.mu',
//     user : JSON.stringify(users[0]),
//     messages : JSON.stringify(messages),
//     title : "nimbis"
//   });
// });

// app.get('/groups/:id/edit', function(req, res, next) {
//   res.render('index/index.mu', {
//     layout : 'layouts/base/base.mu',
//     user : JSON.stringify(users[0]),
//     messages : JSON.stringify(messages),
//     title : "nimbis"
//   });
// });

// app.get('/join', function(req, res, next) {
//   res.render('index/index.mu', {
//     layout : 'layouts/base/base.mu',
//     user : JSON.stringify(users[0]),
//     messages : JSON.stringify(messages),
//     title : "nimbis"
//   });
// });

// app.get('/workspace/:workspace?', function(req, res) {
//   res.render('workspace/workspace.mu', {
//     layout : 'layouts/base/base.mu',
//     user : JSON.stringify(users[0]),
//     messages : JSON.stringify(messages),
//     title : "nimbis workspace"
//   });
// });

// app.get('/', function(req, res) {
//   res.render('index/index.mu', {
//     layout : 'layouts/base/base.mu',
//     user : JSON.stringify(users[0]),
//     messages : JSON.stringify(messages),
//     title : "nimbis"
//   });
// });

// Listen if we are running this file directly
if(!module.parent) {
  var port = process.argv[2] || 8080;
  app.listen(port);
  console.log('Server started on port', port);
}
