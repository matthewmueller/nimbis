var engine = require('engine.io'),
    server = module.exports = new engine.Server(),
    routes = require('./routes');

server.on('connection', function(socket) {
  console.log('yes!!!');
});

// Listen if we are running this file directly
if(!module.parent) {
  var port = process.argv[2] || 8080;
  // app.listen(port);
  console.log('Server started on port', port);
}

server.set('authorization', function(data, accept) {
  console.log(data);
});

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

//   for(var route in routes) {
//     socket.on(route, router(routes[route]));
//   }
// });

// app.get('/', function(req, res) {
//   res.send('welcome to socket.io');
// });

// ## CORS middleware
//
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
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
