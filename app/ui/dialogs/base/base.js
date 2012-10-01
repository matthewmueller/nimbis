/**
 * Module dependencies
 */

var bus = require('bus'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore');

/**
 * Make sure dom library is set
 */

if(!Backbone.$) Backbone.setDomLibrary($);

/*
  Add style
*/

require('./base.styl');

/**
 * Expose Dialog
 */

var Dialog = module.exports = Backbone.View.extend();

/**
 * Templates
 */

Dialog.prototype.template = require('./base.mu');
Dialog.prototype.body = require('./body.mu');

/**
 * Defaults
 */
Dialog.prototype.defaults = {
  header : 'Header'
};

/*
  Initialize `Dialog`
*/
Dialog.prototype.initialize = function(attrs) {
  _.bindAll(this, 'render', 'close', '_maybeClose', '_maybeConfirm');
  this.attrs = _.extend(this.defaults, attrs || {});
  this.buttons = [];
};

/**
 * Create a button
 */

Dialog.prototype.button = function(text, cls) {
  cls = cls || '';

  this.buttons.push($('<button>').text(text).addClass(cls));
  return this;
};

/*
  Render `Dialog`
*/
Dialog.prototype.render = function() {
  if(!this.buttons.length) {
    this.button('cancel');
    this.button('save');
  }
  
  var html = this.template(this.attrs);

  // $('.footer', html).append.apply($('.footer', html), this.buttons);
  this.$el.addClass('dialog').html(html);
  this.$el.find('.body').append(this.body({}));
  this.$el.find('.footer').append(this.buttons);

  // Listen for global keystrokes
  $(document.body).bind('keydown', this._maybeClose);
  $(document.body).bind('keydown', this._maybeConfirm);

  return this;
};

/*
  Hide Dialog
*/
Dialog.prototype.close = function() {
  // Cleanup
  $(document.body).unbind('keydown', this._maybeClose);
  $(document.body).unbind('keydown', this._maybeConfirm);

  bus.trigger('dialog:close');

  this.$el.remove();
};

/*
  Maybe close
*/

Dialog.prototype._maybeClose = function(e) {
  if(e.which === 27) return this.close();
};

/*
  Maybe confirm
*/

Dialog.prototype._maybeConfirm = function(e) {
  if(e.which === 13) return (this.done) ? this.done() : this.close();
};
