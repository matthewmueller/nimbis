/**
 * Extend the layout
 */

var layout = require('../layout/layout.js');

/**
 * Add index styling
 */

require('./index.styl');

/**
 * Module dependencies
 */

var $ = require('jquery'),
    _ = require('underscore'),
    app = require('app'),
    bus = require('bus'),
    request = require('superagent'),
    Backbone = require('backbone');

/**
 * Export the `Index` router
 */

var Index = module.exports = Backbone.Router.extend();

/**
 * Load in the models and collections
 */

var User = require('/models/user.js'),
    Messages = require('/collections/messages.js'),
    Groups = require('/collections/groups.js');

/**
 * `Index` routing
 */

Index.prototype.routes = {
  'messages/:id' : 'openMessage',
  'groups/:id/edit' : 'editGroup',
  'join/' : 'joinGroup',
  'create/' : 'createGroup'
};

/**
 * `Index` events
 */

Index.prototype.events = {
  'message-list:open' : 'openMessage',
  'dialog:close' : 'closeDialog'
};

/**
 * Initialize `Index`
 */

Index.prototype.initialize = function() {
  var self = this;

  // Bind the events - should probably be moved into a base router but... for now it's fine
  _.each(this.events, function(action, event) {
    bus.on(event, function(payload) {
      return self[action].call(self, payload);
    });
  });

};

/**
 * Render `Index`
 */

Index.prototype.boot = function() {
  var self = this,
      GroupList = require('/ui/group-list/group-list.js'),
      MessageList = require('/ui/message-list/message-list.js'),
      ShareMessage = require('/ui/share-message/share-message.js');

  /**
   * Load the `group-list` view
   */

  app.view.groupList = new GroupList({
    collection : app.collection.groups
  });

  $('#left').append(app.view.groupList.render().el);

  /**
   * Load the `share-message` view
   */
  
  app.view.shareMessage = new ShareMessage({
    collection: app.collection.messages
  });

  $('#middle').append(app.view.shareMessage.render().el);

  /**
   * Load the `message-list` view
   */

  app.view.messageList = new MessageList({
    collection : app.collection.messages
  });

  $('#middle').append(app.view.messageList.render().el);


  /**
   * Enable the join button
   */
  
  $('button.join').on('click', function(e) {
    self.navigate('join/', { trigger : true , replace: true });
  });

  /**
   * Enable the create button
   */
  
  $('button.create').on('click', function(e) {
    self.navigate('create/', { trigger : true , replace: true });
  });

  // REFACTOR!
  app.io.on('message', function(data) {
    data = JSON.parse(data);
    if(data.event === 'message:create') {
      app.collection.messages.add(data.data);
    }
  });

  return this;
};

/**********/
/* Routes */
/**********/

/**
 * `openMessage` route
 * @param  {model|message-id} message
 */

Index.prototype.openMessage = function(message) {
  var MessageHeader = require('/ui/message-header/message-header.js'),
      CommentList = require('/ui/comment-list/comment-list.js'),
      ShareComment = require('/ui/share-comment/share-comment.js');

  // If an ID is passed, get the model
  message = _.isString(message) ? app.collection.messages.get(message) : message;

  // Update the URL
  if(!message.isNew())
    this.navigate('messages/' + message.get('id'));
  else
    this.navigate('');

  // Load the MessageHeader view
  var messageHeader = new MessageHeader({
    model : message
  });

  // Load the CommentList view
  var commentList = new CommentList({
    collection : message.get('comments')
  });

  var shareComment = new ShareComment({
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
 * `closeDialog` route
 *
 * Simply reset the navigation
 *
 */
Index.prototype.closeDialog = function() {
  this.navigate('/');
};

/**
 * `/join` - join group route
 */

Index.prototype.joinGroup = function() {
  var Join = require('/ui/dialogs/join/join.js'),
      join = new Join();

  $('#dialog-container').html(join.render().el);
};

/**
 * `/create` - create group route
 */

Index.prototype.createGroup = function() {
  var Create = require('/ui/dialogs/create/create.js'),
      create = new Create();
      
  $('#dialog-container').html(create.render().el);
};
