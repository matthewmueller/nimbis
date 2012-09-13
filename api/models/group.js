var Base = require('./base');

/*
 * Extend the Base model
 */
var Group = module.exports = Base.extend();

/*
 * Name of the model
 */
Group.prototype.name = 'group';

/*
 * Required values
 */
Group.prototype.requires = ['name', 'type'];

/*
 * Types of the attributes
 */
Group.prototype.types = {
  id : String,
  name : String,
  description : String,
  type : String,
  members : Array
};

/*
 * Default values
 */
Group.prototype.defaults = {
  type : 'public',
  members : []
};

/*
 * Initialize a group model
 */
Group.prototype.initialize = function() {
  var attrs = this.toJSON();

  attrs.id = attrs.id || this.makeId(6);

  this.set(attrs, { silent : true });
};

/**
 * Add a member
 */

Group.prototype.addMember = function(user) {
  user = (user.id) ? user.id : user;
  this.members.push(user);
  return this;
};

/**
 * Remove a member
 */

Group.prototype.removeMember = function(user) {
  user = (user.id) ? user.id : user;
  var index = this.members.indexOf(user);
  if(~index) this.members.splice(index, 1);
};

// Static Properties
// -----------------

Group.exists = function(id, fn) {
  Group.find(id, function(err, group) {
    // Normalize, kinda wierd for right now..
    if(group) group = group.get('id');
    fn(err, group);
  });
};
