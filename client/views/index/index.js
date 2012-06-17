
// Load jQuery
var $ = require('jquery'),
    _ = require('underscore'),
    dispatcher = require('/support/dispatcher.js'),
    Backbone = require('backbone');


// Give backbone jQuery
Backbone.setDomLibrary($);

// Load the models
var User = require('/models/user.js'),
    Messages = require('/collections/messages.js'),
    Groups = require('/collections/groups.js');

var Index = module.exports = Backbone.Router.extend();

Index.prototype.routes = {
  'messages/:id' : 'openMessage'
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

  // Bind the events - should probably be moved into a base router but... for now it's fine
  _.each(this.events, function(action, event) {
    dispatcher.on(event, function(payload) {
      return self[action].call(self, payload);
    });
  });

  this.messages = new Messages(messages);
};

Index.prototype.render = function() {
  var GroupList = require('/ui/group-list/group-list.js'),
      MessageList = require('/ui/message-list/message-list.js'),
      ShareMessage = require('/ui/share-message/share-message.js');

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
  $('#left').html(this.groupList.render().el);

  // Placeholder
  var placeholder = $('<div></div>')
    .append(this.shareMessage.render().el)
    .append(this.messageList.render().el);

  // Add the ShareMessage and MessageList
  $('#middle').html(placeholder);
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