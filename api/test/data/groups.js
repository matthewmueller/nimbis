var Groups = require('../../collections/Groups');

/**
 * Basic Groups
 */

var groups = [
  {
    name : 'Javascript',
    color : 'red'
  },
  {
    name : 'Soccer',
    color : 'blue'
  },
  {
    name : 'Football',
    color : 'brown'
  },
  {
    name : 'Family',
    color : 'yellow'
  }
];


/**
 * Export, allowing the objects to be referenced,
 * individually or as a group
 */

module.exports = new Groups(groups);
