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
  'join/' : 'joinGroup'
};

/**
 * Initialize `Index`
 */

Index.prototype.initialize = function(user, messages) {

  // Save the user, groups, & messages
  this.user = new User(user || window.user);
  this.messages = new Messages(messages || window.messages);
  var groups = this.groups = this.user.get('groups');

  // Link message group IDs to group models
  _.each(messages || [], function(message) {
    message.groups = _.map(message.groups, function(group) {
      return groups.get(group);
    });

    // Remove any groups that weren't part of user's groups
    message.groups = new Groups(_.compact(message.groups));
  });

  this.messages = new Messages(messages);

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
      // ShareMessage = require('/ui/share-message/share-message.js'),
      JoinDialog = require('/ui/join-dialog/join-dialog.js');

  /**
   * Load the group view
   */

  this.groupList = new GroupList({
    collection : this.groups
  });

  $('#left').append(this.groupList.render().el);

  /**
   * Load the MessageList view
   */

  this.messageList = new MessageList({
    collection : this.messages
  });

  $('#middle').append(this.messageList.render().el);

  return this;
};


