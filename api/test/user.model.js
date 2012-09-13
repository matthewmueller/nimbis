/**
 * Module Dependencies
 */

var expect = require('expect.js'),
    User = require('../models/user'),
    client = require('../support/client'),
    Index = require('../structures/hash');

/**
 * Default user attributes
 */

var attrs = {
  name : 'Matt Mueller',
  email : 'mattmuelle@gmail.com',
  username : 'matt',
  password : 'test'
};

/**
 * User Model tests
 */

describe('User Model', function() {
  var user;

  /**
   * Make sure we have a connection to redis
   */
  
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  /**
   * Initialize a new user
   */

  beforeEach(function() {
    user = new User(attrs);
  });

  /**
   * Destroy the user if it's been saved
   */
  
  afterEach(function(done) {
    if(!user.isNew()) user.destroy(done);
    else done();
  });

  /**
   * --------------
   * User Prototype
   * --------------
   */
  
  /**
   * `initialize()` a new user
   */

  describe('#initialize()', function() {
    it('should create a new empty user', function(done) {
      expect(user.get('email')).to.equal('mattmuelle@gmail.com');
      expect(user.get('salt')).to.be.a('string');
      done();
    });
  });

  /**
   * `isNew()` tests
   */
  
  describe('#isNew()', function() {
    it('should be initialized as a new user', function(done) {
      expect(user.isNew()).to.be(true);
      done();
    });

    it('should return false after saved', function(done) {
      user.save(function(err) {
        expect(user.isNew()).to.be(false);
        done();
      });
    });
  });

  /**
   * `save()` a new user
   */
  
  describe('#save()', function() {
    it('should save a new user', function(done) {
      user.save(function(err, model) {
        if(err) return done(err);
        expect(model.get('email')).to.be('mattmuelle@gmail.com');
        expect(model.get('created_at')).to.be.a(Date);
        done();
      });
    });

    it('should save an email index', function(done) {
      user.save(function(err, model) {
        if(err) return done(err);
        var index = new Index('index:email:id');
        index.get(model.get('email'), function(err, data) {
          if(err) return done(err);
          expect(data).to.be(model.id);
          done();
        });
      });
    });

    it('should save a username index if a username is set', function(done) {
      user.set('username', 'matt');
      user.save(function(err, model) {
        if(err) return done(err);
        var index = new Index('index:username:id');
        index.get(model.get('username'), function(err, data) {
          if(err) return done(err);
          expect(data).to.be(model.id);
          done();
        });
      });
    });

  });

  /**
   * `destroy()` a user
   */
  
  describe('#destroy(fn)', function() {

    beforeEach(function(done) {
      user.save(done);
    });

    it('should remove a user by id', function(done) {
      var id = user.get('id');
      User.find(id, function(err, model) {
        expect(model.get('id')).to.equal(id);

        user.destroy(function(err) {
          expect(err).to.be(null);

          User.find(id, function(err, model) {
            expect(err).to.be(null);
            expect(model).to.be(false);
            done();
          });
        });
      });
    });
  
  });

  /**
   * `fetch()` the contents of a new user
   */
  
  describe('#fetch', function() {
    beforeEach(function(done) {
      user.save(done);
    });

    it('should find a user by id', function(done) {
      var model = new User({id : user.id});
      expect(model.get('email')).to.be(undefined);

      // Fill in the rest
      model.fetch(function(err, user) {
        if(err) return done(err);
        expect(user.get('email')).to.be('mattmuelle@gmail.com');
        done();
      });
    });
  });

  /**
   * ------------
   * User Statics
   * ------------
   */
  
  /**
   * check if a user `exists()`
   */

  describe('.exists', function() {

    beforeEach(function(done) {
      user.save(done);
    });

    it('should check existence of a user by email', function(done) {
      User.exists(user.get('email'), function(err, id) {
        if(err) return done(err);
        expect(id).to.be.ok();
        expect(id).to.be(user.id);
        done();
      });
    });

    it('should check existence of a user by username', function(done) {

      User.exists(user.get('username'), function(err, id) {
        if(err) return done(err);
        expect(id).to.be.ok();
        expect(id).to.be(user.id);
        done();
      });
    });

    it('should fail on a random email', function(done) {
      User.exists('haha@haha.com', function(err, id) {
        if(err) return done(err);
        expect(id).to.be(false);
        done();
      });
    });

    it('should fail on a random username', function(done) {
      User.exists('test', function(err, id) {
        if(err) return done(err);
        expect(id).to.be(false);
        done();
      });
    });

  });

  /**
   * `authorize()` a user
   */

  describe('.authorize(username, password, fn)', function() {
    it('should return user id when successful', function(done) {
      user.save(function(err, model) {
        User.authorize(attrs.email, attrs.password, function(err, id) {
          if(err) return done(err);
          expect(id).to.not.be(false);
          expect(id).to.match(/[\w\d]{0,6}/);
          done();
        });
      });
    });
  });

});
