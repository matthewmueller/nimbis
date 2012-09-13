/*
 * Module Dependencies
 */

var express = require('express'),
    client = require('./support/client'),
    RedisStore = require('connect-redis')(express),
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
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.query());
  app.use(allowAccessToken);
  app.use(express.session({
    store : redisStore,
    secret : 'keyboard cat',
    key : 'token'
  }));
});

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

var User = require('./models/user');

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

/**
 * Authorize
 */

app.post('/authorize', authorize);

/**
 * Groups
 */

app.get('/groups', isAuthorized, group.index);
app.post('/groups', isAuthorized, group.create);
app.get('/groups/:id', group.show);

/**
 * Users
 */

app.get('/users', user.index);
app.post('/users', user.create);
app.get('/users/:id', user.show);
app.post('/join', isAuthorized, user.join);

/**
 * Messages
 */

app.post('/messages', isAuthorized, message.create);
app.get('/messages', isAuthorized, message.index);

/**
 * Comments
 */

app.post('/messages/:message/comments', isAuthorized, comment.create);
app.get('/messages/:message/comments', isAuthorized, comment.index);


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

function isAuthorized(req, res, next) {
  req.token = req.query.token || req.cookies.token;
  if(!req.token) return res.send(401);
  return next();
}

/**
 * Allow access token to be send through a query
 */

function allowAccessToken(req, res, next) {
  var token = req.query.token;
  if(!token || req.cookie.token) return next();
  req.cookie.token = token;
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
