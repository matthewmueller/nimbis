/**
 * Distributed Messaging for the API
 */

/**
 * Module dependencies
 */

var monk = require('./monk')(),
    events = monk.get('events');

/**
 * Models cache
 */

var models = {};

/**
 * Index the message name
 */

events.index('message');

/**
 * `on` : Listen to a new message
 */

exports.on = function(obj, message, action, fn) {
  fn = fn || function() {};

  var insert = {};

  insert = {
    name : obj.name,
    id : obj.id,
    message : message,
    action : action.toString()
  };
  
  events.insert(insert, fn);
};

/**
 * `emit` : Emit a new message
 */

exports.emit = function() {
  var args = Array.prototype.slice.call(arguments),
      message = args.shift();

  events.findOne({ message : message }, function(err, data)  {
    if(err) return console.error(err);
    else if(!data) return console.error('bus: cannot find message!');
    var name = data.name,
        // A bit specific
        Model = models[name] || (models[name] = require('../models/' + name));

    Model.find(data.id, function(err, model) {
      if(err) return console.error(err);
      else if(!model) return console.error('bus: cannot find model!');
      model[data.action].apply(model, args);
    });
  });
};
