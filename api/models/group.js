var _ = require('underscore'),
    monk = require('../support/monk'),
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
  // creator : String
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
  var attrs = this.attributes,
      creator = attrs.creator;

  // Add self to the groups
  if(creator && creator.id) {
    this.addMember(creator);
    attrs.creator = { _id : creator.id };
  }

  Base.prototype.initialize.apply(this, arguments);
};

/**
 * Save a group
 */

// Group.prototype.save = function(fn) {
//   Base.prototype.save.apply(this, arguments);

//   // TODO: Get collections working
//   // this.members.save(function(err) {
//   //   if(err) return fn(err);
//   //   Base.prototype.save.apply(this, arguments);
//   // });
// };

/**
 * Add a member
 */

Group.prototype.addMember = function(user) {
  this.push('members', {
    _id : user.id
  });

  return this;
};

/**
 * Sanitize a group
 *
 * HOPING TO REMOVE THIS, WITH A CLEARER, CLEANER STRUCTURE.
 */

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

// Group.exists = function(id, fn) {
//   Group.find(id, function(err, group) {
//     // Normalize, kinda wierd for right now..
//     if(group) group = group.get('id');
//     fn(err, group);
//   });
// };
