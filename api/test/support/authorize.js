var app = require('../../api'),
    request = require('supertest');

module.exports = function(email, password, fn) {
  request(app)
    .post('/authorize')
    .set('Content-Type', 'application/json')
    .send({ email : email, password : password })
    .end(function(err, res) {
      if(err) return fn(err);
      fn(null, res.body.token);
    });
};
