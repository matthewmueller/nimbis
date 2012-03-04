/*
  Expose the application `Router`
*/
var Router = App.Routers.App = Backbone.Router.extend();

/*
  Routes
*/
Router.prototype.routes = {
  'messages/:id' : 'loadChat',
  'messages/:cid/local' : 'loadChat'
};

/*
  `loadChat` route
*/
Router.prototype.loadChat = function(id) {
  // Load the message model
  var messageModel = app.DS.messages.getByCid(id);
  
  console.log('messageModel', messageModel);
};