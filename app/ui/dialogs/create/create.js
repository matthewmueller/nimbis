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

require('./create.styl');

/**
 * Export Create
 */

var Create = module.exports = Dialog.extend();

/**
 * Events
 */

Create.prototype.events =  {
  'click .cancel' : 'close',
  'click .create' : 'create'
};

/**
 * Dialog classname
 */

Create.prototype.className = 'create-dialog';

/**
 * Template
 */

Create.prototype.body = require('./body.mu');

/**
 * Defaults
 */

Create.prototype.defaults = {
  header : 'Create a new group'
};

/**
 * Initialize
 */

Create.prototype.initialize = function() {
  // Call parent
  Dialog.prototype.initialize.apply(this, arguments);
  
  this.button('cancel', 'cancel');
  this.button('create', 'create');
};

/*
 * Done
 */
Create.prototype.create = function() {
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
      console.log(r.body);
    });

  app.collection.groups.add(data);
  this.close();
};
