/**
 * Module dependencies
 */

var app = require('app'),
    $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
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
 * Fire it up!
 */

var index = new Index();
index.boot();

/**
 * Start the HTML5 history
 */

Backbone.history.start({pushState: true});