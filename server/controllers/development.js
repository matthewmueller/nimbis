var express = require('express');

var examples = exports.examples = {};

examples.index = function(req, res, next) {
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

module.exports = exports;