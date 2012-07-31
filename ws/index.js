var express = require('express'),
    app = module.exports = express();
    io = require('socket.io').listen(app),
    routes = require('./routes');

// Listen if we specify a port
if(process.argv[2]) {
  app.listen(process.argv[2]);
  console.log('Server started on port', process.argv[2]);
}

// Socket Authorization
io.set('authorization', function(data, accept) {
  console.log(data.headers);
  if(!data.headers.cookie) return accept('No cookies transmitted.', false);

  console.log(data.headers);
  // // Note, this is part of connects *private* API (could change)
  // data.cookie = parseSignedCookie(data.headers.cookie);
  // data.cookie = parseSignedCookies(data.cookie, 'secretz');

  // console.log(data.cookie);
  // data.sessionID = data.cookie['sessionID'];
  if(!data.sessionID) return accept('Could not get sessionID', false);

  accept(null, true);
});

io.sockets.on('connection', function(socket) {
  var router = function(fn) {
    return function(message) {
      fn.call(null, message, socket);
    };
  };

  for(var route in routes) {
    socket.on(route, router(routes[route]));
  }
});

app.get('/', function(req, res) {
  res.send('welcome to socket.io');
});