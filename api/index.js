var app = module.exports = require('./app'),
    client = require('./support/client');

// Listen if we specify a port
if(process.argv[2]) {
  app.listen(process.argv[2]);
  console.log('Server started on port', process.argv[2]);
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