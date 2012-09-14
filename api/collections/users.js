/**
 * Module dependencies
 */

var Base = require('./base');

/**
 * Extend the Base collection
 */

var Users = module.exports = Base.extend();

/**
 * Name the collection
 */

Users.prototype.name = 'users';

/**
 * Set the model
 */

Users.prototype.model = require('../models/user');
