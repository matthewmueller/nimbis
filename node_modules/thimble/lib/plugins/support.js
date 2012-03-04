/*
  support.js - Used to add additional support files that need 
  to be added to the page.
*/

/*
  System modules
*/
var fs = require('fs'),
    path = require('path'),
    extname = path.extname,
    join = path.join;

/*
  Dependencies
*/
var cheerio = require('cheerio'),
    _ = require('underscore');

/*
  Library modules
*/
var utils = require('../utils'),
    after = utils.after;
    
/*
  Public: Add support files to our response
*/
exports = module.exports = function(opts) {
  // Middleware-specific options
  opts = opts || {};
  
  // Return the Middleware
  return function(content, options, next) {
    var files = options.support,
        finished,
        $;
    
    // If there are support files, add them to document
    if(files.length) {
      files = _.uniq(files);
      finished = after(files.length);
    } else {
      return next(null, content);
    }
  
    $ = cheerio.load(content);
  
    files.forEach(function(file) {
      // Explode file object and get extension
      var supportFile = file.file,
          appendTo = file.appendTo || 'head',
          ext = extname(supportFile).substring(1),
          tag = false,
          attrs = {};
          
      // Support JS and CSS files
      if(ext === 'js') {
        tag = 'script';
        attrs.type = 'text/javascript';
      } else if(ext === 'css') {
        tag = 'style';
        attrs.type = 'text/css';
      }
      
      if(!tag) {
        if(finished()) return next(null, $.html());
        return;
      }
      
      fs.readFile(supportFile, 'utf8', function(err, str) {
        if(err) return next(err);
        
        // Create a <script> or <style> tag
        var $asset = $('<' + tag + '>'),
            $tag   = $(appendTo);
        
        $asset.addClass('support')
              .attr(attrs)
              .text(str);
        
        // Append asset to the document,
        // add to top if appendTo elem isnt found
        if($tag.length) {
          $tag.append($asset);
        } else {
          // $('script:first').before($asset);
          // TODO: Refactor
          $ = cheerio.load($asset.html() + '\n' + $.html());
        }
        
        // If we've added all the assets, render html and return
        if(finished()) {
          options.support = [];
          return next(null, $.html());
        }
        
      });
      
    });
    
  };
};