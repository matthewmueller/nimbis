/*
  middleware.js : Catches custom assets like coffeescript and stylus,
  and renders them automatically in development
*/

/*
  Module dependencies
*/
var fs = require('fs'),
    path = require('path'),
    normalize = path.normalize,
    basename = path.basename, 
    extname = path.extname,
    join = path.join,
    mime = require('mime'),
    parse = require('url').parse,
    utils = require('./utils'),
    read = utils.read;

/*
  Middleware used to compile and respond to custom assets
*/
var middleware = exports.middleware = function () {
  var thimble = this,
      options = thimble.settings,
      root = options.root;
      
  return function thimbleMiddleware(req, res, next) {
    var head = 'HEAD' == req.method,
        get = 'GET' == req.method;
    
    // Ignore non-get requests
    if(!head && !get) return next();
    
    var url = parse(req.url),
        path = decodeURIComponent(url.pathname);

    // Join and normalize from root
    path = normalize(join(options.root, path));
        
    fs.stat(path, function(err, stat) {
      // Ignore ENOENT (no such file or dir)
      if(err) {
        if(err.code === 'ENOENT' || err.code === 'ENAMETOOLONG')
          return next();
        else 
          return next(err);
      } else if(stat.isDirectory())
        return next();
      
      // Read the contents of the file
      read(path, function(err, content) {
        if(err || !content) return next(err);
        
        // Compile the asset
        thimble.compile(path)(content, options, function(err, str) {
          // Move on if compiler didn't do anything,
          // will notify if err === false, kinda hackish
          if(err === false) return next();
        
          if(!res.getHeader('content-type')) {
            var ext = thimble.compile.getType(path) || extname(path),
                header = getHeader('blah.' + ext);
              
            res.setHeader('Content-Type', header);
          }
        
          res.send(str);
        });
        
      });
      
    });
  };
};

/*
  Creates the appropriate header
*/
var getHeader = function(assetPath) {
  var type = mime.lookup(assetPath),
      charset = mime.charsets.lookup(type);
      
  charset = (charset) ? '; charset='+charset : '';
  return (type + charset);
};


/*
  Export module
*/

module.exports = exports.middleware;