/**
 * express.js - Create and configure our express server
 */
var express = require('express');

/**
 * Export the server
 */
var server = express.createServer();
exports = module.exports = server;

/**
 * Server configuration for all environments
 */
server.configure(function() {
  server.use(express.methodOverride());
  server.use(express.bodyParser());
  server.use(express.favicon());
});

/**
 * Server configuration for the development environment
 */
server.configure('development', function() {

});

/**
 * Server configuration for the production environment
 */
server.configure('production', function() {

});