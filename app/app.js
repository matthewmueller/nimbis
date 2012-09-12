/**
 * Module dependencies
 */

var express = require('express'),
    jay = require('jay'),
    cons = require('consolidate'),
    path = require('path'),
    join = path.join,
    app = module.exports = express();

/**
 * Configure `jay`
 */

jay.root(__dirname)
   .main('boot.js')
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

app.get('/', index.index);
app.get('/join', index.index);
app.get('/messages/:id', index.index);

// Login/Logout
app.get('/login', authorize.index);
app.post('/login', authorize.create);
app.get('/logout', authorize.destroy);

function isAuthorized(req, res, next) {
  console.log('body', req.cookies);
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
