/**
 * signup.js - Used to create new users
 */

var app = require('../app.js'),
    User = app.models.User,
    _ = require('underscore');

/**
 * index - get the signup form
 * 
 */
exports.index = function(req, res) {

  res.render('signup/signup.mu', {
    title : "Nimbis | Signup"
  });

};

exports.create =  function(req, res, next) {
  var body = req.body;

  for(var key in body) {
    if(!body[key]) {
      return res.redirect('back');
    }
  }

  User.create(body, function(err) {
    if(err) {
      console.log('User Model Error:', 'Unable to signup');
      return res.redirect('back');
    } else {
      res.redirect('home');
    }
  });
};