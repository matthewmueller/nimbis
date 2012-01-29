/*
  package.js - Used to package up the application into a view and asset files
*/

/*
  System Modules
*/

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    resolve = path.resolve,
    basename = path.basename,
    dirname = path.dirname,
    extname = path.extname;

/*
  Dependency Modules
*/

var _ = require('underscore'),
    cheerio = require('cheerio');

/*
  Library Modules
*/

var thimble = require('../thimble'),
    utils = thimble.utils,
    after = utils.after,
    relative = utils.relative,
    needs = utils.needs,
    mkdirs = utils.mkdirs,
    step = utils.step,
    copy = utils.copy;
    
/*
  Export the module
*/
exports = module.exports = function(opts) {
  // Prefer to be on the bottom of the middleware stack
  return function(content, options, next) {
    options.instance.use(exports.package(opts));
    return next(null, content);
  };
};

exports.package = function(opts) {
  // Middleware-specific options
  opts = opts || {};
  
  // Return the middleware
  return function(content, options, next) {
    var $, before, done;
    
    // Needs properties from options
    needs(['public', 'build', 'source', 'root'], options, function(err) {
      if(err) return next(err);
    });
    
    // Directories
    var directory = relative(options.root, dirname(options.source)),
        public = join(options.public, directory),
        build = join(options.build, directory);
    
    // Source file
    var ext = extname(options.source),
        file = basename(options.source),
        base = basename(file, ext);
    
    // Asset names
    var stylesheet = base + '.css',
        javascript = base + '.js';
        
    // Put in all the variables
    opts = _.extend(opts, {
      directory : directory,
      public : public,
      build : build,
      ext : ext,
      view : file,
      base : base,
      stylesheet : stylesheet,
      javascript : javascript,
      root : options.root
    });
    
    $ = cheerio.load(content);
    
    before = function(next) {
      // Make the public and build directories if they don't exist
      mkdirs([public, build], function(err) {
        return next(err, $, opts);
      });
    }
    
    // Return the original content, so we don't break dev
    done = function(err) {
      return next(err, content);
    }
    
    // Step through the packaging functions
    step(before, images, backgroundImages, css, js, view, done);
    
  };
};

/*
  Package images
*/

var images = exports.images = function(err, $, opts, next) {
  if(err) return next(err);
  
  var root = opts.root,
      public = opts.public,
      directory = opts.directory,
      $imgs = $('img'),
      finished,
      path;
  
  if(!$imgs.length) {
    return next(null, $, opts);
  } else {
    finished = after($imgs.length);
  }
  
  path = join(public, directory);
  
  // Loop through all the images, changing their source and copying them
  // to the public app directory
  $imgs.each(function() {
    var $img = $(this),
        source = $img.attr('src'),
        base = basename(source),
        asset = join(directory, base),
        src, 
        dest;
        
    // Change the source of the selected images
    $img.attr('src', asset);
    
    // Absolute paths
    if(source[0] === '/') {
      src = join(root, source);
    } else {
      src = join(root, asset);
    }
    
    // Put in public app folder
    dest = join(public, base);
    
    // Copy the image over
    copy(src, dest, function(err) {
      if(err) return next(err);
      else if(finished()) return next(null, $, opts); 
    });
    
  });
  
};

/*
  Package CSS Background Images
*/

var backgroundImages = exports.backgroundImages = function(err, $, opts, next) {
  // Load the CSS parser
  var cssom = require('cssom'),
      $style = $('style');
  
  if(!$style.length) return next(null, $, opts);
    
  var style = $style.text(),
      public = opts.public,
      directory = opts.directory,
      root = opts.root,
      css = cssom.parse(style), // parse css
      imgs = [],
      selector,
      background, 
      attr, 
      url,
      base,
      asset,
      src, 
      dest,
      finished;
  
  for(var i = 0; i < css.cssRules.length; i++) {
    selector = css.cssRules[i].style;

    // Get the background and save which attribute it is
    background = selector[attr = 'background'] ||
                 selector[attr = 'background-image'];
                 
    if(!background) continue;
    
    // Match url("..."), select url
    url = background.match(/url\([\'\"]([\/\w.\-]+)[\'\"]\)/);
    
    if (!url || !url[1]) continue;

    // Replace match with actual url
    url = url[1];
    base = basename(url);
    asset = join(directory, base);
    
    // Replace the attribute in css, with public/app/img
    selector[attr] = background.replace(url, asset);
    
    // Absolute path support
    src = join(root, (url[0] === '/') ? url : asset);
    dest = join(public, base);

    // Save the source and destination of image
    imgs.push({
      src : src,
      dest : dest
    });
    
  }
  
  if(!imgs.length) return next(null, $, opts);
  
  finished = after(imgs.length);
  
  // Put modified css back in <style> tag
  $style.text(css.toString());
  
  imgs.forEach(function(img) {
    var src = img.src,
        dest = img.dest;
    
    copy(src, dest, function(err) {
      if(err) return next(err);
      else if(finished()) return next(null, $, opts);
    });
  });
  
};


/*
  Package the CSS
*/
var css = exports.css = function(err, $, opts, next) {
  if(err) return next(err);
  
  var $style = $('head').find('style'),
      directory = opts.directory,
      stylesheet = opts.stylesheet,
      path = join(opts.public, stylesheet),
      public = join(directory, stylesheet),
      $link,
      str;
  
  if(!$style.length) return next(null, $, opts);
  
  // Get <style> text and trim it
  str = $style.text().trim()
  
  // Remove the <style> tag
  $style.remove();
    
  // Create new <link> tag
  $link = $('<link>')
    .attr('type', 'text/css')
    .attr('href', public)
    .attr('rel', 'stylesheet');
  
  // Append <link> to <head>
  $('head').append($link);
  
  // Write css file
  fs.writeFile(path, str, 'utf8', function(err) {
    return next(err, $, opts);
  });
  
};

/*
  Package the javascript
*/
var js = exports.js = function(err, $, opts, next) {
  if(err) return next(err);
  
  var $script = $('script'),
      directory = opts.directory,
      javascript = opts.javascript,
      path = join(opts.public, javascript),
      public = join(directory, javascript);
      
  if(!$script.length) return next(null, $, opts);
  
  // Trim the contents of the <script> tag
  var str = $script.text().trim();
  
  // Remove the <script> tag
  $script.remove();
  
  // Create a new <script> tag
  $script = $('<script>')
    .attr('type', 'text/javascript')
    .attr('src', public)
  
  // Append to the bottom of the body
  $('body').append($script);
  
  // Write the js string to public
  fs.writeFile(path, str, 'utf8', function(err) {
    return next(err, $, opts);
  });
  
};

/*
  Package the view
*/
var view = exports.view = function(err, $, opts, next) {
  if(err) return next(err);
  
  var file = opts.view,
      path = join(opts.build, file);
  
  // Write contents of $.html() to build/
  fs.writeFile(path, $.html(), 'utf8', next);
};