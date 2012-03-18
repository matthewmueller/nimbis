/**
 * User.js - This is the User Model that will provide and interface to the database
 * 
 * Models should implement CRUD (create, read, update, delete) methods.
 */

var app = require('../app'),
    redis = app.redis,
    _ = require('underscore');

/**
 * Create a user
 */
var User = module.exports = function(user) {
  this.attributes = user;
};

/**
 * Extend model
 */
app.extend(User.prototype, require('./model'));

/**
 * Database Key
 */
User.prototype.name = 'users';

/**
 * Attributes object
 */
User.prototype.attributes = {};

/**
 * Create a user
 */
User.prototype.create = function(fn) {
  var user = this.attributes,
      salt = this.salt();

  user.id = user.id || this.id(6);
  user.password = this.encrypt(salt, user.password);
  user.salt = salt;

  var queue = redis.multi();

  _.each(user, function(value, key) {
    queue.hset('user:' + user.id, key, value);
  });

  // Index
  queue.hset('i:email:id', user.email, user.id);

  // Save to database
  queue.exec(function(err) {
    return fn(err);
  });
};

/**
 * Authenticate a user
 */
User.prototype.authenticate = function(email, pass, fn) {

};

/**
 * Read a user (pass back public information)
 */
User.prototype.read = function(id, fn) {

};

/**
 * Update a user
 */
User.prototype.update = function(id, fn) {

};

/**
 * Delete a user
 */
User.prototype.delete = function(id, fn) {

};
