/**
 * Module dependencies
 */

var crypto = require('crypto'),
    monk = require('../support/monk'),
    _ = require('underscore'),
    isArray = Array.isArray,
    Backbone = require('Backbone');

/**
 * Extend Backbone
 */

var Base = module.exports = Backbone.Model.extend();

/**
 * Set a name
 */

Base.prototype.name = 'base';

/**
 * Set up the default ID for Mongo
 */

Base.prototype.idAttribute = '_id';

/**
 * Initialize
 */

Base.prototype.initialize = function() {};

/**
 * Public: Generate Salt
 */

Base.prototype.makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())).toString();
};

/**
 * Validate Types
 */

Base.prototype.checkTypes = function(types) {
  var model = this;

  _.each(types, function(type, attr) {
    attr = model.get(attr);
    if(!(attr instanceof type)) {
      console.log('error');
      return new Error('Invalid attribute: ' + attr + ' expected to be ' + type.name);
    }
  });

  // No problems
  return false;
};

/**
 * Save Backbone's original `_validate`
 */

var _validate = Base.prototype._validate;

/**
 * Validate some attributes
 * @param  {object} attrs
 * @param  {object} options
 * @return {boolean}
 */

Base.prototype._validate = function(attrs, options) {
  options = options || {};

  var error = false; //this.checkTypes(this.types || {});
  if (!error) return _validate.call(this, attrs, options);

  if (options && options.error) {
    options.error(this, error, options);
  } else {
    this.trigger('error', this, error, options);
  }

  return false;
};

/**
 * Check if the model isValid
 * @return {boolean}
 */
Base.prototype.isValid = function() {
  return !!this._validate();
};

/*
 * Save a model
 */

Base.prototype.save = function(options, fn) {
  var date = new Date(),
      method = this.isNew() ? 'create' : 'update';

  // Allow options to be callback function
  if(_.isFunction(options)) {
    fn = options;
    options = {};
  } else {
    options = _.clone(options);
  }

  this[method](options, fn);
};

/**
 * Fetch a model
 */

Base.prototype.fetch = function(query, fn) {
  var model = this,
      col = monk().get(model.name),
      method = (query._id) ? 'findById' : 'findOne';

  if(typeof query === 'function') {
    fn = query;
    query = { id : model._id };
  }

  col[method](query._id || query, function(err, doc) {
    if(err || !doc) return fn(err, false);
    doc._id = doc._id.toString();
    model.set(doc);
    return fn(null, model);
  });
};

/**
 * Create a model
 */

Base.prototype.create = function(options, fn) {
  var model = this,
      col = monk().get(model.name);

  col.insert(model.toJSON(), function(err, doc) {
    if(err) return fn(err);
    doc._id = doc._id.toString();
    model.set(doc);
    fn(null, model);
  });
};

/**
 * Update a model
 */

Base.prototype.update = function(options, fn) {
  var model = this,
      col = monk().get(model.name);

  var attrs = model.changedAttributes();

  col.findAndModify({ _id : this.id }, { $set : attrs }, function(err, doc) {
    doc._id = doc._id.toString();
    model.set(doc);
    fn(null, model);
  });
};

/**
 * Extending Setters
 */

Base.prototype.push = function(key, value, fn) {
  var model = this,
      col = monk().get(model.name),
      update = { $push : {} };

  update['$push'][key] = value;
  col.findAndModify({ _id : model.id }, update, function(err, doc) {
    if(err) return fn(err);
    // Not sure why this error occurs
    else if(!doc) return fn(new Error('Base.prototype: No document returned!'));
    
    doc._id = doc._id.toString();
    model.set(doc);
    fn(null, model);
  });

  return model;
};

  // // Add timestamps
  // if(this.isNew()) {
  //   method = 'create';
  //   this.set('created_at', date, { silent : true });
  // }
  // this.set('modified_at', date, { silent : true });


  // // Sync the model with the database
  // this.sync(method, options, function(err, model) {
  //   if(!err) model.trigger('saved', model);

  //   // Call hooks if available
  //   if(err && model.onError) {
  //     model.onError.call(model, err, fn);
  //   } else if(!err && model.onSave) {
  //     model.onSave.call(model, model, fn);
  //   } else {
  //     fn(err, model);
  //   }

/*
 * Fetch a particular model
 */

// Base.prototype.fetch = function(options, fn) {
//   if(_.isFunction(options)) fn = options;

//   // Sync the model with the database
//   this.sync('read', options, function(err, model) {

//     // Call hooks if available
//     if(err && model.onError) {
//       model.onError.call(model, err, fn);
//     } else if(!err && model.onFetch) {
//       model.onFetch.call(model, model, fn);
//     } else {
//       fn(err, model);
//     }

//   });
// };

/*
 * Destroy a particular model
 */

Base.prototype.destroy = function(options, fn) {
  if(_.isFunction(options)) fn = options;

  // Sync the model with the database
  this.sync('delete', options, function(err, model) {
    // Call hooks if available
    if(err && model.onError) {
      model.onError.call(model, err, fn);
    } else if(!err && model.onDestroy) {
      model.onDestroy.call(model, model, fn);
    } else {
      fn(err, model);
    }
  });
};

/**
 * -----------------
 * Static Properties
 * -----------------
 */

/**
 * Encrypt a string
 * @param {string} salt
 * @param {string} str
 * @returns {string} encrypted string
 */

Base.encrypt = function(salt, str) {
  return crypto.createHmac('sha1', salt).update(str).digest('hex');
};

/**
 * Create and save a new model
 * @param  {object}   attrs
 * @param  {function} fn
 */

Base.create = function(attrs, fn) {
  var model = new this(attrs);
  model.save(fn);
};

/**
 * Find a model
 * @param  {string}   id
 * @param  {function} fn
 */

Base.find = function(query, fn) {
  if(isArray(query)) return Base.findAll.call(this, query, fn);
  else if(typeof query === 'string') query = { _id : query };
  var model = new this(query);
  model.fetch(query, fn);
};

/**
 * Find all the models
 */

Base.findAll = function(queries, fn) {
  var self = this,
      pending = queries.length,
      out = [],
      model;

  queries.forEach(function(query, i) {
    if(typeof query === 'string') query = { _id : query };
    model = new self(query);
    model.fetch(query, function(err, m) {
      if(err) return fn(err);
      out[i] = m;
      if(!--pending) return fn(null, out);
    });
  });
};
