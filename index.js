var express = require('express'),
    port = process.argv[2] || 8080,
    http = require('http'),
    vhost = express();

/**
 * Create our server
 */

var server = http.createServer(vhost);

/**
 * Servers
 */

var api = require('./api'),
    ws = require('./ws'),
    app = require('./app/app');

/**
 * Handle upgrades
 */

server.on('upgrade', ws.handleUpgrade.bind(ws));

/**
 * Configure the virtual hosts
 */

vhost.use(express.vhost('api.localhost', api));
vhost.use(express.vhost('ws.localhost', ws.handleRequest.bind(ws)));
vhost.use(express.vhost('localhost', app));

/**
 * Bind to a port
 */

server.listen(port);
console.log('Express app started on port', port);
