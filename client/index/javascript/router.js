/* 
  init.js - Will be used to instantiate the views and place them on the page
*/

/*
  Expose the application `Router`
*/
var Router = App.Routers.Index = Backbone.Router.extend();

/*
  Routes
*/
Router.prototype.routes = {
  'messages/:id' : 'openMessage'
};

/*
  Route-less event listeners
*/
Router.prototype.events = {
  'message-list:open' : 'openMessage' 
};

/*
  Socket Routes
*/
Router.prototype.sockets = {
  'connect' : 'connect',
  'message:create' : 'createMessage',
  'comment:create' : 'createComment'
};

/*
  Initialize the router
*/
Router.prototype.initialize = function() {
  var self = this;

  // Bind the sockets
  // _.each(this.sockets, function(action, event) {
  //   App.IO.on(event, function(data) {
  //     return self[action].call(self, App.IO, data);
  //   });
  // });

  // // Bind the route-less events
  // _.each(this.events, function(action, event) {
  //   App.on(event, function(data) {
  //     return self[action].call(self, data);
  //   });
  // });

  /*
    Load the index, we don't want to do this in a route, 
    becuase it won't load when other events are requested

    ex. /messages/0 will only run openMessage
  */
  this.index();
};

Router.prototype.index = function() {
  var data = App.DS;

  // Load GroupList view
  var groupList = new App.Views.GroupList({
    collection : data.groups
  });
  
  // Add GroupList
  $('#left').html(groupList.render().el);

  // Load ShareMessage view
  var shareMessage = new App.Views.ShareMessage({
    collection : data.messages
  });

  // Load MessageList view
  var messageList = new App.Views.MessageList({
    collection : data.messages
  });

  // Placeholder
  var placeholder = $('<div></div>')
    .append(shareMessage.render().el)
    .append(messageList.render().el);

  // Add the ShareMessage and MessageList
  $('#middle').html(placeholder);
};

/*
  `loadChat` route
*/
Router.prototype.openMessage = function(message) {
  // If an ID is passed, get the model
  message = _.isString(message) ? App.DS.messages.get(message) : message;

  // Update the URL
  if(!message.isNew())
    this.navigate('messages/' + message.get('id'));
  else
    this.navigate('');

  // Load the MessageHeader view
  var messageHeader = new App.Views.MessageHeader({
    model : message
  });

  // Load the CommentList view
  var commentList = new App.Views.CommentList({
    collection : message.get('comments')
  });

  var shareComment = new App.Views.ShareComment({
    messageID : message.get('id'),
    collection : message.get('comments')
  });

  var placeholder = $('<div></div>');

  placeholder
    .append(messageHeader.render().el)
    .append(commentList.render().el)
    .append(shareComment.render().el);

  $('#right').html(placeholder);
};

/**
 * Socket.io Events
 */

// Emit user connected to the server
Router.prototype.connect = function(io) {
  // Pass groupIDs up to server for fast lookup
  io.emit('user:connect', App.DS.groups.pluck('id'));    
};

// Create a message
Router.prototype.createMessage = function(io, message) {
  App.DS.messages.add(message);
};

// Create a comment
Router.prototype.createComment = function(io, comment) {
  App.DS.comments.add(comment);
};
