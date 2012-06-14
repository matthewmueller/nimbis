var express = require('express'),
    scotch = require('scotch'),
    cons = require('consolidate'),
    fs = require('fs'),
    path = require('path'),
    dirname = path.dirname,
    join = path.join,
    relative = require('relative-assets'),
    app = express();

// Basic, synchronous way of supporting layouts in express 3.x
app.engine('mu', function(path, options, fn) {
  var views = app.get('views'),
      view = path;

  function compile() {
    cons.hogan(view, options, function(err, str) {
      if(err) return fn(err);
      str = relative(str, path, views);
      return fn(err, str);
    });
  }

  if(options.layout) {
    // Assumes layouts and views are at same level
    view = join(views, '..', options.layout);
    cons.hogan(path, options, function(err, str) {
      if(err) return fn(err);
      options.body = str;
      compile();
    });
  } else {
    compile();
  }
});

app.set('views', __dirname + '/client/views');

app.use(scotch(__dirname + '/client/views'));
app.use(express['static'](__dirname + '/client/views'));


app.get('/', function(req, res) {
  res.render('index/index.mu', {
    layout : 'layouts/base/base.mu',
    user : 'matt'
  });
});

app.listen(8080);
console.log('Server started on port 8080');

