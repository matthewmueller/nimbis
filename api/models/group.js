var _ = require('underscore'),
    Users = require('../collections/users'),
    Base = require('./base');

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
  type : 'public'
};

/*
 * Initialize a group model
 */

Group.prototype.initialize = function() {
  this.attributes = this.sanitize(this.attributes);
  
  // Set up the members
  this.members = new Users();
  this.members.on('add', function() {
    console.log('lol');
  });
  Base.prototype.initialize.apply(this, arguments);
};

Group.prototype.save = function(fn) {
  this.members.save(function(err) {
    if(err) return fn(err);
    Base.prototype.save.apply(this, arguments);
  });
};

Group.prototype.sanitize = function(attrs) {
  var members = attrs.members;

  if(members) {
    members = (Array.isArray(members)) ? members : [members];
    members = (typeof members[0] === 'string') ? members : _.pluck(members, 'id');
    attrs.members = members;
  }

  return attrs;
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
