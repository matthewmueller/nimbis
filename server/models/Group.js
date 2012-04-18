/**
 * Group.js - This is the Group Model that will provide and interface to the database
 *
 * Models should implement CRUD (create, read, update, delete) methods.
 */

var app = require('../app'),
    redis = app.redis,
    _ = require('underscore');

/**
 * Create a group
 */
var Group = module.exports = function(group) {
  this.attributes = group;
};

/**
 * Extend model
 */
app.extend(Group.prototype, require('./model'));

/*
 * Create a group
 */
Group.prototype.create = function(fn) {
  var group = this.attributes;

  group.id = group.id || this.id(6);

  var queue = redis.multi();

  _.each(group, function(value, key) {
    queue.hset('group:' + group.id, key, value);
  });

  // Save to database
  queue.exec(function(err) {
    return fn(err);
  });
};

