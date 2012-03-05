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
  // Bind Collection
  
  // TODO: Refactor
  this.collection.on('add', function(model) {
    model.comments().on('add', self.render);
    self.render.apply(self, arguments);
  });
  
  this.collection.on('remove', this.render);

  // Bind the comments
  this.bindComments(this.collection);

  // Bind the groups
  this.bindGroups();

  // Refactor out with 'once' event
  this.off('rendered', this.bind);
};

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