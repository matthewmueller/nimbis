var expect = require('expect.js'),
    _ = require('underscore'),
    request = require('supertest'),
    authorize = require('./support/authorize'),
    client = require('../support/client'),
    User = require('../models/user'),
    Groups = require('../collections/groups'),
    Message = require('../models/message'),
    Messages = require('../collections/messages'),
    api = require('../api.js');

var groups = [
  { id : '123456', name : 'Javascript'},
  { id : '654321', name : 'Soccer'}
];

var user = {
  name : 'Matt',
  email : 'mattmuelle@gmail.com',
  password : 'test',
  groups : groups
};

describe('Message Controller', function() {
  var token;

  // TODO: Clean up.. this is so ugly
  before(function(done) {

    // Create the groups then create the user
    Groups.create(groups, function(err) {
      if(err) return done(err);
      User.create(user, function(err, model) {
        if(err) return done(err);
        authorize(user.email, user.password, function(err, t) {
          if(err) return done(err);
          token = t;
          done();
        });
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
        groups = require('./data/groups.js'),
        message = require('./data/messages.js').hi;

    message.groups = [ groups.javascript, groups.football ];

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
      var message = {
        message : 'Hi world!',
        groups : ['123456', '654321']
      };

      request(api)
        .post('/messages')
        .query({ token : token })
        .set('Content-Type', 'application/json')
        .send(message)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if(err) return done(err);
          var body = res.body;

          expect(body.id).to.be.ok();
          // FIXME:  This should be converted back to a date
          expect(body.created_at).to.be.a('string');
          expect(body.message).to.be('Hi world!');
          return done();
        });

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
