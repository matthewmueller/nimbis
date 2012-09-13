/**
 * Module dependencies
 */

var expect = require('expect.js'),
    request = require('supertest'),
    client = require('../support/client'),
    User = require('../models/user'),
    api = require('../api.js');

/**
 * User attributes
 */

var attrs = {
  name : 'Matt Mueller',
  email : 'test@test.com',
  password : 'test'
};

/**
 * Test the `/authorize` route
 */

describe('Authorize controller', function() {
  var user;

  /**
   * Create a user
   */
  
  before(function(done) {
    User.create(attrs, function(err, model) {
      if(err) return done(err);
      user = model;
      done();
    });
  });

  /**
   * Destroy a user
   */
  
  after(function(done) {
    user.destroy(done);
  });

  /**
   * POST /authorize
   */
  
  it('should set the proper cookie, when you authorize correctly', function(done) {
    request(api)
      .post('/authorize')
      .set('Content-Type', 'application/json')
      .send({ email : 'test@test.com', password : 'test' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if(err) return done(err);
        expect(res.body.token).to.be.ok();
        expect(res.body.token).to.match(/[\w\d]{0,20}/);
        done();
      });
  });

});
