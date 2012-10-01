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

var api = require('./api/api'),
    ws = require('./ws/ws'),
    es = ws.es,
    app = require('./app/app');

/**
 * Handle upgrades
 */

server.on('upgrade', es.handleUpgrade.bind(es));

/**
 * Configure the virtual hosts
 */

vhost.use(express.vhost('api.nimbis.com', api));
vhost.use(express.vhost('ws.nimbis.com', ws));
vhost.use(express.vhost('nimbis.com', app));

/**
 * Bind to a port
 */

server.listen(port);
console.log('Express app started on port', port);
