/**
 * Module dependencies
 */

var List = require('/ui/list/list.js'),
    template = require('./comment-list.mu'),
    mu = require('minstache');

/**
 * Add `comment-list.styl`
 */

require('./comment-list.styl');

/**
 * Export `CommentList`
 */

module.exports = CommentList;

/**
 * Initialize `CommentList`
 */

function CommentList(ds) {
  if(!this instanceof CommentList) return new CommentList(ds);

  var message = this.message = ds.message;
  if(!message) throw new Error('Comment List: missing required data');

  List.call(this);
  this.template(template);
  this.el.addClass('comment-list');

  comments.on('add', this.add.bind(this));
}

/**
 * Inherit from `List.prototype`
 */

CommentList.prototype.__proto__ = List.prototype;
