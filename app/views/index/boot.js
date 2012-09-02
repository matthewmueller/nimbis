/**
 * Module dependencies
 */

var $ = require('jquery'),
    Index = require('./index.js'),
    Backbone = require('backbone'),
    user = window.user,
    messages = window.messages;

/**
 * Use $ as Backbone DOM Library
 */

Backbone.setDomLibrary($);

/**
 * Fire it up!
 */

var index = new Index(user, messages);
index.boot();

/**
 * Start the HTML5 history
 */

Backbone.history.start({pushState: true});
