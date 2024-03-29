var request = require('superagent');

exports.index = function(req, res, next) {
  res.render('login/login');
};

exports.create = function(req, res, next) {
  // Authorize through the API
  request
    .post('api.nimbis.com:8080/authorize')
    .send(req.body)
    .end(function(r) {
      if(!r.ok) return res.send(401);

      // Pass the set-cookie header through
      res.header('set-cookie', r.headers['set-cookie']);
      
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
