var app = require('../../api'),
    request = require('supertest');

function sid(res) {
  var val = res.headers['set-cookie'];
  if(!val) return '';
  return (/^sessionId=([^;]+);/).exec(val[0])[1];
}

module.exports = function(email, password, fn) {
  request(app)
    .post('/authorize')
    .set('Content-Type', 'application/json')
    .send({ email : email, password : password })
    .end(function(err, res) {
      if(err) return fn(err);
      var id = sid(res);
      fn(null, id);
    });
};
