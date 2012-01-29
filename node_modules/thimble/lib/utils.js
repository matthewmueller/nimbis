/*
  utils.js : utility functions for thimble
*/

/*
  Module Dependencies
*/

var fs = require('fs'),
    path = require('path'),
    normalize = path.normalize,
    resolve = path.resolve,
    exists = path.exists,
    util = require('util'),
    pump = util.pump,
    slice = Array.prototype.slice,
    mkdirp = require('mkdirp');
    
/*
  File cache
*/
cache = {};

/*
  Exports module
*/

module.exports = exports;

/*
  Read function with caching
*/
var read = exports.read = function(file, fn) {
  fs.readFile(file, 'utf8', function(err, str) {
    if(err) return fn(err);
    return fn(null, str);
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
    if(--left <= 0) return true;
    return false;
  };
};

/*
  Simple benchmark timer
*/
timer = exports.timer = function(name) {
  return {
    name : name,
    startTime : 0,
    stopTime : 0,
    
    start : function() {
      this.startTime = Date.now();
    },
    
    stop : function() {
      this.stopTime = Date.now();
    },
    
    results : function() {
      var diff = this.stopTime - this.startTime;
      return "Results " + this.name + " : " + diff + "ms";
    }
  };
};

/*
  Checks an arbitrary number of paths,
  returning the first path it finds that exists
*/
var check = exports.check = function(paths, fn) {
  paths = paths || [];

  var found = false,
      finished = after(paths.length);
  
  if(!paths.length) return false;   
  
  paths.forEach(function(path) {
    exists(path, function(exist) {
      if(found) {
        return;
      } else if(exist) {
        found = true;
        return fn(path);
      } else if (finished()) {
        return fn(false);
      }
    });
  });
};

/*
  Ensures the object contains the following keys
  
  TODO: Change this function
*/
var needs = exports.needs = function(keys, obj, fn) {
  var key, err;
  // If its just a string, convert to array
  if(!Array.isArray(keys)) keys = [keys];
  
  // If no function, just create one that throws an error
  if (!fn) {
    fn = function(err) { if(err) throw err; };
  }
  
  for(var i = 0; i < keys.length; i++) {
    key = keys[i];
    if(!obj[key]) {
      err = new Error('object is missing thats required: ' + key);
      return fn(err);
    }
  }

  return fn(null);
};



/*
  Generates a relative path from a base to another file
*/

var trim = function(arr) {
  var start = 0,
      end = arr.length - 1;
  
  while(start < arr.length) {
    if(arr[start] !== '') break;
    start++;
  }
  
  while(end >= 0) {
    if(arr[end] !== '') break;
    end--;
  }
  
  if(start > end) return [];
  return arr.slice(start, end - start + 1);
};

var relative = exports.relative = function(from, to) {
  var from = resolve(from).substr(1),
      to   = resolve(to).substr(1),
      fromParts = trim(from.split('/')),
      toParts = trim(to.split('/')),
      length = Math.min(fromParts.length, toParts.length),
      somePartsLength = length,
      outputParts = [],
      i = 0;
      
  while(i < length) {
    if(fromParts[i] !== toParts[i]) {
      somePartsLength = i;
      break;
    }
    i++;
  }
  
  i = somePartsLength;
  
  while(i < fromParts.length) {
    outputParts.push('..');
    i++;
  }
  
  outputParts = outputParts.concat(toParts.slice(somePartsLength));
  return outputParts.join('/');
};

/*
  Mkdirs
  
  TODO: Fix this too
*/
var mkdirs = exports.mkdirs = function(dirs, fn) {
  if(!dirs.length) return fn(null);
  
  var finished = after(dirs.length);
  
  dirs.forEach(function(dir) {
    mkdirp(dir, 0755, function(err) {
      if(err) return fn(err);
      else if(finished()) return fn(null);
    });
  });
};

/*
  Copy
*/
var copy = exports.copy = function(src, dst, fn) {
  fs.stat(src, function(err) {
    if(err) return fn(err);
    var is = fs.createReadStream(src),
        os = fs.createWriteStream(dst);
      
    pump(is, os, fn);
  });
};

/*
  Step - tiny, but flexible step library
*/
var step = exports.step = function() {
  var stack = slice.call(arguments).reverse(),
      self = this;
      
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