/**
 * Module dependencies
 */

var List = require('/ui/list/list.js'),
    template = require('./inbox.mu');

/**
 * Add `inbox.styl`
 */

require('./inbox.styl');

/**
 * Export `Inbox`
 */

module.exports = Inbox;

/**
 * Initialize `Inbox`
 */

function Inbox(ds) {
  if (!(this instanceof Inbox)) return new Inbox(ds);

  var messages = this.messages = ds.messages,
      groups = this.groups = ds.groups;

  if(!messages || !groups) throw new Error('Inbox: missing required data to initialize');

  List.call(this);
  this.template(template);
  this.el.addClass('inbox');

  // Bindings
  messages.on('add', this.addMessage.bind(this));
}

/**
 * Inherit from List
 */

Inbox.prototype.__proto__ = List.prototype;

/**
 * Add a new message to the inbox
 */

Inbox.prototype.addMessage = function(message) {
  var ids = message.attributes.groups,
      len = ids.length,
      groups = this.groups,
      models = [];

  for(var i = 0; i < len; i++) {
    models[i] = groups.get(ids[i]).toJSON();
  }

  var json = message.toJSON();
  json.groups = models;
  this.add(json);
};
