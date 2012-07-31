var app = module.exports = require('./app'),
    client = require('./support/client');

// Listen if we are running this file directly
if(!module.parent) {
  var port = process.argv[2] || 8080;
  app.listen(port);
  console.log('Server started on port', port);
}

/*
 * Connect to redis
 */

// Redis events
client.on('ready', function() {
  console.log('Redis listening on port: %d', client.port);
});

client.on('error', function() {
  console.log('Redis: Unable to connect to redis database');
});