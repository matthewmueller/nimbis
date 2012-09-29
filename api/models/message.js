// TODO: Validate groups have IDs

var _ = require('underscore'),
    Base = require('./base'),
    List = require('../structures/list'),
    utils = require('../support/utils'),
    isArray = Array.isArray,
    after = utils.after;

/*
 * Extend the base model
 */
var Message = module.exports = Base.extend();

/*
 * Name of the model
 */
Message.prototype.name = 'message';

/*
 * Required attributes
 */
Message.prototype.requires = ['author', 'message'];

/*
 * Types
 */
Message.prototype.types = {
  id : String,
  message : String,
  groups : Array,
  author : Object
};

/**
 * Defaults
 */

Message.prototype.defaults = {
  message : "",
  groups : [],
  author : {}
};

/*
 * Initialize a message model
 */

Message.prototype.initialize = function() {
  var attrs = this.attributes,
      author = attrs.author;

  if(author.id) {
    attrs.author = {
      _id : author.id,
      name : author.get('name')
    };
  }

  // this.attributes = this.sanitize(this.attributes);
  Base.prototype.initialize.apply(this, arguments);
};

/**
 * Save the message model
 */

Message.prototype.save = function(fn) {
  // var attrs = this.attributes;
  // if(!attrs.author.id)

  Base.prototype.save.apply(this, arguments);
};

// /**
//  * Sanitize the input
//  */

// Message.prototype.sanitize = function(attrs) {
//   var groups = attrs.groups;

//   if(groups) {
//     groups = (isArray(groups)) ? groups : [groups];
//     groups = (typeof groups[0] === 'string') ? groups : _.pluck(groups, 'id');
//     attrs.groups = groups;
//   }

//   return attrs;
// };

// /*
//  * Extend save to add messages to group lists
//  */
// Message.prototype.onSave = function(model, fn) {

//   var groups = model.get('groups'),
//       list = new List(),
//       messageId = model.get('id'),
//       finished = after(groups.length);

//   function done(err) {
//     if(err) return fn(err);
//     else if(finished()) {
//       return fn(null, model);
//     }
//   }

//   // Add messageID to each group
//   _.each(groups, function(group) {
//     // Example Key - list:group:sah123j:messages
//     list.key = 'list:group:'+ group +':messages';
//     list.unshift(messageId, done);
//   });

// };

