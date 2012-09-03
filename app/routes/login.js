var request = require('superagent');

exports.index = function(req, res, next) {
  res.render('login/login');
};

exports.create = function(req, res, next) {
  request
    .post('api.localhost:8080/authorize')
    .send(req.body)
    .end(function(r) {
      if(!r.ok) return res.send(404);
      res.cookie('user', r.body.id);
      res.redirect('/');
    });
};