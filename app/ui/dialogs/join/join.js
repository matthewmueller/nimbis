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

  console.log(superagent.post('api.nimbis.com:8080/join').xhr);
  superagent
    .post('api.nimbis.com:8080/join')
    .send(json)
    .end(function(res) {
      if(!res.ok) return console.error(res.text);
      app.collection.groups.add(res.body);
      this.close();
    });

};
