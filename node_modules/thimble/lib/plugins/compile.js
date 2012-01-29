/*
  compile.js - used to compile all asset, markup, and template languages
*/

/*
  Module dependencies
*/

var fs = require('fs'),
    path = require('path'),
    extname = path.extname,
    _ = require('underscore'),
    thimble = require('thimble');

/*
  Requires cache
*/

var requires = {};

/*
  Private extensions to type map
  
  TODO: extend mimes instead
*/

var types = {
  coffeescript : 'js',
  stylus : 'css'
};

/*
  Export module
*/
exports = module.exports = function(file, locals) {
  locals = locals || {};
  
  var ext,
      compiler;
  
  // Allows files or compiles to be specified
  if (~file.indexOf('.')) {
    ext = extname(file).substring(1);
  } else {
    ext = file;
  }
  
  ext = thimble.extensions[ext] || ext;
  compiler = exports[ext];
  
  return function(content, options, next) {
    if(!compiler) return next(false, content);
    
    options.locals = locals;
    
    compiler(content, options, function(err, str) {
      return next(null, str);
    });
  };
};

/*
  Maps custom assets to known asset types
*/
exports.getType = function(file) {
  var ext = extname(file).substring(1);
  ext = thimble.extensions[ext] || ext;
  
  return types[ext] || false;
};

/*
  Asset Compiles
*/

/*
  Coffeescript
*/

exports.coffeescript = function(content, options, fn) {
  var engine = requires.cs || (requires.cs = require('coffee-script')),
      str;
      
  try {
    str = engine.compile(content);
    return fn(null, str);
  } catch(err) {
    return fn(err); 
  }

};

/*
  Stylus
*/

exports.stylus = function(content, options, fn) {
  var engine = require.stylus || (requires.stylus = require('stylus')),
      styl = engine(content),
      nib;
  
  // Set up stylus
  styl.set('filename', options.source)
      .include(options.root);
      
  // Try addng nib
  try {
    nib = requires.nib || (requires.nib = require('nib'));
    styl.use(nib());
  } catch(e) {
    // do nothing
  }
  
  // Render stylus
  styl.render(function(err, css) {
    return fn(err, css);
  });
  
};

/*
  Markup Compilers
*/

/*
  Markdown
*/
exports.markdown = function(content, options, fn) {
  var engine = requires.md || (requires.md = require('github-flavored-markdown')),
      str;
  
  try {
    str = engine.parse(content);
    return fn(null, str);
  } catch(err) {
    return fn(err);
  };
  
};

/*
  Jade
*/
exports.jade = function(content, options, fn) {
  var engine = requires.jade || (requires.jade = require('jade')),
      str;
      
  try {
    // Compile jade without locals
    str = engine.compile(content, options)({});
    return fn(null, str);
  } catch(err) {
    return fn(err);
  }

};

/*
  Template Compilers
*/

/*
  Hogan
*/
exports.hogan = function(content, options, fn) {
  var engine = requires.hogan || (requires.hogan = require('hogan.js')),
      tpl,
      str;
  
  try {
    tpl = engine.compile(content, options);
    str = tpl.render(options.locals || {});
    return fn(null, str);
  } catch(err) {
    return fn(err);
  };
};
