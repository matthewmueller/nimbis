var expect = require('expect.js'),
    request = require('supertest'),
    client = require('../support/client'),
    User = require('../models/user'),
    app = require('../app.js');

var userAttributes = {
  name : 'Matt Mueller',
  email : 'test@test.com',
  password : 'test'
};

describe('Authorize controller', function() {
  var user;

  before(function(done) {
    User.create(userAttributes, function(err, model) {
      if(err) return done(err);
      user = model;
      done();
    });
  });

  after(function(done) {
    user.destroy(function(err) {
      done(err);
    });
  });

  it('should set the proper cookie, when you authorize correctly', function(done) {
    request(app)
      .post('/authorize')
      .set('Content-Type', 'application/json')
      .send({ email : 'test@test.com', password : 'test' })
      .expect('Content-Type', 'text/plain')
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        expect(res.headers['set-cookie']).to.be.ok();
        expect(res.headers['set-cookie']).to.match(/sessionId=[^;]+;/);
        done();
      });

  });

});
