/*
  thimble.js : Main object for setting up and rendering
*/

var fs = require('fs'),
    path = require('path'),
    basename = path.basename,
    extname = path.extname,
    normalize = path.normalize,
    resolve = path.resolve,
    join = path.join,
    _ = require('underscore'),
    utils = require('./utils'),
    middleware = require('./middleware'),
    needs = utils.needs;

// Add current directory node_modules to require paths
require.paths.unshift(join(process.cwd(), 'node_modules'));

// Load all the static functions include plugins
exports = require('./static');

/*
  Public: Set options, may also be called by thimble(...)
*/
exports.set = function(key, value) {
  if(!key) return this;
  else if(_.isObject(key))
    this.settings = _.extend(this.settings, key);
  else if(value)
    this.settings[key] = value;
  
  return this;
};

/*
  Public: Get an option
*/
exports.get = function(key) {
  return this.settings[key];
};

/*
  Public: creates a thimble instance. Sets up the object and 
    passes in the configuration

  configuration - configuration values for the server

  Examples

    var t = thimble.create({
      root : "./client",
      env : "production",
      paths : {
        support : "./client/support"
        vendor : "./client/vendor"
      }
    });

  Returns: an thimble instance Object 
*/
exports.create = function(options) {
  options = options || {};
  
  var thimble = function(options) {
    return thimble.set(options);
  };
  
  // Initialize the stack
  thimble.stack = [];
  
  // Clone to make sure changes in outside don't interfere
  thimble.settings = _.clone(options);
  
  // Get the env from how node is run
  var env = process.env.NODE_ENV || 'development';
  
  // Set the defaults
  _.defaults(thimble.settings, {
    env : env,
    template : 'JST',
    namespace : 'window',
    support : [],
    instance : thimble,
    compile : true
  });
  
  // Attach the utils
  thimble.utils = utils;
  
  // Attach the middleware
  thimble.middleware = middleware;
  
  // Attach all exports to prototype
  thimble.__proto__ = exports;
  
  return thimble;
};

/*
  Public: plug in the plugins that will be called as the content moves
    through the layers. Can be chained.

  fn - a plugin Function

  Examples

    t.use(thimble.focus());

    t.use(thimble.bundle('./public'))

  Returns an instance of the thimble Object
*/
var use = exports.use = function(fn) {
  this.stack.push(fn);
  return this;
};

/*
  Public: Allow thimble to add support files to application
*/
var insert = exports.insert = function(file, appendTo) {
  appendTo = appendTo || 'head';

  // Add as a support file
  this.settings.support.push({
    file: file,
    appendTo: appendTo
  });

  return this;
};

/*
  Public: configure the application for zero or more callbacks.
  When there is no environment present, it will be invoked for
  the development environment. Any combination can be used multiple
  times and in any order.

  env, ... - a splat of String environments to run this configuration on
  fn - configuration Function to invoke when environment is

  Examples

    t.configure(function(){
      // executed for dev envs
    });

    t.configure('all', function(){
      // executed all environments
    });

    t.configure('stage', 'production', function(){
      // executed for stage and production
    });

  Returns an instance of the thimble Object
*/
var configure = exports.configure = function(env, fn) {
  var self = this,
      envs = 'development',
      args = [].slice.call(arguments);
  
  fn = args.pop();

  if(args.length) 
    envs = args;
  
  if (~envs.indexOf('all') || ~envs.indexOf(self.settings.env)) {
    fn.call(self, function(plugin) {
      self.use(plugin);
    });
  }
  
  return this;
};

/*
  Public: starts thimble and configures our server

  app - the server we created in express -- ie. app = express.createServer()
*/
var start = exports.start = function(app) {
  var server = require("./server");
  server.start.call(this, app);
  return this;
};

/*
  Public: renders the application

  file - a String that is the main entry point into our application
  locals - a local variable Object containing parameters to pass through
    to the templates. Locals may contain a `layout` key, which will use the 
    value as a base layout
  fn - a callback Function invoked when render completes. First parameter is
    an `err` variable, second is the content. 

  Examples

    t.render("app.html", { planet : "world" }, function(err, content) {
      if(err) throw err;
      // Content is here.
    });


*/
var render = exports.render = function(file, locals, fn) {
  // If nothing is set, don't do anything
  if (!file || (!locals && !fn)) return;
  
  locals = locals || {};
  
  var self = this,
      options = self.settings;

  // Requires the root
  needs('root', options, function(err) { if(err) return fn(err); });

  // Make sure the root path is absolute
  options.root = resolve(options.root);
  
  // Append the root onto the source file
  options.source = join(options.root, file);

  fs.readFile(options.source, "utf8", function(err, content) {
    if(err) return fn(err);
    eval.call(self, content, locals, fn);
  });
  
  return this;
};

/*
  Public: Evaluate a string
*/
var eval = exports.eval = function(content, locals, fn) {
  if(!locals && !fn) return;
  
  var self = this,
      options = self.settings;
      
  // Requires the root
  needs('root', options, function(err) { if(err) return fn(err); });

  // Save original stack so when we add layouts and stuff, doesnt keep adding
  var stack = _.clone(self.stack);
  
  // Allow fn to be passed as second param
  if (typeof locals === 'function') {
    fn = locals;
    locals = {};
  }
  
  // If there's a layout, add the layout plugin
  if (locals.layout) {
    options.layout = join(options.root, locals.layout);
    // Place on top of stack
    self.stack.unshift(self.layout());
  }
  
  // If theres a source file and we should compile,
  // Compile template at the end with local variables
  if (options.source && options.compile) {
    self.stack.push(self.compile(options.source, locals));
  }
  
  // Add support files
  // This needs to be placed after compile, because compiled
  // templates will hit client-side templating scripts, since
  // they're looking for the same thing.
  self.stack.push(self.support());
  
  // Kick off the plugins
  handle.call(self, content, options, function(err, output) {
    self.stack = stack;
    return fn(err, output);
  });
  
  return this;
};

/*
  Private: Handle the plugin layers
*/
var handle = function(content, options, out) {
  var self = this,
      stack = self.stack,
      index = 0;
    
  function next(err, content) {
    var layer = stack[index++];
        
    // All done
    if(!layer) return out(err, content);
    
    // Plugin punting
    try {
      var arity = layer.length;
      if(err) {
        // Give middleware a chance to deal with it.
        if(arity === 4)
          return layer(err, content, options, next);
        else
          return next(err);
      } else if(arity < 4) {
        return layer(content, options, next);
      } else {
        return next();
      }
    } catch(err) {
      return next(err);
    }
  }  
  
  // Kick it off
  next(null, content);
};

/*
  Hook static application modules onto thimble object
*/
module.exports = exports.create();