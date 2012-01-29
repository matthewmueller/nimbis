/*
  flatten.js - Merges all the <includes> in the source
*/

/*
  Module Dependencies
*/
var fs = require('fs'),
    path = require('path'),
    dirname = path.dirname,
    extname = path.extname,
    join = path.join,
    utils = require('../utils'),
    after = utils.after,
    relative = utils.relative,
    step = utils.step,
    thimble = require('../thimble'),
    cheerio = require('cheerio'),
    tags = ['script', 'link', 'img'];
    
/*
  Export module
*/

exports = module.exports = function(opts) {
  
  return function(content, options, next) {
    var directory;
    
    if(options.source) {
      directory = dirname(options.source);
    } else if(options.root) {
      directory = options.root;
    }
    
    if(!directory) return next(null, content);
    
    flatten(content, directory, options, function(err, str) {
      return next(err, str);
    });
  };
};

var flatten = exports.flatten = function(html, directory, options, cb) {
  var root = options.root || directory,
      $ = cheerio.load(html),
      $include = $('include'),
      finished;

  // Fix the asset paths with proper directory
  fixPaths($, directory, options.root);
      
  if($include.length) {
    finished = after($include.length);
  } else {
    return cb(null, $.html());
  }
  
  $include.each(function(i, elem) {
    var $this = $(this),
        src = $this.attr('src'),
        filePath,
        read,
        compile,
        flattener,
        done;
        
    if(src[0] === '/') {
      filePath = join(root, src);
    } else {
      filePath = join(directory, src);
    }
    
    read = function(next) {
      fs.readFile(filePath, 'utf8', next);
    };
    
    compile = function(err, content, next) {
      if(err) return next(err);
      
      // If they have the same extension, don't compile, save for later
      if(extname(filePath) === extname(options.source)) {
        return next(err, content);
      } else {
        // Compile without any local vars
        return thimble.compile(filePath)(content, options, next);
      }
    };
    
    flattener = function(err, str, next) {
      if(err) return next(err);
      flatten(str, dirname(filePath), options, next);
    };
    
    done = function(err, flattened) {
      if(err) return cb(err);
      
      // Replace <include> with content
      $this.replaceWith(flattened);
      
      if(finished()) return cb(null, $.html());
    };
    
    // Step through each of the functions
    step(read, compile, flattener, done);
    
  });
};

var fixPaths = exports.fixPaths = function($, directory, root) {
  var relPath = relative(root, directory),
      attribute;
      
  for(var i = 0; i < tags.length; i++) {
    attribute = (tags[i] === 'link') ? 'href' : 'src';
    
    $(tags[i]).each(function() {
      var $tag = $(this),
          attr = $tag.attr(attribute);
      
      // If not absolute path, and if doesn't have http, make relative
      if(attr && attr[0] != '/' && !~attr.indexOf('http')) {
        $tag.attr(attribute, join(relPath, attr));
      }
    });
  }
  
};