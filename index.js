var express = require('express'),
    scotch = require('scotch'),
    cheerio = require('cheerio'),
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
      directory = dirname(path);

  cons.hogan(path, options, function(err, str) {
    if(err) return fn(err);
    if(options.layout) {
      var layout = join(views, '..', options.layout);
      layout = fs.readFileSync(layout, 'utf8');
      str = layout.replace(/\{?\{\{body\}\}\}?/, str);
    }
    console.log(directory);
    console.log(views);
    str = relative(str, path, views);

    console.log(str);


    return fn(err, str);
  });
});

app.set('views', __dirname + '/client/views');

app.use(scotch(__dirname + '/client/views', { watch : true }));
app.use(express['static'](__dirname + '/client/views'));


app.get('/', function(req, res) {
  res.render('index/index.mu', {
    layout : 'layouts/base.mu'
  });
});

app.listen(8080);
console.log('Server started on port 8080');

