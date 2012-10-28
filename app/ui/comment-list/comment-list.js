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

function CommentList() {
  if(!this instanceof CommentList) return new CommentList;

  List.call(this);
  this.template(template);
  this.el.addClass('comment-list');
}

/**
 * Inherit from `List.prototype`
 */

CommentList.prototype.__proto__ = List.prototype;

/**
 * Load the comment list with data
 */

CommentList.prototype.load = function(messageId) {
  var self = this,
      comments = cache[messageId] || new Comments({ messageId : messageId });

  comments.on('add', this.add.bind(this));

  // comments.fetch();
  // comments.on('error', function(comments, res) {
  //   throw new Error('Comment-List: Cannot fetch comments', res.text);
  // });

  superagent
    .get('http://api.nimbis.com:8080/messages/' + messageId + '/comments')
    .end(function(res) {
      if(!res.ok) throw new Error('Comment List: Unable to load data', res.text);
      self.clear();
      comments.add(res.body);
    });
};
