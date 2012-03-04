var Group = app.m.Group = Backbone.Model.extend();

/*
  Set the defaults
*/
Group.prototype.defaults = {
  name : "",
  color  : "",
  type    : "public"
};