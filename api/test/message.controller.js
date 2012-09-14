var expect = require('expect.js'),
    _ = require('underscore'),
    request = require('supertest'),
    authorize = require('./support/authorize'),
    client = require('../support/client'),
    User = require('../models/user'),
    Groups = require('../collections/groups'),
    Message = require('../models/message'),
    Messages = require('../collections/messages'),
    Batch = require('batch'),
    api = require('../api.js');

var groups = new Groups(require('./data/groups')),
    user = require('./data/users').matt,
    password = user.password;

user = new User(user);

describe('Message Controller', function() {
  var token;

  // TODO: Clean up.. this is so ugly
  before(function(done) {
    var batch = new Batch();
    batch.push(function(next) { return groups.save(next); });
    batch.push(function(next) { return user.save(next); });

    batch.end(function(err) {
      if(err) return done(err);
      authorize(user.get('email'), password, function(err, t) {
        if(err) return done(err);
        token = t;
        done();
      });
    });

  });

  describe('GET /messages', function() {
    it('should retrieve a users messages', function(done) {
      var messages = [
        { message : 'hi world!',
          groups : ['123456'],
          author : { name : 'Martha Stewart', id : '098654'}
        },
        {
          message : 'hello there',
          groups : ['654321', '123456'],
          author: { name : 'Jim Bean', id : 'abcdefg'}
        },
        {
          message : 'I shouldnt be found',
          groups : ['abc123'],
          author: { name : 'Jim Bean', id : 'abcdefg'}
        }
      ];

      Messages.create(messages, function(err, models) {
        if(err) return done(err);

        request(api)
        .get('/messages')
        .query({ token : token })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err) return done(err);

          var body = res.body,
              msgs = _(body).pluck('message'),
              ids = _(body).pluck('id');

          expect(msgs).to.contain('hi world!');
          expect(msgs).to.contain('hello there');
          expect(msgs).to.not.contain('I shouldnt be found');
          expect(ids).to.have.length(2);
          done();
        });

      });
    });
  });

  describe.only('POST /messages', function() {
    var response,
        groups = new Groups(require('./data/groups.js')),
        message = require('./data/messages.js').hi;

    // Right now this should go out to some of the groups
    message.groups = groups.toJSON().slice(2);
    message.id = '123456';

    beforeEach(function(done) {

      request(api)
        .post('/messages')
        .query({ token : token })
        .set('Content-Type', 'application/json')
        .send(message)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if(err) return done(err);
          response = res;
          done();
        });
    });

    it('should create a new message', function(done) {
      var body = response.body;

      expect(body.id).to.be.ok();
      // FIXME:  This should be converted back to a date
      expect(body.created_at).to.be.a('string');
      expect(body.message).to.be('hi');

      return done();
    });
  });

  // // Flush the database after the test set
  // after(function(done) {
  //   client.flushdb(function(err) {
  //     if(err) return done(err);
  //     done();
  //   });
  // });

});
