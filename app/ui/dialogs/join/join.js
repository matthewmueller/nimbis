/**
 * Module dependencies
 */

var app = require('app'),
    $ = require('jquery'),
    superagent = require('superagent'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Dialog = require('../base/base.js');

/**
 * Add Style
 */

require('./join.styl');

/**
 * Export Join
 */

var Join = module.exports = Dialog.extend();

/**
 * Events
 */

Join.prototype.events =  {
  'click .cancel' : 'close',
  'click .join' : 'join'
};

/**
 * Dialog classname
 */

Join.prototype.className = 'join-dialog';

/**
 * Template
 */

Join.prototype.body = require('./body.mu');

/**
 * Defaults
 */

Join.prototype.defaults = {
  header : 'Join a new group'
};

/**
 * Initialize
 */

Join.prototype.initialize = function() {
  // Call parent
  Dialog.prototype.initialize.apply(this, arguments);
  
  this.button('cancel', 'cancel');
  this.button('join', 'join');
};

/*
 * Done
 */
Join.prototype.join = function() {
  var json = {},
      $el;

  // Temporary
  this.$el.find('input').each(function() {
    $el = $(this);
    json[$el.attr('name')] = $el.val();
  });

  if(!json.id) return this.close();
  
  superagent
    .post('api.localhost')
    .send(json)
    .end(function(r) {
      if(!r.ok) return console.error(r.text);
    });

  app.collection.groups.add(data);
  this.close();
};
