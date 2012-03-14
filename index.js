/**
 * index.js - Initializes our application. It all starts here.
 * 
 * Run `node index.js` to start our application in the `development` environment
 * 
 * `NODE_ENV=production node index.js` will run our application in `production`
 */  
var app = require('./server/app'),
    server = app.server;

/**
 * Start the server
 */
server.listen(3000);
console.log('Server listening on port: %d', server.address().port);