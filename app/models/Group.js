var Backbone = require('backbone');

/*
  Export Group
*/
var Group = module.exports = Backbone.Model.extend();

/**
 * URL
 */

// TODO: This will need to be less specific...
Group.prototype.url = 'http://api.nimbis.com:8080/groups';

/*
  Model Name
*/
Group.prototype.name = 'group';

/**
 * Set up the default ID for Mongo
 */

Group.prototype.idAttribute = '_id';

/*
  Set the defaults
*/

Group.prototype.defaults = {
  name : "",
  color  : "purple",
  type    : "public"
};
