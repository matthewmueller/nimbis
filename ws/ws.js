var express = require('express'),
    _ = require('underscore'),
    engine = require('engine.io'),
    request = require('superagent'),
    app = module.exports = express(),
    es = app.es = new engine.Server(),
    routes = require('./routes');

/**
 * Groups -> Connected users
 */

var Groups = {};

/**
 * Configuration
 */

app.configure(function() {
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(fetchGroups);
  app.use(es.handleRequest.bind(es));
});

/**
 * Handle the connection
 */

es.on('connection', function(socket) {
  var clients = socket.server.clients,
      groups = socket.transport.request.groups;

  if(!groups) return socket.close();

  groups = _.pluck(groups, '_id');
  groups.forEach(function(group) {
    if(!Groups[group]) Groups[group] = [];
    Groups[group].push(socket.id);
  });

  socket.on('message', function(message) {
    var sockets = [];
    groups.forEach(function(group) {
      sockets = sockets.concat(Groups[group]);
    });

    sockets = _.uniq(sockets);
    sockets = _.without(sockets, socket.id);
    
    sockets.forEach(function(socket) {
      var client = clients[socket];
      if(!client) return;
      client.send(message);
    });
  });

  socket.on('close', function() {
    groups.forEach(function(group) {
      Groups[group] = _.without(Groups[group] || [], socket.id);
      if(!Groups[group].length) delete Groups[group];
    });
  });

});

app.get('/', function(req, res) {
  res.send('socket server running');
});

/**
 * Fetch a user
 */

function fetchGroups(req, res, next) {
  var token = req.cookies.token;
  if(!token) return res.redirect('/login');

  request
    .get('api.nimbis.com:8080/groups')
    .set('Cookie', 'token=' + token)
    .end(function(r) {
      if(!r.ok) return res.redirect('/login');
      req.groups = r.body;
      next();
    });
}

// Listen if we are running this file directly
if(!module.parent) {
  var port = process.argv[2] || 8080;
  app.listen(port);
  console.log('Server started on port', port);
}

// // Socket Authorization
// // io.set('authorization', function(data, accept) {
// //   console.log(data.headers);
// //   if(!data.headers.cookie) return accept('No cookies transmitted.', false);

// //   console.log(data.headers);
// //   // // Note, this is part of connects *private* API (could change)
// //   // data.cookie = parseSignedCookie(data.headers.cookie);
// //   // data.cookie = parseSignedCookies(data.cookie, 'secretz');

// //   // console.log(data.cookie);
// //   // data.sessionID = data.cookie['sessionID'];
// //   if(!data.sessionID) return accept('Could not get sessionID', false);

// //   accept(null, true);
// // });

// io.sockets.on('connection', function(socket) {
//   var router = function(fn) {
//     return function(message) {
//       fn.call(null, message, socket);
//     };
//   };

  // for(var route in routes) {
  //   socket.on(route, router(routes[route]));
  // }
// });

// app.get('/', function(req, res) {
//   res.send('welcome to socket.io');
// });

// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
}
