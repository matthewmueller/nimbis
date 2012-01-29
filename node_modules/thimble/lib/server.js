/*
  Server thimble uses for development and production
*/

/*
  Module dependencies
*/

var fs = require('fs'),
    path = require('path'),
    normalize = path.normalize,
    extname = path.extname,
    resolve = path.resolve,
    join = path.join,
    parse = require('url').parse,
    express = require('express'),
    utils = require('./utils'),
    needs = utils.needs,
    read = utils.read;
    
/*
  Start the server
  
  server - express server
*/
exports.start = function(server) {
  var thimble = this,
      options = thimble.settings;
  
  // Rolling our own layout, so express's isn't necessary
  server.set('view options', { layout : false });

  server.configure('production', function() {
    needs(['public', 'build'], options);
    options.build = resolve(options.build);
    options.public = resolve(options.public);

    return production(thimble, server, options);
  });
  
  server.configure('development', function() {
    needs('root', options);
    options.root = resolve(options.root);
    
    return development(thimble, server, options);
  });
};

/*
  Production configuration
*/
var production = function(thimble, server, options) {
  var build = options.build,
      public = options.public,
      stack = server.stack;

  server.set('views', build);
  thimble.set('root', build);
  
  server.use(express.static(public));
  
  // Monkey-path renderer at top of stack
  stack.unshift({
    route : '',
    handle : render.call(thimble, options)
  });
  
};

/*
  Development configuration
*/
var development = function(thimble, server, options) {
  var root = options.root,
      stack = server.stack,
      staticLayer = false,
      layers = [];
      
  server.set('view', root);
  
  // Monkey-path renderer at top of stack
  stack.unshift({
    route : '',
    handle : render.call(thimble, options)
  });
  
  // Look for the static layer, if there is one
  for(var i = 0; i < server.stack.length; i++) {
    var layer = server.stack[i];
    if(layer.handle && layer.handle.name === 'static') {
      staticLayer = i;
      break;
    }
  }
  
  // Add the asset middleware
  layers.push({
    route : '',
    handle : thimble.middleware()
  });
  
  // Add the static overwrite
  layers.push({
    route : '',
    handle : static(options)
  });
  
  // If static layer exists, place in front of it.
  if(staticLayer !== false) {
    stack.splice.apply(stack, [staticLayer, 1].concat(layers));
  } else {
    // Otherwise just add to end
    server.stack = stack.concat(layers);
  }
};

/*
  This will monkey-patch res.render to use thimble's renderer
  
  Note: this will be run in the beginning, but it won't really
  get called until res.render(...) is executed.
*/
var render = exports.render = function render(options) {
  var thimble = this;
  
  return function thimbleRender (req, res, next) {
    var _render = res.render;
    res.render = function(view, locals, fn) {
      locals = locals || {};

      // Revert back to old after called once
      res.render = _render
      
      // Default to .html if no ext given
      if(!extname(view)) view += '.html';
      
      // Layout already included in production
      if(options.env === 'production') 
        delete locals['layout']

      thimble.render(view, locals, function(err, content) {
        if(err) return next(err);
        res.send(content);
      });
    };
    
    // Be on your way
    return next();
  };
};

/*
  This will overwrite static
  
  Basically, prevent static from responding to .html files
*/
var static = exports.static = function (options) {
  var root = options.root;
  
  return function thimbleStatic(req, res, next) {
    var url = parse(req.url),
        path = decodeURIComponent(url.pathname);
        
    // Last part of URL is '/', let it pass
    // Logic taken from connect's static
    if(normalize('/') === path[path.length - 1])
      return next();
    
    // Call connect's static
    return express.static(root)(req, res, next);
  };
};