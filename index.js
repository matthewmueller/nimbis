var express = require('express'),
    port = process.argv[2] || 8080,
    app = express();

// Configure the virtual hosts
app.use(express.vhost('api.localhost', require('./api')));
app.use(express.vhost('ws.localhost', require('./ws')));
app.use(express.vhost('localhost', require('./app/app')));

// Listen
app.listen(port);
console.log('Express app started on port', port);
