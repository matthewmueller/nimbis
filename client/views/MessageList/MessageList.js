/*
  Expose MessageList, which extends List
*/

var MessageList = App.Views.MessageList = App.Views.List.extend();

/*
  `MessageList` classname
*/
MessageList.prototype.className = 'message-list';

/*
  `MessageList` message-list Template
*/
MessageList.prototype.itemTemplate = App.JST['message-list'];

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

MessageList.prototype.unbindMessage = function() {};

/*
  Bind added/removed comments to update count
*/
MessageList.prototype.bindComments = function(messages) {
  messages = messages.toArray();
  if(!messages || !messages.length) return;

  var self = this;

  _.each(messages, function(message) {
    var comments = message.comments();
    
    // Just re-render for now.
    comments.on('add', self.render);
    comments.on('remove', self.render);
  });
  
  return this;
};

/*
  Bind the groups
*/
MessageList.prototype.bindGroups = function() {
  var self = this;
  this.collection.each(function(message) {
    if(!message.get('groups').length) {
      return;
    }
    message.get('groups').each(function(group) {
      group.on('change', self.render, self);
    });
  });
};

/*
  loadChat
*/
MessageList.prototype.open = function(e) {
  var cid = e.currentTarget.getAttribute('data-cid'),
      model = this.collection.getByCid(cid);
      
  // Trigger open event
  App.trigger('message-list:open', model);

};