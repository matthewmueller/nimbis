var express = require('express'),
    _ = require('underscore'),
    engine = require('engine.io'),
    request = require('superagent'),
    app = module.exports = express(),
    es = app.es = new engine.Server();

/**
 * Groups -> Connected users
 */

var Groups = {};

/**
 * Configuration
 */

app.configure(function() {
  app.use(express.query());
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

  /**
   * Handle socket messages
   */
  
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

  /**
   * Handle the socket closing
   */
  
  socket.on('close', function() {
    groups.forEach(function(group) {
      Groups[group] = _.without(Groups[group] || [], socket.id);
      if(!Groups[group].length) delete Groups[group];
    });
  });

});

/**
 * ws.nimbis.com route
 */

app.get('/', function(req, res) {
  res.send('socket server running');
});

/**
 * Fetch a user's groups
 */

function fetchGroups(req, res, next) {
  // If we have an SID, don't query again
  if(req.query.sid) return next();

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

/**
 * Listen if we are calling this file directly
 */
if(!module.parent) {
  var port = process.argv[2] || 8080;
  app.listen(port);
  console.log('Server started on port', port);
}
