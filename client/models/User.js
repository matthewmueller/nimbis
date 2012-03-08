/*
  Expose the `User` model
*/
var User = App.Models.User = Backbone.Model.extend();

/*
  Augment get functionality to work with functions
*/
User.prototype.get = function(attr) {
  if (typeof this.attributes[attr] === 'function') {
    return this.attributes[attr].call(this);
  } else
    return Backbone.Model.prototype.get.call(this, attr);
};

/*
  Set the defaults
*/
User.prototype.defaults = {
  firstName : "",
  lastName : ""
};

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
  this.set('name', name);
  
  // Expose the groups to the rest of the application
  var groups = App.DS.groups = new App.Collections.Groups(this.get('groups'));
  this.set('groups', groups);
};