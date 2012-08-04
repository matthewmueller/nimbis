
// Load jQuery
var $ = require('jquery'),
    _ = require('underscore'),
    dispatcher = require('/support/dispatcher.js'),
    superagent = require('/vendor/superagent.js'),
    Backbone = require('backbone');

// Give backbone jQuery
Backbone.setDomLibrary($);

// Load the models
var User = require('/models/user.js'),
    Messages = require('/collections/messages.js'),
    Groups = require('/collections/groups.js');

var Index = module.exports = Backbone.Router.extend();

Index.prototype.routes = {
  'messages/:id' : 'openMessage',
  'groups/:id/edit' : 'editGroup',
  'join/' : 'joinGroup'
};

Index.prototype.socketRoutes = {
  'message:create' : 'createMessage',
  'comment:create' : 'createComment'
};

Index.prototype.events = {
  'message-list:open' : 'openMessage'
};

Index.prototype.initialize = function(user, messages) {
  var self = this;

  this.user = new User(user);
  var groups = this.groups = this.user.get('groups');
  
  // Link message group IDs to group models
  _.each(messages, function(message) {
    message.groups = _.map(message.groups, function(group) {
      return groups.get(group);
    });

    // Remove any groups that weren't part of user's groups
    message.groups = new Groups(_.compact(message.groups));
  });

  this.messages = new Messages(messages);

  // Bind the events - should probably be moved into a base router but... for now it's fine
  _.each(this.events, function(action, event) {
    dispatcher.on(event, function(payload) {
      return self[action].call(self, payload);
    });
  });

  /////////////////////
  // Setup socket.io //
  /////////////////////
  var port = document.location.port;
  var socket = this.socket = io.connect('http://ws.localhost:9000');
  
  socket.on('error', function() {
    console.log('Error: socket.io server not responding.');
  });

  socket.on('connect', function() {
    console.log('connected');

  });

  /////////////////////
  // Add superagent  //
  /////////////////////
  this.request = superagent;
};

Index.prototype.render = function() {
  var self = this,
      GroupList = require('/ui/group-list/group-list.js'),
      MessageList = require('/ui/message-list/message-list.js'),
      ShareMessage = require('/ui/share-message/share-message.js'),
      JoinDialog = require('/ui/join-dialog/join-dialog.js');

  // Load ShareMessage view
  this.groupList = new GroupList({
    collection : this.groups
  });

  // Load MessageList view
  this.messageList = new MessageList({
    collection : this.messages
  });

  // Load ShareMessage view
  this.shareMessage = new ShareMessage({
    collection : this.messages
  });

  // Add GroupList
  $('#left').append(this.groupList.render().el);

  // Placeholder
  var placeholder = $('<div></div>')
    .append(this.shareMessage.render().el)
    .append(this.messageList.render().el);

  // Add the ShareMessage and MessageList
  $('#middle').html(placeholder);

  // Add join
  $('button.join').on('click', function(e) {
    self.navigate('join/', { trigger : true , replace: true });
  });
};

/*
  `loadChat` route
*/
Index.prototype.openMessage = function(message) {
  var MessageHeader = require('/ui/message-header/message-header.js'),
      CommentList = require('/ui/comment-list/comment-list.js'),
      ShareComment = require('/ui/share-comment/share-comment.js');

  // If an ID is passed, get the model
  message = _.isString(message) ? this.messages.get(message) : message;

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

/*
 * Join Group
 */
Index.prototype.joinGroup = function() {
  var JoinDialog = require('/ui/join-dialog/join-dialog.js');
  var joinDialog = new JoinDialog();
  $('#dialog-container').html(joinDialog.render().el);
};

/*
 * Edit group
 */
Index.prototype.editGroup = function(id) {
  var EditDialog = require('/ui/edit-dialog/edit-dialog.js');
      group = this.groups.get(id);

  var editDialog = new EditDialog({
    model : group
  });

  $('#dialog-container').html(editDialog.render().el);
};

/*
 * Create a message
 */
Index.prototype.createMessage = function() {
  console.log('called!');
};
