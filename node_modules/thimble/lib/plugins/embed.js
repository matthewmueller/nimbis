/*
  embed.js - used to embed templates into the document
*/

/*
  Module dependencies
*/
var fs = require('fs'),
    path = require('path'),
    join = path.join,
    extname = path.extname,
    basename = path.basename,
    normalize = path.normalize,
    cheerio = require('cheerio'),
    thimble = require('../thimble'),
    utils = thimble.utils,
    read = utils.read,
    after = utils.after,
    support = normalize(__dirname + '/../../support');
    
/*
  Template cache
*/

var cache = {};

/*
  Requires caches
*/

var requires = {};
    
/*
  Export module
*/

exports = module.exports = function(opts) {

  return function(content, options, next) {
    var $ = cheerio.load(content),
        $scripts = $('script[type=text/template]'),
        finished;
        
    if($scripts.length) {
      finished = after($scripts.length);
    } else {
      return next(null, content);
    }
    
    $scripts.each(function() {
      var $script = $(this),
          source = $script.attr('src'),
          ext = extname(source),
          id = $script.attr('id'),
          name = (id) ? id : basename(source, ext),
          prefix = boilerplate(options, name),
          assetPath = join(options.root, source),
          precompile;
      
      // Map to known compiles, example: "mu" => "hogan"
      ext = ext.substring(1);
      ext = (thimble.extensions[ext]) ? thimble.extensions[ext] : ext;
      
      precompile = exports[ext];
      
      // If there's no precompiler, either move on or return if finished
      if(!precompile) {
        if(finished()) return next(null, $.html());
        return;
      }
      
      precompile(assetPath, options, function(err, str) {
        if(err) return next(err);
        
        $script.removeAttr('src')
               .attr('type', 'text/javascript');
        
        // Add on boilerplate to template string
        $script.text(prefix + str);
        
        if(finished()) return next(null, $.html());
      });
      
    });
    
  };
};

/*
  Boilerplate for the templates
*/
var boilerplate = function(options, name) {
  var namespace = options.namespace,
      template = options.template,
      JST = namespace + '.' + template,
      out = [];

  // window.JST = 
  out.push('\n' + JST + ' = ');
  
  // window.JST || {}
  out.push(JST + ' || {}; ');
  
  // window.JST['template'] =
  out.push(JST + '[\'' + name + '\'] = ');
  
  return out.join('');
};

/*
  Precompilers
*/

/*
  Hogan.js - Fast mustache templating
*/
exports.hogan = function(file, options, fn) {
  var engine = requires.hogan || (requires.hogan = require('hogan.js')),
      filename = basename(file, extname(file)),
      out = [];
  
  // Add hogan library as support file
  var dep = {
    file : join(support, 'hogan.js'),
    appendTo : 'head'
  };
  options.support.push(dep);
  
  read(file, function(err, str) {
    if(err) return fn(err);

    // Need to bind, because render loses object
    // Call template on clientside with: JST['template'](locals)
    out.push('(function() {');
    out.push('  var __bind = function(fn, me) {');
    out.push('    return function() { return fn.apply(me, arguments); };');
    out.push('  },');
    out.push('  tpl = new Hogan.Template(');
    
    out.push('    ' + engine.compile(str, {asString : true}));
    
    out.push('  );');
    out.push('  return __bind(tpl.render, tpl);');
    out.push('})();');
    
    return fn(null, out.join('\n'));
    
  });
};
    