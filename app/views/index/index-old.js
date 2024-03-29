/**
 * Add index styling
 */

require('./index.styl');

/**
 * Module dependencies
 */

var $ = require('jquery'),
    _ = require('underscore'),
    App = require('app'),
    bus = require('bus'),
    Backbone = require('backbone');

/**
 * Use jQuery as the Backbone DOM Library
 */

Backbone.setDomLibrary($);

/**
 * Export the `Index` router
 */

var Index = module.exports = Backbone.Router.extend();

/**
 * `Index` routing
 */

Index.prototype.routes = {
  'messages/:id' : 'openMessage',
  'groups/:id/edit' : 'editGroup',
  'join' : 'joinGroup',
  'create' : 'createGroup'
};

/**
 * `Index` socket events
 */

Index.prototype.socketEvents = {
  'message:create' : 'addMessage',
  'comment:create' : 'addComment'
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
  
  /**
   * Initialize App
   */
  
  window.app = new App({
    user : window.user,
    messages : window.messages
  });

  /**
   * Render the page
   */
  
  this.render();

  /**
   * Bind bus events
   */

  _.each(this.events, function(action, event) {
    bus.on(event, function(payload) {
      return self[action].call(self, payload);
    });
  });

  /**
   * Set up engine.io
   */

  var io = app.io = new eio.Socket({
    host : 'ws.nimbis.com',
    port: 8080
  });

  io.on('error', function() {
    console.error('Could not connect to engine.io');
  });

  io.on('close', function(message) {
    console.log('socket closed - ' + message);
  });

  /**
   * Bind socket events
   */
  
  app.io.on('message', function(payload) {
    payload = JSON.parse(payload);
    if(!payload.event || !payload.data) return;
    var action = self.socketEvents[payload.event];
    if(!action || !self[action]) return;
    self[action].call(self, payload.data);
  });

  return this;
};

/**
 * Paint the page
 */

Index.prototype.render = function() {
  var self = this,
      GroupList = require('/ui/group-list/group-list.js'),
      MessageList = require('/ui/message-list/message-list.js'),
      ShareMessage = require('/ui/share-message/share-message.js');

  /**
   * Load the `group-list` view
   */

  console.log(app.collection.groups);
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
    self.navigate('join', { trigger : true , replace: true });
  });

  /**
   * Enable the create button
   */
  
  $('button.create').on('click', function(e) {
    self.navigate('create', { trigger : true , replace: true });
  });

  /**
   * Bindings
   */
  
  app.view.messageList.on('open', this.openMessage.bind(this));

  return this;
};

//-----------
// URL Routes
//-----------

/**
 * `openMessage` route
 * @param  {model|message-id} message
 */

Index.prototype.openMessage = function(message) {
  var MessageHeader = require('/ui/message-header/message-header.js'),
      CommentList = require('/ui/comment-list/comment-list.js'),
      ShareComment = require('/ui/share-comment/share-comment.js');
  console.log(message);
  // If an ID is passed, get the model
  // var message = app.collection.messages.get(messageId);

  // Load the MessageHeader view
  var messageHeader = new MessageHeader({
    model : message
  });

  // Load the CommentList view
  var commentList = new CommentList({
    collection : message.comments
  });

  var shareComment = new ShareComment({
    messageID : message.get('id'),
    collection : message.comments
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
 * /join - join group route
 */

Index.prototype.joinGroup = function() {
  var Join = require('/ui/dialogs/join/join.js'),
      join = new Join();

  $('#dialog-container').html(join.render().el);
};

/**
 * /create - create group route
 */

Index.prototype.createGroup = function() {
  var Create = require('/ui/dialogs/create/create.js'),
      create = new Create();
      
  $('#dialog-container').html(create.render().el);
};

//--------------
// Socket Routes
//--------------

/**
 * Add a message
 *
 * @param {object} message
 */

Index.prototype.addMessage = function(message) {
  app.collection.messages.add(message);
};

/**
 * Add a comment
 *
 * @param {object} comment
 */

Index.prototype.addComment = function(comment) {
  app.collection.comments.add(comment);
};

/**
 * Boot up
 */

new Index();

/**
 * Start the backbone history
 */

Backbone.history.start({pushState: true});

