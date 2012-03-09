/*
  Expose `ShareComment`
*/

var ShareComment = App.Views.ShareComment = Backbone.View.extend();

/*
  `Comments` classname
*/
ShareComment.prototype.className = 'share-comment';

/*
  `Comments` Template
*/
ShareComment.prototype.template = App.JST['share-comment'];

/*
  Events
*/
ShareComment.prototype.events = {
  'keydown .comment' : 'comment'
};

/*
  Initialize `Comments`
*/
ShareComment.prototype.initialize = function() {
  _.bindAll(this, 'comment', 'render');
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
      $comment = $el.find('.comment').val().trim(),
      me = App.DS.user.toJSON();

  if ($comment === '') {
	this.clear();
	return;
  }

  // Add comment to the Comments collection
  this.collection.add({
    comment : $comment,
    author : me
  });

  this.clear();
};

/*
  Clear form
*/
ShareComment.prototype.clear = function() {
  this.$el.find('textarea, input').val('');
};