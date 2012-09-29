/**
 * Module dependencies
 */

var _ = require('underscore'),
    bus = require('../support/bus'),
    Backbone = require('Backbone'),
    monk = require('../support/monk'),
    Base = require('./base'),
    Groups = require('../collections/groups'),
    Messages = require('../collections/messages'),
    Index = require('../structures/Hash'),
    utils = require('../support/utils'),
    isArray = Array.isArray,
    makeId = utils.makeId;

/**
 * Extend the base
 */

var User = module.exports = Base.extend();

/*
 * Name of the model
 */

User.prototype.name = 'user';

/**
 * Default values
 */

User.prototype.defaults = {
  groups : [],
  messages : []
};

/*
 * Access settings
 */

User.prototype.access = {
  password : 'private',
  salt : 'private'
};

/*
 * Required values
 */

User.prototype.requires = ['name', 'email', 'password'];

/*
 * Defaults
 */

/*
 * Initialize a user model
 */

User.prototype.initialize = function() {
  var attrs = this.attributes;

  // Make all usernames lowercase
  if(attrs.username) {
    attrs.username = attrs.username.toLowerCase();
  }

  // Encrypt the password if given and we haven't already encrypted it.
  if(!attrs.salt && attrs.password) {
    var salt = this.makeSalt();

    attrs.password = Base.encrypt(salt, attrs.password);
    attrs.salt = salt;
  }

  Base.prototype.initialize.apply(this, arguments);
};

/**
 * Has a group(s)
 */

User.prototype.hasGroup = function(groupIds) {
  groupIds = (isArray(groupIds)) ? groupIds : [groupIds];
  var groups = _.pluck(this.get('groups'), '_id');
  return (_.intersection(groupIds, groups).length === groupIds.length);
};

/**
 * Join a group
 */

User.prototype.join = function(group, fn) {
  var event = ['group', group.id, 'message'].join(':');
  bus.on(this, event, 'addMessage', function(err, doc) {
    if(err) console.error(err);
  });

  this.push('groups', {
    _id : group.id,
    name : group.get('name'),
    color : group.get('color')
  }, fn);

  return this;
};

/**
 * Add a message
 *
 * TODO: Figure out how to prevent this from firing
 * addMessage*(number of recipients), for now we're just
 * grabbing unique ids when requested.
 *
 */

User.prototype.addMessage = function(message, fn) {
  fn = fn || function() {};
  var messages = this.get('messages');

  this.push('messages', message.id, { unique : true }, fn);
};

// User.prototype.fetch = function(fn) {
//   var model = this,
//       col = monk().get(this.name),
//       email = this.get('email');

//   if(!email) return fn(null, false);

//   col.findOne({ email : email }, function(err, doc) {
//     if(err) return fn(err);
//     model.set(doc, { silent : true });
//     return fn(null, model);
//   });
// };

/*
 * Save the index after save
 *
 * fn - callback function
 *
 */
// User.prototype.onSave = function(model, fn) {
//   var index,
//       wait = 0,
//       db = monk().get(this.name);
//       username = model.get('username'),
//       email = model.get('email');
//   // function done(err) {
//   //   if(err) return fn(err);

//   //   else if(--wait <= 0) {
//   //     return fn(err, model);
//   //   }
//   // }

//   // if(username) {
//   //   wait++;
//   //   index = new Index('index:username:id');
//   //   index.set(username, model.id, done);
//   // }

//   if(email) {
//     db.index('email', { unique: true });
//   }

//   // if(email) {
//   //   wait++;
//   //   index = new Index('index:email:id');
//   //   index.set(email, model.id, done);
//   // }

// };

/*
 * Authenticate
 */
// User.prototype.authenticate = function(enteredPassword) {
//   var attrs = this.toJSON();

//   // Encrypt the entered password
//   enteredPassword = this.encrypt(attrs.salt, enteredPassword);

//   // Return true if authenticated, false otherwise
//   return (enteredPassword === attrs.password);
// };

// Static Properties
// -----------------

User.authorize = function(email, password, fn) {
  User.find({ email : email }, function(err, model) {
    if(err || !model) return fn(err, model);
    
    var attrs = model.toJSON();
    if(Base.encrypt(attrs.salt, password) === attrs.password) {
      return fn(null, model.id);
    } else {
      return fn(null, false);
    }

  });
};


