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
  // this.attributes = this.sanitize(this.attributes);

  // Set up the members
  // I DON'T THINK THIS IS HOW IT SHOULD BE DONE, SHOULD
  // PROBABLY JUST BE LINKED [id1, id2, id3, id4, ...]
  this.members = new Users();
  this.members.on('add', function() {
    console.log('lol');
  });
  Base.prototype.initialize.apply(this, arguments);
};

/**
 * Save a group
 */

Group.prototype.save = function(fn) {
  Base.prototype.save.apply(this, arguments);

  // TODO: Get collections working
  // this.members.save(function(err) {
  //   if(err) return fn(err);
  //   Base.prototype.save.apply(this, arguments);
  // });
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
