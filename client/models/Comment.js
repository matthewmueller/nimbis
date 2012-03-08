var Comment = App.Models.Comment = Backbone.Model.extend();

/*
  Set the defaults
*/
Comment.prototype.defaults = {
  comment : "",
  author  : {},
  date    : "now"
};

/*
  Initialize the comment
*/
Comment.prototype.initialize = function() {
  var author = this.get('author');

  // Instantiate the author object
  this.set('author', new App.Models.User(author));
};