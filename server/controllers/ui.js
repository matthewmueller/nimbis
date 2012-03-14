var app = require('../app'),
    express = require('express');

exports.index = function(req, res, next) {
  if(app.env !== 'development') return next();

  var params = req.params,
      view    = params.view,
      example = params.example || 'index';

  if(!view) {
    // Dangerous: Replace the URL for the next middleware
    req.url = '/';
    express.directory(process.cwd() + '/client/views')(req, res);
  } else {
    
    res.render('views/' + view + '/examples/' + example, {
      layout : '/app/layout.mu',
      title : view + ' | ' + example
    });

  }
};