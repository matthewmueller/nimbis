/**
 * index.js - Initializes our application. It all starts here.
 * 
 * Run `node index.js` to start our application in the `development` environment
 * 
 * `NODE_ENV=production node index.js` will run our application in `production`
 */

var path = require('path'),
    join = path.join,
    app = require(join(__dirname, 'server/app')),
    config = join(__dirname, 'server/configuration') + '/';

/**
 * Load express configuration
 */
require(config + 'express');

/**
 * Load socket.io configuration
 */
require(config + 'socket.io');

/**
 * Load thimble configuration
 */
require(config + 'thimble');

/**
 * Load redis configuration
 */
require(config + 'redis');

/**
 * Load the routing
 */
require('./server/routes.js');

// Start the server
app.server.listen(3000);
console.log('Server listening on port: ' + app.server.address().port);