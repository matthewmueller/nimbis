// TODO: Validate groups have IDs

var _ = require('underscore'),
    Base = require('./base'),
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
