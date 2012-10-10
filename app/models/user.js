var Backbone = require('backbone'),
    Groups = require('/collections/groups.js');

/*
  Expose the `User` model
*/
var User = module.exports = Backbone.Model.extend();

/*
  Model Name
*/
User.prototype.name = 'user';

/*
  Augment get functionality to work with functions
*/
// User.prototype.get = function(attr) {
//   if(typeof this.attributes[attr] === 'function') {
//     return this.attributes[attr].call(this);
//   } else
//     return Backbone.Model.prototype.get.call(this, attr);
// };

/*
  Set the defaults
*/
User.prototype.defaults = {
  firstName : "",
  lastName : ""
};

/**
 * Set up the default ID for Mongo
 */

User.prototype.idAttribute = '_id';

/*
  Attribute functions
*/
// User.prototype.attributes = {
//   name : function() {
//     console.log('lol');
//     return [this.get('firstName'), this.get('lastName')].join(' ');
//   }
// };

/*
  Initialize the model
*/
User.prototype.initialize = function() {
  var attrs = this.attributes;
  this.groups = new Groups(attrs.groups);
  delete attrs['groups'];
};
