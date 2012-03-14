var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    join = path.join,
    basename = path.basename,
    extname = path.extname;

/**
 * Used to lazy-load an entire directory
 * 
 * obj -  Object to attach to
 * path - Path of directory
 *
 */
var loadDirectorySync = exports.loadDirectorySync = function(obj, path) {
  fs.readdirSync(path).forEach(function(file) {
    var name = basename(file, extname(file));

    function load() {
      return require(join(path, name));
    }

    // Lazy load object
    obj['__defineGetter__'](name, load);
  });
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

/*
  Step - tiny, but flexible step library
  
  Usage: 
  
    var first = function(next) {
      ...
      return next(null, name, date);
    }
  
    var second = function(err, name, date, next) {
      ...
      return next(null, person);
    }
  
    var last = function(err, person) {
      ...
    }
    
    step(first, second, last);
*/
var step = exports.step = function() {
  var slice = Array.prototype.slice,
      stack = slice.call(arguments).reverse(),
      self  = this;
      
  function next(err) {
    // Jump to last func if error occurs
    if(err) return stack[0].call(self, err);
    
    // Otherwise gather arguments and add next func to end
    var args = slice.call(arguments);
    
    if(stack.length > 1) args.push(next);
    
    // Call the next function on the stack with given args
    stack.pop().apply(self, args);
  }
  
  // Kick us off
  stack.pop().call(self, next);
};