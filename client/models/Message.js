var Message = app.m.Message = Backbone.Model.extend();

/*
  Set the defaults
*/
Message.prototype.defaults = {
  message  : "",
  author   : "",
  groups   : [],
  comments : [],
  date : "Now"
};