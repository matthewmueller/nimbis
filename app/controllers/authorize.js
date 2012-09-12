var request = require('superagent');

exports.index = function(req, res, next) {
  res.render('login/login');
};

exports.create = function(req, res, next) {
  // Authorize through the API
  request
    .post('api.localhost:8080/authorize')
    .send(req.body)
    .end(function(r) {
      if(!r.ok) return res.send(401);
      res.cookie(r.headers['set-cookie']);
      res.redirect('/');
    });
};

/**
 * Destroy - Signout
 *
 * Remove the session
 */

exports.destroy = function(req, res, next) {

};
