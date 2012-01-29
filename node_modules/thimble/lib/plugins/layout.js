/*
  layout.js - Plugin to allow layouts to be given, enables the <yield /> tag
*/

/*
  Module dependencies
*/

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    cheerio = require('cheerio'),
    utils = require('../utils'),
    read = utils.read;
    
/*
  Export module
*/

exports = module.exports = function(opts) {
  
  return function(content, options, next) {
    if(!options.layout) return next(null, content);
    
    read(options.layout, function(err, html) {
      if(err) return next(err);
      
      var $ = cheerio.load(html);
      
      // Wrap content with layout around <yield>
      $('yield').replaceWith(content);
      
      return next(null, $.html());
    });
  };
  
};