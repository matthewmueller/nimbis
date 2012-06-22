var express = require('express'),
    scotch = require('scotch'),
    cons = require('consolidate'),
    stylus = require('stylus'),
    nib = require('nib'),
    fs = require('fs'),
    path = require('path'),
    dirname = path.dirname,
    join = path.join,
    relative = require('relative-assets'),
    app = express();

app.set('client', __dirname + '/client');
app.set('views', app.get('client') + '/views');

// Basic, synchronous way of supporting layouts in express 3.x
app.engine('mu', scotch(app.get('client'), {}, function(path, options, fn) {
  var views = app.get('views'),
      view = path;

  function compile() {
    cons.hogan(view, options, function(err, str) {
      if(err) return fn(err);
      str = relative(str, view, app.get('client'));
      return fn(err, str);
    });
  }

  if(options.layout) {
    // Assumes layouts and views are at same level
    view = join(views, '..', options.layout);
    cons.hogan(path, options, function(err, str) {
      if(err) return fn(err);
      str = relative(str, path, app.get('client'));
      options.body = str;
      compile();
    });
  } else {
    compile();
  }
}));

// Stylus middleware - no writing
app.get(/\.styl$/, function(req, res, next) {
  var client = app.get('client');
  fs.readFile(client + req.url.split('?')[0], 'utf8', function(err, str) {
    if(err) return next(err);
    stylus(str)
      .set('filename', client + req.url)
      .use(nib())
      .render(function(err, str) {
        if(err) return next(err);
        res.setHeader('content-type', 'text/css');
        res.send(str);
      });
  });
});

app.use(express['static'](app.get('client')));

var user = {
  firstName : 'Matt',
  lastName : 'Mueller',
  groups : ['Finance', 'Soccer']
};

var users = require(__dirname + '/data/users.json'),
    messages = require(__dirname + '/data/messages.json');

// Refactor
app.get('/messages/:id', function(req, res, next) {
  res.render('index/index.mu', {
    layout : 'layouts/base/base.mu',
    user : JSON.stringify(users[0]),
    messages : JSON.stringify(messages),
    title : "nimbis"
  });
});

app.get('/groups/:id/edit', function(req, res, next) {
  res.render('index/index.mu', {
    layout : 'layouts/base/base.mu',
    user : JSON.stringify(users[0]),
    messages : JSON.stringify(messages),
    title : "nimbis"
  });
});

app.get('/join', function(req, res, next) {
  res.render('index/index.mu', {
    layout : 'layouts/base/base.mu',
    user : JSON.stringify(users[0]),
    messages : JSON.stringify(messages),
    title : "nimbis"
  });
});


app.get('/', function(req, res) {
  res.render('index/index.mu', {
    layout : 'layouts/base/base.mu',
    user : JSON.stringify(users[0]),
    messages : JSON.stringify(messages),
    title : "nimbis"
  });
});

app.listen(8080);
console.log('Server started on port 8080');

