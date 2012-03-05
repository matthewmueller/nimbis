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
  'keyup .comment' : 'comment'
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
  if(e.keyCode !== 13) return;
    
  var $el = this.$el,
      $comment = $el.find('.comment'),
      author = App.DS.user.get('name') || '';
  
  // Add comment to the Comments collection
  this.collection.add({
    comment : $comment.val().trim(),
    author : author
  });
  
  this.clear();
};

/*
  Clear form
*/
ShareComment.prototype.clear = function() {
  this.$el.find('textarea, input').val('');
};