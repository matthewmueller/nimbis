/**
 * Module dependencies
 */

var List = require('/ui/list/list.js'),
    Comments = require('/collections/comments.js');
    template = require('./comment-list.mu'),
    superagent = require('superagent'),
    mu = require('minstache');

/**
 * Add `comment-list.styl`
 */

require('./comment-list.styl');

/**
 * Comment collection cache
 */

var cache = {};

/**
 * Export `CommentList`
 */

module.exports = CommentList;

/**
 * Initialize `CommentList`
 */

function CommentList(ds) {
  if(!this instanceof CommentList) return new CommentList;
  if(!ds || !ds.comments) throw new Error('CommentList: missing the required values');

  this.comments = ds.comments;

  List.call(this);
  this.template(template);
  this.el.addClass('comment-list');

  this.comments.on('add', this.add.bind(this));
}

/**
 * Inherit from `List.prototype`
 */

CommentList.prototype.__proto__ = List.prototype;

/**
 * Filter by a messageId
 *
 * @param {String} messageId
 * @return {CommentList}
 */

CommentList.prototype.filter = function(messageId) {
  var comments = this.comments;
      len = comments.length;

  this.messageId = messageId;
  
  this.clear();
  comments.each(function(comment) {
    this.add(comment);
  }, this);

  return this;
};

/**
 * Add a comment
 *
 * @param {Comment} comment
 * @return {CommentList}
 */

CommentList.prototype.add = function(comment) {
  var messageId = comment.get('messageId'),
      rawEl = this.el[0];

  // Note: Collections don't add duplicated by default, so no add is fired
  // when we click on same inbox item twice
  if(this.messageId === messageId) List.prototype.add.call(this, comment);

  // Automatically scroll to the bottom
  rawEl.scrollTop = rawEl.scrollHeight;
  
  return this;
};
