/*
  minify.js - Minifies js, css, and html
*/

/*
  Module dependencies
*/

var cheerio = require('cheerio'),
    thimble = require('../thimble'),
    utils = thimble.utils,
    step = utils.step;

/*
  Exports
*/
exports = module.exports = function(opts) {
  // Prefer to be on the bottom of middleware stack
  return function(content, options, next) {
    options.instance.use(exports.minify(opts));
    return next(null, content);
  };
};

var minify = exports.minify = function(opts) {
  
  return function(content, options, next) {

    function before(next) {
      var $ = cheerio.load(content);
      next(null, $);
    }
    
    function after(err, $) {
      next(err, $.html());
    }
    
    step(before, css, js, after);
    
  };
};

var js = exports.js = function(err, $, next) {
  var uglify = require('uglify-js'),
      parser = uglify.parser,
      $script = $('script'),
      str = $script.text(),
      ast;
  
  uglify = uglify.uglify;
  
  ast = parser.parse(str);
  ast = uglify.ast_mangle(ast);
  ast = uglify.ast_squeeze(ast);
  str = uglify.gen_code(ast);
  
  $script.text(str);
  
  next(null, $);
};

var css = exports.css = function(err, $, next) {
  var compressor = require('clean-css'),
      $style = $('style'),
      str = $style.text();
  
  str = compressor.process(str);
  $style.text(str);
  
  next(null, $);
};