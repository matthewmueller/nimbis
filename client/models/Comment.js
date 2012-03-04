var Comment = App.Models.Comment = Backbone.Model.extend();

/*
  Set the defaults
*/
Comment.prototype.defaults = {
  comment : "",
  author  : "",
  date    : "now"
};