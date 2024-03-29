var app = require('app'),
    $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    bus = require('/support/bus.js'),
    List = require('/ui/list/list.js');

/*
  Add Style
*/
require('./message-list.styl');

/**
 * Make sure dom library is set
 */

if(!Backbone.$) Backbone.setDomLibrary($);

/**
 * Export MessageList
 */

var MessageList = module.exports = Backbone.View.extend();

/**
 * MessageList tag name
 */

MessageList.prototype.tagName = 'ul';

/**
 * `MessageList` classname
 */

MessageList.prototype.className = 'list message-list';


/*
  `MessageList` message-list Template
*/
MessageList.prototype.messageTemplate = require('./message-list.mu');

/*
  `MessageList` events
*/
MessageList.prototype.events = {
  'click .message' : 'open'
};

/*
  Initialize `MessageList`
*/

MessageList.prototype.initialize = function() {
  _.bindAll(this, 'render');
  
  // Set up the binding
  // this.on('rendered', this.bind);
};

/**
 * Render `MessageList`
 */

MessageList.prototype.render = function() {
  var messages = this.collection.map(this.renderMessage.bind(this));
  this.$el.append(messages);
  return this;
};

/**
 * Render a single message
 */

MessageList.prototype.renderMessage = function(message) {
  var json = message.toJSON();
  json.cid = message.cid;
  return this.messageTemplate(json);
};

/*
  `MessageList` Bindings
*/
MessageList.prototype.bind = function() {
  var self = this;

  // Bind Messages
  this.collection.on('add', function(message) {
    var groups = message.groups;
    
    // Should be an easier way... we're recovering what we removed before saving..
    // groups = _.map(groups, function(group) {
    //   return app.collection.groups.get(group);
    // });

    // message.set('groups', groups, { silent : true });

    self.render();
    self.bindMessage(message);
  });
  
  this.collection.on('remove', function(message) {
    self.render();
    self.unbindMessage(message);
  });

  // this.collection.each(this.bindMessage, this);
  this.off('rendered', this.bind);
};

/*
  Message binding, allows comment count to be updated as well
  as changes in the group color
*/
MessageList.prototype.bindMessage = function(message) {
  var comments = message.comments,
      groups = message.groups;

  // Bind Comments
  comments.on('add', this.render);
  comments.on('remove', this.render);

  // Bind Groups
  groups.forEach(function(group) {
    group = app.collection.groups.get(group);
    group.on('change', this.render);
  });

  return this;
};

/*
  When a message is removed, we want to unbind it's event handlers
*/

MessageList.prototype.unbindMessage = function() {};

/**
 * Will need to be optimistic when we create a new message,
 * but for clicking on existing messages with "_id"'s
 */
MessageList.prototype.open = function(e) {
  var cid = e.currentTarget.getAttribute('data-cid'),
      model = this.collection.getByCid(cid),
      id = model.id || cid;

  this.trigger('open', model);
};
