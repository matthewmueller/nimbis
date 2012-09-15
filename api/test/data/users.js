var Users = require('../../collections/users');

/**
 * Basic users
 */
var users = [
  {
    name : 'Matt',
    email : 'matt@matt.com',
    password : 'matty'
  },
  {
    name : 'Jon',
    email : 'jon@jon.com',
    password : 'jony'
  },
  {
    name : 'Will',
    email : 'will@will.com',
    password : 'willy'
  },
  {
    name : 'Drew',
    email : 'drew@drew.com',
    password : 'drewy'
  }
];

/**
 * Export, allowing the objects to be referenced,
 * individually or as a group
 */

module.exports = new Users(users);
