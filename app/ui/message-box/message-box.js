/**
 * Module dependencies
 */

var $ = require('jquery'),
    Emitter = require('emitter'),
    Events = require('events'),
    Message = require('/models/message'),
    template = require('./message-box.mu')();

/**
 * Add `message-box.styl`
 */

require('./message-box.styl');

/**
 * Export `MessageBox`
 */

module.exports = MessageBox;

/**
 * Initialize `MessageBox`
 *
 * @param {Object} ds data store
 */

function MessageBox(ds) {
  if(!(this instanceof MessageBox)) return new MessageBox(ds);
  
  var groups = this.groups = ds.groups,
      messages = this.messages = ds.messages;

  if(!groups || !messages) throw new Error('MessageBox: missing required data to initialize');
  
  this.el = $(template);

  this.bind('click .message', 'expand')
      .bind('click .share', 'share');
}

/**
 * Mixin `Emitter`
 */

Emitter(MessageBox.prototype);

/**
 * Mixin `Events`
 */

Events(MessageBox.prototype);

/**
 * Expand the message box
 *
 * @param {Event} e
 * @return {MessageBox}
 */

MessageBox.prototype.expand = function(e) {
  this.el.find('.more').slideDown(100);

  // Don't like this, but only way I can think to not cause scrolling
  $('#middle').addClass('expanded');

  return this;
};

/**
 * Shrink the message box
 *
 * @param {Event} e
 * @return {MessageBox}
 */

MessageBox.prototype.shrink = function(e) {
  this.el.find('.more').slideUp(100);

  // Don't like this, but only way I can think to not cause scrolling
  $('#middle').removeClass('expanded');

  return this;
};

/**
 * Share a message
 *
 * @param {Event} e
 * @return {MessageBox}
 */

MessageBox.prototype.share = function(e) {
  e.preventDefault();

  var self = this,
      el = this.el,
      groups = this.groups,
      messages = this.messages;

  // Pull the user input
  var str = el.find('.message').val(),
      names = el.find('.share-with').val().split(/\s*,\s*/);
  
  // Get the ids
  var ids = findGroupIdsByName(names, groups);

  // Create the model
  var message = new Message({
    message : str,
    groups : ids
  });


  message.save();

  message.on('sync', function(message, res) {
    // Pesimistic to make sure we have an ID for comments
    // Simpler, for now...
    self.emit('share', message);
  
    // Add to the collection
    messages.add(message);
  });

  message.on('error', function(message, res) {
    throw new Error('Message-Box: Cannot save message', res.text);
  });


  this.shrink();
};

/**
 * Match group names to group models
 *
 * @param  {Array} names
 * @param  {Collection} groups
 * @return {Array} Array of group ids
 */

function findGroupIdsByName(names, groups) {
  var n = names.length,
      g = groups.length,
      out = [];

  for(var i = 0; i < n; i++) {
    var name = names[i].toLowerCase();
    for(var j = 0; j < g; j++) {
      var group = groups.models[j];
      if(group.get('name').toLowerCase() === name) out.push(group.id);
    }
  }

  return out;
}
