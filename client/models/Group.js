var Group = App.Models.Group = Backbone.Model.extend();

/*
  Model Name
*/
Group.prototype.name = 'Group';

/*
  Set the defaults
*/
Group.prototype.defaults = {
  name : "",
  color  : "",
  type    : "public"
};