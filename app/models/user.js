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

/*
  Use a recursive `toJSON`
*/
User.prototype.toJSON = require('../support/backbone/toJSON.recursive.js');

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
  var name = this.get('firstName') + ' ' + this.get('lastName');
  this.set('fullName', name);

  var groups = new Groups(this.get('groups'));
  this.set('groups', groups);
};
