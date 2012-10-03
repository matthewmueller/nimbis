/**
 * Module dependencies
 */

var app = require('app'),
    $ = require('jquery'),
    superagent = require('superagent'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Dialog = require('../base/base.js'),
    Group = require('/models/group.js');

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
  this.$el.find('input, textarea').each(function() {
    $el = $(this);
    var name = $el.attr('name') || $el.attr('class');
    json[name] = $el.val();
  });

  var group = new Group(json);

  // Save it
  group.save({}, {
    xhrFields: { 'withCredentials': true }
  });

  // Add to the groups collection
  app.collection.groups.add(group);

  // Close the dialog
  this.close();
};
