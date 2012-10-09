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

  events.find({ message : message }, function(err, evs)  {
    if(err) return console.error(err);
    else if(!evs || !evs.length) return console.error('bus: cannot find event!');

    evs.forEach(function(ev) {
      var name = ev.name,
          // A bit specific.. refactor
          Model = models[name] || (models[name] = require('../models/' + name));
      
      Model.find(ev.id, function(err, model) {
        if(err) return console.error(err);
        else if(!model) return console.error('bus: cannot find model!');
        model[ev.action].apply(model, args);
      });
    });
  });
};
