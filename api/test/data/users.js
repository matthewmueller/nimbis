var _  = require('underscore');

/**
  * Test group data
  */

/**
 * Basic users
 */

exports.matt = {
  name : 'Matt',
  email : 'matt@matt.com',
  password : 'matty'
};

exports.jon = {
  name : 'Jon',
  email : 'jon@jon.com',
  password : 'jony'
};

exports.will = {
  name : 'Will',
  email : 'will@will.com',
  password : 'willy'
};

exports.drew = {
  name : 'Drew',
  email : 'drew@drew.com',
  password : 'drewy'
};

/**
 * Export, allowing the objects to be referenced,
 * individually or as a group
 */

module.exports = _.toArray(exports);
_.extend(module.exports, exports);
