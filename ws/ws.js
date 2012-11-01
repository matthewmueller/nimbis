var express = require('express'),
    _ = require('underscore'),
    engine = require('engine.io'),
    request = require('superagent'),
    IO = require('./io'),
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
  var clients = es.clients,
      req = socket.transport.request,
      groups = req.groups,
      token = req.cookies.token;

  if(!groups) return socket.close();

  // Add connected socket to Groups object
  groups = _.pluck(groups, '_id');
  groups.forEach(function(group) {
    if(!Groups[group]) Groups[group] = [];
    Groups[group].push(socket.id);
  });

  /**
   * Handle socket messages
   */
  
  var io = new IO(socket);

  io.on('message', function(message) {
    var self = this,
        sockets = [];

    message.groups.forEach(function(group) {
      sockets = sockets.concat(Groups[group]);
    });

    sockets = _.uniq(sockets);
    sockets = _.without(sockets, this.socket.id);

    sockets.forEach(function(socket) {
      var client = clients[socket];
      if(!client) return;

      // TODO: Consider modifying Client.prototype.send...
      self.send(client, 'message', message);
    });
  });

  io.on('comment', function(comment) {
    var self = this,
        messageId = comment.messageId;

    // TODO: Refactor. This is pretty ugly... and much of both `message` and
    // `comment` can be merged into 1 function, also we can use a message cache
    // to save network calls
    request
      .get('api.nimbis.com:8080/messages/' + messageId)
      .set('Cookie', 'token=' + token)
      .end(function(res) {
        if(!res.ok) {
          // TODO: Figure out how to do error handling here.
          self.socket.close();
          throw new Error('WS: error getting message', res.text);
        }

        var body = res.body,
            groups = body.groups,
            sockets = [];
        
        if(!groups) return;

        groups.forEach(function(group) {
          sockets = sockets.concat(Groups[group]);
        });

        sockets = _.uniq(sockets);
        sockets = _.without(sockets, self.socket.id);

        sockets.forEach(function(socket) {
          var client = clients[socket];
          if(!client) return;

          // TODO: Consider modifying Client.prototype.send...
          self.send(client, 'comment', comment);
        });
      });

  });

  /**
   * Handle the socket closing
   */
  
  io.socket.on('close', function() {
    groups.forEach(function(group) {
      Groups[group] = _.without(Groups[group] || [], io.socket.id);
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
