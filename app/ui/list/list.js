/**
 * Module dependencies
 */

var $ = require('jquery'),
    Emitter = require('emitter');

/**
 * Add `list.css`
 */

require('./list.css');

/**
 * Expose `List`.
 */

module.exports = List;

/**
 * Initialize a new `List`
 */

function List() {
  if(!(this instanceof List)) return new List;
  Emitter.call(this);
  this.items = {};
  this.cid = 0;
  this.el = $('<ul class="list">');
}

/**
 * Default template engine
 *
 * @api public
 */

List.prototype.engine = require('minstache');

/**
 * Add templating
 *
 * @return {List}
 * @api public
 */

List.prototype.template = function(str) {
  this.tpl = ('function' == typeof str) ? str : this.engine.compile(str);
  return this;
};

/**
 * Default template
 *
 * @return {String}
 * @api private
 */

List.prototype.tpl = function(text) {
  return '<li><a href="#">' + text + '</a></li>';
};

/**
 * Identifier, used to identify list items. This allows
 * you to remove menu items by passing in models or
 * refresh single elements
 *
 * Example:
 *
 * function(item) {
 *   return item.cid;
 * }
 *
 * TODO: Finish me
 */

List.prototype.identifier = function(item) {};

/**
 * Add list item with the given `obj` and optional callback `fn`.
 * Emits an `add` event with the supplied `obj`.
 *
 * When the item is clicked `fn()` will be invoked, along with firing a
 * `select` event. If a `slug` is present, it will also fire the event
 * `slug`, passing the `obj`.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param:private {Boolean} prepend
 * @return {List}
 * @api public
 */

List.prototype.add = function(obj, fn, prepend) {
  // This is to make up for backbone passing extra params through "add"
  fn = (fn && 'function' == typeof fn) ? fn : function() {};
  
  var self = this,
      action = (prepend) ? 'prependTo' : 'appendTo',
      json = (obj.toJSON) ? obj.toJSON() : obj,
      cid = this.cid++,
      el = $(this.tpl(json));

  el.addClass('list-item-' + cid)
    [action](this.el)
    .click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.emit('select', obj);
      self.emit('select:'+cid, obj);
      fn(obj);
    });

  this.emit('add', obj);
  this.items[cid] = obj;

  return this;
};

/**
 * Add an item to the top of the list
 *
 * @param {Object} obj
 * @param {Function} fn
 * @return {List}
 * @api public
 */

List.prototype.shift = function(obj, fn) {
  return this.add(obj, fn, true);
};

/**
 * Remove items from the list
 *
 * @param {Number} cid
 * @return {List}
 * @api public
 */

List.prototype.remove = function(cid) {
  var item = this.el.find('.list-item-' + cid);
  if (!item) throw new Error('no list item named "' + cid + '"');
  this.emit('remove', this.items[cid]);
  this.emit('remove:'+cid, this.items[cid]);
  item.remove();
  delete this.items[cid];
  return this;
};

/**
 * Clear list items
 *
 * @return {List}
 * @api public
 */

List.prototype.clear = function() {
  this.emit('clear');
  this.el.html('');
  this.items = {};
  return this;
};

/**
 * Check if this list has an item with the given `slug`.
 *
 * @param {String} slug
 * @return {Boolean}
 * @api public
 */

List.prototype.has = function(cid){
  return !! (this.items[cid]);
};
