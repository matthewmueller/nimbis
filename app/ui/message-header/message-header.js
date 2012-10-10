var Backbone = require('backbone'),
    _ = require('underscore');

/*
  Add Style
*/
require('./message-header.styl');

/*
  Expose `MessageHeader`
*/

var MessageHeader = module.exports = Backbone.View.extend();

/*
  `MessageHeader` classname
*/
MessageHeader.prototype.className = 'message-header clearfix';

/*
  `MessageHeader` Template
*/
MessageHeader.prototype.template = require('./message-header.mu');

/*
  Events
*/
MessageHeader.prototype.events = {

};

/**
 * Initialize `MessageHeader`
 */

MessageHeader.prototype.initialize = function() {
  _.bindAll(this, 'render');

  // Will probably need to be refactored.. works for now though
  // this.model.groups.each(function(group) {
  //   group.on('change', this.render, this);
  // }, this);

  // this.model.on('change', this.render, this);
};

/**
 * Render the message header
 */

MessageHeader.prototype.render = function() {
  var model = this.model;
      json = model.attributes;

  json.author = model.author.get('name');
  json.groups = model.groups.pluck('name');

  this.$el.html(this.template(json));

  return this;
};
