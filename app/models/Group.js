var Backbone = require('backbone');

/*
  Export Group
*/
var Group = module.exports = Backbone.Model.extend();

/**
 * URL
 */

// TODO: This will need to be less specific...
Group.prototype.url = 'http://api.localhost:8080/groups';

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
