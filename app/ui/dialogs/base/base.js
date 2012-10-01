/**
 * Module dependencies
 */

var bus = require('bus'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore');

/*
  Add style
*/

require('./dialog.styl');

/**
 * Expose Dialog
 */

var Dialog = module.exports = Backbone.View.extend();

/**
 * Dialog classname
 */

Dialog.prototype.className = 'dialog';

/**
 * Templates
 */

Dialog.prototype.template = require('./base.mu');
Dialog.prototype.body = require('./body.mu');

/**
 * Buttons
 */

Dialog.prototype._buttons = {};

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
  this.attributes = _.defaults(attrs || {}, this.defaults);
};

/*
  Render `Dialog`
*/
Dialog.prototype.render = function() {
  if(!this.attributes.body) this.attributes.body = this.body({});
  var html = this.template(this.attributes);
  this.$el.addClass('dialog').html(html);

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
