var Backbone = require('backbone');

/*
  Export Group
*/
var Group = module.exports = Backbone.Model.extend();

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