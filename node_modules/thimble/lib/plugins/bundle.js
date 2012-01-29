/*
  bundle.js : Plugin used to merge all the <script> tags into one, and
  merge all the <link> and <style> tags into one <style> tag.
  
  Compiles assets written in coffeescript, stylus, etc.
*/

/*
  Module dependencies
*/
var path = require('path'),
    join = path.join,
    cheerio = require('cheerio'),
    thimble = require('../thimble'),
    utils = thimble.utils,
    after = utils.after,
    read = utils.read;
    
/*
  Export module
*/
exports = module.exports = function(opts) {
  opts = opts || {};
  
  // Prefer to be executed later
  return function(content, options, next) {
    options.instance.use(bundle(opts));
    next(null, content);
  };
};

var bundle = exports.bundle = function(opts) {
  return function(content, options, next) {
    var $ = cheerio.load(content),
        scripts = [],
        styles = [],
        $scripts = $('script[type=text/javascript]'),
        $styles = $('link, style'),
        finished = after($scripts.length + $styles.length);
    
    function done() {
      var style = $('<style>'),
          script = $('<script>');
      
      style.attr('type', 'text/css')
           .text(styles.join('\n'));
      
      script.attr('type', 'text/javascript')
            .text(scripts.join(';\n'));
      
      if(styles.length)
        $('head').append(style);
      
      if(scripts.length)
        $('body').append(script);
        
      return next(null, $.html());
    }
    
    // Loop through the scripts
    $scripts.each(function(i) {
      var $script = $(this),
          src = $script.attr('src');
      
      // If source points to another website, ignore
      if(src && ~src.indexOf('http')) {
        if (finished()) return done()
        return;
      }
      
      // Remove the script tag
      $script.remove();
      
      if(!src) {
        scripts[i] = $script.text();
        if(finished()) return done();
        return;
      }
      
      compile(src, options, function(err, str) {
        if(err) return next(err);
        
        scripts[i] = str;
        
        if(finished()) return done();
        
      });
      
    });
    
    // Loop through the styles and links
    $styles.each(function(i) {
      var $style = $(this),
          href = $style.attr('href');
      
      // If href points to another website, ignore
      if(href && ~href.indexOf('http')) {
        if(finished()) return done();
        return;
      }
      
      // Remove the style tag
      $style.remove();
          
      if(!href) {
        styles[i] = $style.text();
        if(finished()) return done();
        return;
      }
      
      compile(href, options, function(err, str) {
        if(err) return next(err);
        
        styles[i] = str;
        
        if(finished()) return done();
      });
    });
  };
};

/*
  Compile the assets
*/
var compile = function(source, options, fn) {
  var path = join(options.root, source);
  read(path, function(err, str) {
    if(err) return fn(err);
    thimble.compile(source)(str, options, function(err, str) {
      if(err) return fn(err);
      return fn(null, str);
    });
  });  
};

