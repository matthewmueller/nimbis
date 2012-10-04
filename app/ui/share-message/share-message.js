var $ = require('jquery'),
    _ = require('underscore'),
    app = require('app'),
    Backbone = require('backbone'),
    Message = require('/models/message.js'),
    Groups = require('/collections/groups.js');
    // instant = require('/support/instant/instant.js');

/*
  Add styling
*/
require('./share-message.styl');
// require('/support/instant/instant.css');

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
  // instant(shareWith, app.collection.groups.toJSON(), function(data, $item) {
  //   $item.css('background', data.color);
  // });

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
      author = app.model.user.toJSON(),
      groups = [];

  // Integrate with instant-token
  // var groups = $el.find('.instant-token-item').map(function() {
  //   return $(this).text();
  // });
  
  var shareWith = $el.find('.share-with').val().split(',');

  // Temporary until auto-complete
  _.each(shareWith, function(name) {
    name = name.replace(/^\s+/, '').replace(/\s+$/, '');
    var group = app.collection.groups.find(function(group) {
      return (group.get('name').toLowerCase() === name.toLowerCase());
    });

    if(group) groups.push(group.id);
  });

  // We don't have any groups, so don't create a message
  if(!groups.length) {
    console.log("No groups found:", groups);
    return;
  }

  var message = new Message({
    message : $message.val(),
    groups  : groups,
    author : author
  });

  message.save();

  // Add message to the Messages collection
  this.collection.add(message);

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
