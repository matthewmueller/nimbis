/*
  Expose the application `Router`
*/
var Router = App.Routers.Index = Backbone.Router.extend();

/*
  Routes
*/
Router.prototype.routes = {
  'messages/:id' : 'loadChat',
  'messages/:cid/local' : 'loadChat'
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
  _.each(this.sockets, function(action, event) {
    App.IO.on(event, function(data) {
      return self[action].call(self, App.IO, data);
    });
  });

};

/*
  `loadChat` route
*/
Router.prototype.loadChat = function(id) {
  // Load the message model
  var messageModel = app.DS.messages.getByCid(id);
  
  console.log('messageModel', messageModel);
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