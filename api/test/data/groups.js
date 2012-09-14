var _ = require('underscore');

/**
 * Test group data
 */

/**
 * Basic Groups
 */

exports.javascript = {
  name : 'Javascript',
  color : 'red'
};

exports.soccer = {
  name : 'Soccer',
  color : 'blue'
};

exports.football = {
  name : 'Football',
  color : 'brown'
};

exports.family = {
  name : 'Family',
  color : 'yellow'
};

/**
 * Export, allowing the objects to be referenced,
 * individually or as a group
 */

module.exports = _.toArray(exports);
_.extend(module.exports, exports);
