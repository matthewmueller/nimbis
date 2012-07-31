var $ = require('jquery'),
    _ = require('underscore'),
    Backbone = require('backbone'),
    Message = require('/models/message.js'),
    Groups = require('/collections/groups.js'),
    instant = require('/support/instant/instant.js');

/*
  Add styling
*/
require('./share-message.styl');
require('/support/instant/instant.css');

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

  var shareWith = this.$el.find('.share-with');
  instant(shareWith, app.groups.toJSON(), function(data, $item) {
    $item.css('background', data.color);
  });

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
      author = window.app.user.toJSON(),
      groupsCollection = [];
  
  var groups = $el.find('.instant-token-item').map(function() {
    return $(this).text();
  });

  // Temporary until auto-complete
  _.each(groups, function(name) {
    name = $.trim(name);
    var group = window.app.groups.find(function(group) {
      return (group.get('name').toLowerCase() === name.toLowerCase());
    });

    if(group)
      groupsCollection.push(group);
  });

  // We don't have any groups, so don't create a message
  if(!groupsCollection.length) {
    console.log("No groups found:", groups.val());
    return;
  }


  var messageModel = new Message({
    message : $message.val(),
    groups  : new Groups(groupsCollection),
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