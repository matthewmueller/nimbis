/*
  layout.js - Plugin to allow layouts to be given, enables the <yield /> tag
*/

/*
  Module dependencies
*/

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    extname = path.extname,
    cheerio = require('cheerio'),
    thimble = require('../thimble'),
    utils = require('../utils'),
    read = utils.read;
    
/*
  Export module
*/

exports = module.exports = function(opts) {
  
  return function(content, options, next) {
    if(!options.layout) return next(null, content);
    
    if(!extname(options.layout))
      options.layout = options.layout + '.' + options['view engine'];

    read(options.layout, function(err, str) {
      if(err) return next(err);
      
      // Compile the layout
      thimble.compile(options.layout, options.locals)(str, options, function(err, html) {
        if(err) return next(err);
        
        var $ = cheerio.load(html);

        // Wrap content with layout around <yield>
        $('yield').replaceWith(content);

        return next(null, $.html());
      });
      
    });
  };
};