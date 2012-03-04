/*
  Path.js plugin corrects thimble's paths
*/

var utils = require('../utils'),
    relative = utils.relative,
    path = require('path'),
    dirname = path.dirname,
    join = path.join,
    cheerio = require('cheerio');

// Tags
var assets = 'script[src], link, img'

exports = module.exports = function(rel, opts) {
  opts = opts || {};
  
  return function(content, options, next) {
    var source = rel || options.source,
        $ = cheerio.load(content);
    
    $(assets).each(function() {
      var attr = (this.name === 'link') ? 'href' : 'src',
          $this = $(this);

      path = $this.attr(attr);

      // Convert path from relative to source to relative to root
      path = convert(path, {
        source : source,
        root : options.root
      });
            
      $this.attr(attr, path);
      
    });

    next(null, $.html());
  };
}

var convert = exports.convert = function(path, options) {
  var directory = dirname(options.source),
      root = options.root;
  
  if(!path || path[0] === '/' || ~path.indexOf('http'))
    return path;
  
  // Full path from source directory
  path = join(directory, path);
  
  // Make relative to root
  path = relative(root, path);
  
  // Prepend '/'
  path = join('/', path)
  
  return path;
};