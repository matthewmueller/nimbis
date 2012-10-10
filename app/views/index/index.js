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
  '' : 'root',
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
      User = require('/models/user.js'),
      Messages = require('/collections/messages.js'),
      Groups = require('/collections/groups.js');
  
  /**
   * Instantiate the models and collections
   */

  var user = app.model.user = new User(window.user),
      groups = app.collection.groups = app.model.user.get('groups'),
      messages = window.messages;

  messages = _(messages).filter(function(message) { return !!(message); });

  _(messages).each(function(message) {
    // Link message group IDs to group models
    message.groups = _.map(message.groups, function(group) { return groups.get(group); });
    // Remove any groups that weren't part of user's groups
    message.groups = new Groups(_.compact(message.groups));
  });
  // Create model from messages json blob
  app.collection.messages = new Messages(messages);

  /**
   * Paint the page
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

  io.on('close', function() {
    console.log('socket closed');
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

  /**
   * Start the backbone history
   */
  
  Backbone.history.start({pushState: true});
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
 * @param {object} message
 */

Index.prototype.addMessage = function(message) {
  app.collection.messages.add(message);
};

/**
 * Boot up
 */

app.index = new Index();
