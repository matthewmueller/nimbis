/**
 * Generate an ID
 */

var makeId = exports.makeId = function(len) {
  return Math.random().toString(36).substr(2,len);
};

/*
  Counter used for async calls
  
  Example:
    var files = ['a', 'b'];
    finished = after(files.length);
    
    finished() // false
    finished() // true
    
*/
var after = exports.after = function(length) {
  var left = length;
  return function() {
    return (--left <= 0);
  };
};
