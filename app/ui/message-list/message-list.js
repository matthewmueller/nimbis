var app = require('app'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    bus = require('/support/bus.js'),
    List = require('/ui/list/list.js');

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
  'click .message' : 'open'
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

  app.index.navigate('messages/' + id, { trigger : true });
};
