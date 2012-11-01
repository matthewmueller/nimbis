/**
 * Module dependencies
 */

var $ = require('jquery'),
    Emitter = require('emitter'),
    Events = require('events'),
    Comment = require('/models/comment'),
    template = require('./comment-box.mu')();

/**
 * Add style
 */

require('./comment-box.styl');

/**
 * Export `CommentBox`
 */

module.exports = CommentBox;

/**
 * Initialize `CommentBox`
 *
 * @param {Object} ds
 */

function CommentBox(ds) {
  ds = ds || {};
  if(!(this instanceof CommentBox)) return new CommentBox;
  if(!ds.user || !ds.comments) throw new Error('CommentBox: Missing required data to initialize');

  this.user = ds.user;
  this.comments = ds.comments;

  this.el = $(template);
  this.bind('keydown .comment', 'share');
}

/**
 * Mixin `Emitter`
 */

Emitter(CommentBox.prototype);

/**
 * Mixin `Events`
 */

Events(CommentBox.prototype);

/**
 * Set the active messageId
 *
 * @param {String} messageId
 * @return {CommentBox}
 */

CommentBox.prototype.active = function(messageId) {
  this.messageId = messageId;
  return this;
};

/**
 * Share the comment
 *
 * @param {Event} e
 * @return {CommentBox}
 */

CommentBox.prototype.share = function(e) {
  if(e.keyCode !== 13 || (e.shiftKey && e.keyCode === 13)) return;
  e.preventDefault();

  var comments = this.comments,
      comment = this.el.find('.comment').val().trim(),
      author = this.user.get('name');

  comment.replace(/\n/g, '<br>');

  comment = new Comment({
    comment : comment,
    messageId : this.messageId,
    author : { name : author }
  });

  this.emit('share', comment);

  comment.save();
  comments.add(comment);

  comment.on('error', function(model, res) {
    throw new Error('Comment Box: Cannot save comment', res.text);
  });

  this.clear();
  return this;
};

/**
 * Clear the comment box
 *
 * @return {CommentBox}
 */

CommentBox.prototype.clear = function() {
  this.el.find('.comment').val('');
};



// var app = require('app'),
//     _ = require('underscore'),
//     Backbone = require('backbone'),
//     Comment = require('/models/comment.js');

// /*
//   Add styling
//  */
// require('./share-comment.styl');

// /*
//   Expose `ShareComment`
// */

// var ShareComment = module.exports = Backbone.View.extend();

// /*
//   `Comments` classname
// */
// ShareComment.prototype.className = 'share-comment';

// /*
//   `Comments` Template
// */
// ShareComment.prototype.template = require('./share-comment.mu');

// /*
//   Events
// */
// ShareComment.prototype.events = {
//   'keydown .comment' : 'comment'
// };

// /*
//   Initialize `Comments`
// */
// ShareComment.prototype.initialize = function(options) {
//   _.bindAll(this, 'comment', 'render');

//   // Attach the messageID
//   this.messageID = options.messageID;
// };

// /*
//   Render `ShareComment`
// */
// ShareComment.prototype.render = function() {
//   var template = this.template();

//   this.$el.append(template);

//   return this;
// };

// /*
//   Share comment
// */
// ShareComment.prototype.comment = function(e) {
//   if(e.keyCode !== 13 || (e.shiftKey && e.keyCode === 13))  return; 
//   e.preventDefault();

//   var $el = this.$el,
//       commentValue = $el.find('.comment').val().trim().toLineBreakTag(),
//       me = app.model.user.toJSON();

//   if (commentValue === '') {
// 	this.clear();
// 	return;
//   }

//   var commentModel = new Comment({
//     messageID : this.messageID,
//     comment : commentValue,
//     author  : me
//   });

//   // Add comment to the Comments collection
//   this.collection.add(commentModel);

//   // Save the comment
//   commentModel.save();

//   this.clear();
// };

// /*
//   Clear form
// */
// ShareComment.prototype.clear = function() {
//   this.$el.find('textarea, input').val('');
// };

// String.prototype.toLineBreakTag = function() {
// 	return this.replace(/\n/g,'<br>');
// };
