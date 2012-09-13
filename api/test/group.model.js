/**
 * Module Dependencies
 */

var expect = require('expect.js'),
    Group = require('../models/group'),
    client = require('../support/client');

/**
 * Group attributes
 */

var attrs = {
  name : 'Javascript'
};

/**
 * Group Model
 */

describe('Group Model', function() {
  var group;

  /**
   * Make sure we're connected to redis
   */
  
  before(function(done) {
    if(client.connected) return done();
    client.on('ready', done);
  });

  /**
   * Initialize a new `Group`
   */

  beforeEach(function() {
    group = new Group(attrs);
  });

  /**
   * Destroy the group if it's been saved
   */
  
  afterEach(function(done) {
    if(!group.isNew()) group.destroy(done);
    else done();
  });

  /**
   * ---------------
   * Group Prototype
   * ---------------
   */
  
  /**
   * `initialize()` a new user
   */
  
  describe('#initialize()', function() {
    it('should create an empty new group', function(done) {
      group = new Group(attrs);
      expect(group.get('id')).to.be.ok();
      expect(group.get('type')).to.be('public');
      return done();
    });
  });

  /**
   * `isNew()` tests
   */

  it('#isNew()', function(done) {
    expect(group.isNew()).to.be(true);
    group.save(function(err, model) {
      expect(model.isNew()).to.be(false);
      done();
    });
  });

  /**
   * `save()` a new user
   */

  describe('#save()', function() {
    it('should save a new group', function(done) {
      group.save(function(err, model) {
        if(err) return done(err);
        expect(model.get('name')).to.be('Javascript');
        expect(model.get('created_at')).to.be.a(Date);
        done();
      });
    });
  });

  /**
   * `destroy()` a user
   */
  
  describe('#destroy(fn)', function() {

    beforeEach(function(done) {
      group.save(done);
    });

    it('should remove a group by id', function(done) {
      var id = group.get('id');
      Group.find(id, function(err, model) {
        expect(model.get('id')).to.equal(id);

        group.destroy(function(err) {
          expect(err).to.be(null);

          Group.find(id, function(err, model) {
            expect(err).to.be(null);
            expect(model).to.be(false);
            done();
          });
        });
      });
    });
  
  });

  /**
   * `fetch()` the contents of a new group
   */
  
  describe('#fetch', function() {
    it('should find a group by id', function(done) {
      // Save an initial model
      group.save(function(err, model) {
        group = new Group({id : model.id});
        expect(group.get('name')).to.be(undefined);

        // Fill in the rest
        group.fetch(function(err, group) {
          if(err) return done(err);
          expect(model.get('name')).to.be('Javascript');
          done();
        });
      });

    });
  });

});
