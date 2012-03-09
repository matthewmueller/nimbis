var Comment = App.Models.Comment = Backbone.Model.extend();

/*
  Model Name
*/
Comment.prototype.name = 'Comment';

/*
  Set the defaults
*/
Comment.prototype.defaults = {
  comment : "",
  author  : {},
  date    : "now"
};

/*
  Use a recursive `toJSON`
*/
Comment.prototype.toJSON = Comment.prototype.recursiveToJSON;

/*
  Initialize the comment
*/
Comment.prototype.initialize = function() {
  var author = this.get('author');

  // Instantiate the author object
  this.set('author', new App.Models.User(author));
};