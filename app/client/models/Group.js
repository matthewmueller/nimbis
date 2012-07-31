var Backbone = require('backbone');

/*
  Export Group
*/
var Group = module.exports = Backbone.Model.extend();

/*
  Model Name
*/
Group.prototype.name = 'group';

/*
  Set the defaults
*/
Group.prototype.defaults = {
  name : "",
  color  : "purple",
  type    : "public"
};