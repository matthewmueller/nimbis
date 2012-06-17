var Backbone = require('backbone'),
    _ = require('underscore'),
    dispatcher = require('../../support/dispatcher.js'),
    List = require('../list/list.js');

/*
  Add Style
*/
require('./message-list.styl');

/*
  Expose MessageList, which extends List
*/
var MessageList = module.exports = List.extend();

/*
  `MessageList` classname
*/
MessageList.prototype.className = 'message-list';

/*
  `MessageList` message-list Template
*/
MessageList.prototype.itemTemplate = require('./message-list.mu');

/*
  `MessageList` events
*/
MessageList.prototype.events = {
  'click .message-container' : 'open'
};

/*
  Initialize `MessageList`
*/
MessageList.prototype.initialize = function() {
  _.bindAll(this, 'render');
  
  this.on('rendered', this.bind);
};

/*
  `MessageList` Bindings
*/
MessageList.prototype.bind = function() {
  var self = this;

  // Bind Messages
  this.collection.on('add', function(message) {
    self.render();
    self.bindMessage(message);
  });
  
  this.collection.on('remove', function(message) {
    self.render();
    self.unbindMessage(message);
  });

  this.collection.each(this.bindMessage, this);
  this.off('rendered', this.bind);
};

/*
  Message binding, allows comment count to be updated as well
  as changes in the group color
*/
MessageList.prototype.bindMessage = function(message) {
  var comments = message.get('comments'),
      groups = message.get('groups');

  // Bind Comments
  comments.on('add', this.render);
  comments.on('remove', this.render);

  // Bind Groups
  groups.on('change', this.render);

  return this;
};

/*
  When a message is removed, we want to unbind it's event handlers
*/
MessageList.prototype.unbindMessage = function() {};

/*
  loadChat
*/
MessageList.prototype.open = function(e) {
  var cid = e.currentTarget.getAttribute('data-cid'),
      model = this.collection.getByCid(cid);

  // Trigger open event
  dispatcher.trigger('message-list:open', model);

};