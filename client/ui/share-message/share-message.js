var _ = require('underscore'),
    Backbone = require('backbone'),
    Message = require('../../models/message.js');

/*
  Add styling
*/
require('./share-message.styl');

/*
  Expose ShareMessage
*/

var ShareMessage = module.exports = Backbone.View.extend();

/*
  `Messages` classname
*/
ShareMessage.prototype.className = 'share-message';

/*
  `Messages` Template
*/
ShareMessage.prototype.template = require('./share-message.mu');

/*
  Events
*/
ShareMessage.prototype.events = {
  'click .message' : 'expand',
  'click .share' : 'share'
};

/*
  Initialize `Messages`
*/
ShareMessage.prototype.initialize = function() {
  _.bindAll(this, 'expand', 'shrink', 'share', 'render');
};

/*
  Render `ShareMessage`
*/
ShareMessage.prototype.render = function() {
  this.$el.append(this.template());

  return this;
};

/*
  Share message
*/
ShareMessage.prototype.share = function(e) {
  // Stop form from being stupid
  e.preventDefault();
  
  var $el = this.$el,
      $message = $el.find('.message'),
      $groups = $el.find('.share-with'),
      author = require('app').user.toJSON();
  
  var groups = $groups.val().split(','),
      groupsCollection = [];

  // Temporary until auto-complete
  _.each(groups, function(name) {
    name = $.trim(name);
    var group = require('app').groups.find(function(group) {
      return (group.get('name') === name);
    });

    if(group)
      groupsCollection.push(group.get('id'));
  });

  // We don't have any groups, so don't create a message
  if(!groupsCollection.length) {
    console.log("No groups found:", $groups.val());
    return;
  }

  var messageModel = new Message({
    message : $message.val(),
    groups  : groupsCollection,
    author : author
  });

  // Add message to the Messages collection
  this.collection.add(messageModel);
  
  messageModel.save();


  this.clear();
  this.shrink();
};

/*
  Expand form
*/
ShareMessage.prototype.expand = function() {
  this.$el.find('.more').slideDown(100);
};

/*
  Shrink form
*/
ShareMessage.prototype.shrink = function() {
  this.$el.find('.more').slideUp(100);
};

/*
  Clear form
*/
ShareMessage.prototype.clear = function() {
  this.$el.find('textarea, input').val('');
};