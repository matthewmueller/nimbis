/*
 * Module Dependencies
 */

var express = require('express'),
    jade = require('jade'),
    client = require('./support/client'),
    RedisStore = require('connect-redis')(express),
    User = require('./models/User'),
    app = module.exports = express();

/*
 * Application environment
 */

var env = app.env = process.env.NODE_ENV || 'development';

/*
 * Connect to redis
 */

client.on('ready', function() {
  console.log('Redis listening on port: %d', client.port);
});

client.on('error', function() {
  console.log('Redis: Unable to connect to redis database');
});

/**
 * Configure RedisStore
 */

var redisStore = new RedisStore({
  client : client,
  ttl : 60 * 60, // 1hr
  prefix : 'token:'
});

/*
 * Configuration
 */

app.configure(function() {
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.query());
  app.use(allowAccessToken);
  app.use(allowCORS);
  app.use(express.session({
    store : redisStore,
    secret : 'keyboard cat',
    cookie : { domain : '.nimbis.com' },
    key : 'token'
  }));
  app.use(express['static'](__dirname + '/cms'));
});

/**
 * Allow CORS
 */

function allowCORS(req, res, next){
  res.set('Access-Control-Allow-Origin', 'http://nimbis.com:8080');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.set('Access-Control-Allow-Credentials', true);

  // Respond OK if the method is OPTIONS
  if(req.method === 'OPTIONS') {
    return res.send(200);
  } else {
    return next();
  }
}

// app.options('*', function(req, res, next) {
//   console.log(req.header());
//   console.log(res._headers);
//   res.send(200);
// });

/*
 * API:
 *
 * GET     /                 ->  index
 * GET     /new              ->  new
 * POST    /                 ->  create
 * GET     /:id              ->  show
 * GET     /:id/edit         ->  edit
 * PUT     /:id              ->  update
 * DELETE  /:id              ->  destroy
 *
 */

/**
 * -----------
 * Controllers
 * -----------
 */

var authorize = require('./controllers/authorize'),
    user = require('./controllers/user'),
    group = require('./controllers/group'),
    message = require('./controllers/message'),
    comment = require('./controllers/comment');

/**
 * Index
 */

app.get('/', function(req, res) {
  res.send('welcome to api.nimbis');
});

app.get('/cms', function(req, res) {
  res.render(__dirname + '/cms/cms.jade');
});

/**
 * Authorize
 */

app.post('/authorize', authorize);

/**
 * Groups
 */

app.get('/groups', fetchUser, group.index);
app.post('/groups', fetchUser, group.create);
app.get('/groups/:id', fetchUser, group.show);

/**
 * Users
 */

app.get('/users', user.index);
app.post('/users', user.create);
app.get('/users/:id', user.show);
app.post('/join', fetchUser, user.join);

/**
 * Messages
 */

app.get('/messages', fetchUser, message.index);
app.post('/messages', fetchUser, message.create);
app.get('/messages/:id', fetchUser, message.show);

/**
 * Comments
 */

app.get('/messages/:messageId/comments', fetchUser, comment.index);
app.post('/messages/:messageId/comments', fetchUser, comment.create);
app.get('/messages/comments/:id', fetchUser, comment.show);


/**
 * ----------
 * Middleware
 * ----------
 */

/*
 * Check if the user is authenticated
 *
 * Can authenticate either through cookies or a query-string
 */

function fetchUser(req, res, next) {
  if(!req.session || !req.session.userId) return res.send(401);
  User.find(req.session.userId, function(err, user) {
    if(err) return next(err);
    else if(!user) return res.send(401);
    req.user = user;
    return next();
  });
}

/**
 * Allow access token to be send through a query
 */

function allowAccessToken(req, res, next) {
  var token = req.query.token;
  if(!token || req.cookies.token) return next();
  // req.cookies.token = token;
  next();
}

/**
 * Bind to a port if this file is called directly
 */

if(!module.parent) {
  var port = process.argv[2] || 8080;
  app.listen(port);
  console.log('Server started on port', port);
}
