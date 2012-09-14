var _  = require('underscore');

/**
 * Test group data
 */

/**
 * Basic Messages
 */

exports.hi = {
  message : 'hi'
};

exports.hello = {
  message : 'hello'
};

exports.hola = {
  message : 'hola'
};

exports.wahoo = {
  message : 'wahoo'
};

/**
 * Export, allowing the objects to be referenced,
 * individually or as a group
 */

module.exports = _.toArray(exports);
_.extend(module.exports, exports);
