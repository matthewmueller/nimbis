var app = require('app'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Comment = require('/models/comment.js');

/*
  Add styling
 */
require('./share-comment.styl');

/*
  Expose `ShareComment`
*/

var ShareComment = module.exports = Backbone.View.extend();

/*
  `Comments` classname
*/
ShareComment.prototype.className = 'share-comment';

/*
  `Comments` Template
*/
ShareComment.prototype.template = require('./share-comment.mu');

/*
  Events
*/
ShareComment.prototype.events = {
  'keydown .comment' : 'comment'
};

/*
  Initialize `Comments`
*/
ShareComment.prototype.initialize = function(options) {
  _.bindAll(this, 'comment', 'render');

  // Attach the messageID
  this.messageID = options.messageID;
};

/*
  Render `ShareComment`
*/
ShareComment.prototype.render = function() {
  var template = this.template();

  this.$el.append(template);

  return this;
};

/*
  Share comment
*/
ShareComment.prototype.comment = function(e) {
  if(e.keyCode !== 13 || (e.shiftKey && e.keyCode === 13))  return; 
  e.preventDefault();

  var $el = this.$el,
      commentValue = $el.find('.comment').val().trim().toLineBreakTag(),
      me = app.model.user.toJSON();

  if (commentValue === '') {
	this.clear();
	return;
  }

  var commentModel = new Comment({
    messageID : this.messageID,
    comment : commentValue,
    author  : me
  });

  // Add comment to the Comments collection
  this.collection.add(commentModel);

  // Save the comment
  commentModel.save();

  this.clear();
};

/*
  Clear form
*/
ShareComment.prototype.clear = function() {
  this.$el.find('textarea, input').val('');
};

String.prototype.toLineBreakTag = function() {
	return this.replace(/\n/g,'<br>');
};
