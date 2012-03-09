var Comments = App.Collections.Comments = Backbone.Collection.extend();

/*
  Collection name
*/
Comments.prototype.name = 'Comments';

/*
  Add the `Comment` Model
*/
Comments.prototype.model = App.Models.Comment;