var express = require('express'),
    superagent = require('superagent'),
    engine = require('engine.io'),
    app = module.exports = express(),
    es = app.es = new engine.Server(),
    routes = require('./routes');

app.configure(function() {
  app.use(express.cookieParser());
  app.use(authenticate);
  app.use(app.router);
  app.use(es.handleRequest.bind(es));
});

es.on('connection', function(socket) {
  var headers = socket.transport.request.headers;
  // console.log('headers', headers);
  for(var route in routes) {
    // socket.on(route, routes(routes[route]));
  }
});

app.get('/', function(req, res) {
  res.send('socket server running');
});

function authenticate(req, res, next) {
  // res.send(404);
  console.log(req.cookies);
  next();
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
