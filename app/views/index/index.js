/**
 * Extend the layout
 */

var layout = require('../layout/layout.js');

/**
 * Module dependencies
 */

var $ = require('jquery'),
    _ = require('underscore'),
    bus = require('bus'),
    request = require('superagent'),
    Backbone = require('backbone');

/**
 * Use $ as Backbone DOM Library
 */

Backbone.setDomLibrary($);

/**
 * Export the `index` router
 */

var Index = module.exports = Backbone.Router.extend();

/**
 * Load in the models and collections
 */

var User = require('/models/user.js'),
    Messages = require('/collections/messages.js'),
    Groups = require('/collections/groups.js');

/**
 * `index` routing
 */

Index.prototype.routes = {
  'messages/:id' : 'openMessage',
  'groups/:id/edit' : 'editGroup',
  'join/' : 'joinGroup'
};

/**
 * Initialize `index`
 */

Index.prototype.initialize = function(user, messages) {
  

};


