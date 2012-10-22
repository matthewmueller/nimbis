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
 * Add list item with the given `arr` and optional callback `fn`.
 * Emits an `add` event with the supplied `obj`.
 *
 * When the item is clicked `fn()` will be invoked, along with firing a
 * `select` event. If a `slug` is present, it will also fire the event
 * `slug`, passing the `obj`.
 *
 * @param {Array} arr
 * @param {Function} fn
 * @return {List}
 * @api public
 */

List.prototype.add = function(arr, fn) {
  arr = Array.isArray(arr) ? arr : [arr];
  var len = arr.length;
  
  for(var i = 0; i < len; i++) this.addItem(arr[i], fn);
  return this;
};

/**
 * Add a single list item
 *
 * @param {Object}   obj
 * @param {Function} fn
 */

List.prototype.addItem = function(obj, fn) {
  var self = this,
      cid = this.cid++,
      el = $(this.tpl(obj));

  el.addClass('list-item-' + cid)
    .appendTo(this.el)
    .click(function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.emit('select', obj);
      self.emit('select:'+cid, obj);
      if(fn) fn(obj);
    });

  this.emit('add', obj);
  this.items[cid] = obj;

  return this;
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
 * Check if this list has an item with the given `slug`.
 *
 * @param {String} slug
 * @return {Boolean}
 * @api public
 */

List.prototype.has = function(cid){
  return !! (this.items[cid]);
};
