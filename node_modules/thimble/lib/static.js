/*
  static.js : Loads all of thimble's static properties including
  the plugins
*/

var fs = require('fs'),
    path = require('path'),
    basename = path.basename,
    extname = path.extname;

/*
  Export Module
*/
module.exports = exports;

/*
  Export the version
*/
var version = function() {
  var pkg = fs.readFileSync(__dirname + '/../package.json', 'utf8');
  return JSON.parse(pkg).version;
};
exports.__defineGetter__('version', version);

/*
  Extension to compiler map
*/
exports.extensions = {
  'styl' : 'stylus',
  'coffee' : 'coffeescript',
  'mu' : 'hogan',
  'md' : 'markdown'
};

/*
  Read in all the plugins and attach them to the thimble object
*/
fs.readdirSync(__dirname + '/plugins').forEach(function(filename) {
  // If it's not a .js or .coffee file, skip
  if(!(/\.(js|coffee)$/).test(filename)) return;
  
  var ext = extname(filename),
      name = basename(filename, ext);
      
  function load() {
    return require('./plugins/' + name);
  }
  
  // Lazy load plugins
  exports.__defineGetter__(name, load);
});