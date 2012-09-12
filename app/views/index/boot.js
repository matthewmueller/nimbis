/**
 * Module dependencies
 */

var app = require('app'),
    $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    cookie = require('/vendor/cookie'),
    Index = require('./index.js'),
    User = require('/models/user'),
    Messages = require('/collections/messages'),
    Groups = require('/collections/groups');

/**
 * Use jQuery as the Backbone DOM Library
 */

Backbone.setDomLibrary($);

/**
 * Instantiate the models and collections
 */

var user = app.model.user = new User(window.user),
    groups = app.collection.groups = app.model.user.get('groups'),
    messages = window.messages;

_(messages).each(function(message) {
  // Link message group IDs to group models
  message.groups = _.map(message.groups, function(group) { return groups.get(group); });
  // Remove any groups that weren't part of user's groups
  message.groups = new Groups(_.compact(message.groups));
});

// Create model from messages json blob
app.collection.messages = new Messages(messages);

/**
 * Set up engine.io
 */
var token = cookie('token');
console.log(token);
var io = app.io = new eio.Socket({
  host : 'ws.localhost',
  port: 8080
});
io.on('open', function() {
  console.log('Connected to engine.io!');
});

/**
 * Fire it up!
 */

var index = new Index();
index.boot();

/**
 * Start the HTML5 history
 */

Backbone.history.start({pushState: true});
