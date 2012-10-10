/**
 * Generate an ID
 */

var makeId = exports.makeId = function(len) {
  return Math.random().toString(36).substr(2,len);
};
