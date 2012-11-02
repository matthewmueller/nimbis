
/**
 * Module dependencies.
 */

var Emitter = require('emitter'),
    overlay = require('/ui/overlay/overlay.js'),
    template = require('./dialog.mu'),
    $ = require('jquery');

/**
 * Add the `dialog` style
 */

// require('./dialog.css');
require('./dialog.styl');

/**
 * Active dialog.
 */

var active;

/**
 * Expose `Dialog`.
 */

module.exports = Dialog;

/**
 * Initialize a new `Dialog`.
 *
 * Options:
 *
 *    - `title` dialog title
 *    - `message` a message to display
 *
 * Emits:
 *
 *    - `show` when visible
 *    - `hide` when hidden
 *
 * @param {Object} options
 * @api public
 */

function Dialog(title, message) {
  var options = this.options = {};
  switch (arguments.length) {
    case 2:
      options = { title: title, message: msg };
      break;
    case 1:
      options = (typeof title == 'object') ? title : { message : title };
      break;
  }

  Emitter.call(this);
  this.buttons = [];
  this.el = $(template());
  if (exports.effect) this.effect(exports.effect);
  this.on('escape', this.hide.bind(this));
  if (active && !active.hiding) active.hide();
  active = this;
}

/**
 * Inherit from `Emitter.prototype`.
 */

Dialog.prototype = new Emitter;

/**
 * Render with the given `options`.
 *
 * @param {Object} options
 * @api public
 */

Dialog.prototype.render = function(options){
  var el = this.el,
      title = options.title,
      msg = options.message,
      buttons = [],
      self = this;

  el.find('.close').click(function(){
    self.emit('close');
    self.hide();
    return false;
  });

  el.find('.title').text(title);
  if (!title) el.find('.title').remove();

  // message
  if ('string' == typeof msg) {
    el.find('p').text(msg);
  } else if (msg) {
    el.find('p').replaceWith(msg.el || msg);
  }

  // buttons
  if(this.buttons.length) {
    var footer = el.find('.footer');
    this.buttons.forEach(function(button) {
      var title = button.title;
      button = $('<button>').text(title).addClass(button.class || '');
      button.on('click', function(e) { self.emit(title.toLowerCase(), e); });
      footer.append(button);
    });
  }

  setTimeout(function(){
    el.removeClass('hide');
  }, 0);
};

/**
 * Enable the dialog close link.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.closable = function(){
  this.el.addClass('closable');
  return this;
};

/**
 * Add class `name`.
 *
 * @param {String} name
 * @return {Dialog}
 * @api public
 */

Dialog.prototype.addClass = function(name){
  this.el.addClass(name);
  return this;
};

/**
 * Set the effect to `type`.
 *
 * @param {String} type
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.effect = function(type){
  this._effect = type;
  this.addClass(type);
  return this;
};

/**
 * Make it modal!
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.modal = function(){
  this._overlay = overlay();
  return this;
};

/**
 * Add a button
 *
 * @param {String} title
 * @param {String} cls
 * @return {Dialog}
 * @api private
 */

Dialog.prototype.button = function(title, cls) {
  this.buttons.push({ title : title, class : cls });
  return this;
};

/**
 * Add an overlay.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.overlay = function(){
  var self = this;
  var o = overlay({ closable: true });
  o.on('hide', function(){
    self._overlay = null;
    self.hide();
  });
  this._overlay = o;
  return this;
};

/**
 * Close the dialog when the escape key is pressed.
 *
 * @api private
 */

Dialog.prototype.escapable = function(){
  var self = this;
  $(document).bind('keydown.dialog', function(e){
    if (27 != e.which) return;
    self.emit('escape');
  });
};

/**
 * Show the dialog.
 *
 * Emits "show" event.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.show = function(){
  var overlay = this._overlay;

  // Lazy rendering
  if(!this.rendered) {
    this.render(this.options);
    this.rendered = true;
  }

  this.emit('show');

  if (overlay) {
    overlay.show();
    this.el.addClass('modal');
  }

  // escape
  if (!overlay || overlay.closable) this.escapable();

  this.el.appendTo('body');
  this.el.css({ marginLeft: -(this.el.width() / 2) + 'px' });
  this.emit('show');
  return this;
};

/**
 * Hide the overlay.
 *
 * @api private
 */

Dialog.prototype.hideOverlay = function(){
  if (!this._overlay) return;
  this._overlay.remove();
  this._overlay = null;
};

/**
 * Hide the dialog with optional delay of `ms`,
 * otherwise the dialog is removed immediately.
 *
 * Emits "hide" event.
 *
 * @return {Number} ms
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.hide = function(ms){
  var self = this;
  $(document).unbind('keydown.dialog');

  // prevent thrashing
  this.hiding = true;

  // duration
  if (ms) {
    setTimeout(function(){
      self.hide();
    }, ms);
    return this;
  }

  // hide / remove
  this.el.addClass('hide');
  if (this._effect) {
    setTimeout(function(){
      self.remove();
    }, 500);
  } else {
    self.remove();
  }

  // overlay
  this.hideOverlay();

  return this;
};

/**
 * Hide the dialog without potential animation.
 *
 * @return {Dialog} for chaining
 * @api public
 */

Dialog.prototype.remove = function(){
  this.emit('hide');
  this.el.remove();
  return this;
};
