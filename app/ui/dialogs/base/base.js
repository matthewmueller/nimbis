/**
 * Module dependencies
 */

var $ = require('jquery'),
    template = require('./base.mu');

/**
 * Add the `Dialog` style
 */

require('./base.styl');

/**
 * Expose `Dialog`
 */

exports = module.exports = dialog;
exports.Dialog = Dialog;

/**
 * Initialize a `Dialog` instance
 */

function Dialog() {
  title = title || 'header';
  this.template = require('./base.mu');
  this.el = $(template);
  this.buttons = [];
}

/**
 * Create a button
 */

Dialog.prototype.button = function(text, cls) {
  cls = cls || '';
  this.buttons.push($('<button>').text(text).addClass(cls));
  return this;
};

/**
 * Closable
 */

Dialog.prototype.closable = function() {

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
