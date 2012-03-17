/**
 * index.js - Initializes our application. It all starts here.
 * 
 * Run `node index.js` to start our application in the `development` environment
 * 
 * `NODE_ENV=production node index.js` will run our application in `production`
 */  
var app = require('./server/app'),
    controllers = app.controllers,
    server = app.server,
    auth = controllers.auth,
    main = controllers.app,
    signup = controllers.signup,
    ui = controllers.ui;

/**
 * Set up the routing
 */

// App
server.get('/', auth, main.index);

// UI
server.get('/ui/:view?/:example?', ui.index);

// Signup
server.get('/signup', signup.index);
server.post('/signup', signup.create);

/**
 * Start the server
 */
server.listen(3000);
console.log('Server listening on port: %d', server.address().port);