
// Load jQuery
var $ = require('jquery-browserify'),
    _ = require('underscore'),
    Backbone = require('backbone');

// Load the models
var User = require('../../models/user.js'),
    Messages = require('../../collections/messages.js');

var Index = module.exports = Backbone.Router.extend();

Index.prototype.initialize = function(user, messages) {
  this.user = new User(user);
  var groups = this.groups = this.user.get('groups');
  
  // Link message group IDs to group models
  _.each(messages, function(message) {
    message.groups = _.map(message.groups, function(group) {
      return groups.get(group);
    });

    // Remove any groups that weren't part of user's groups
    message.groups = _.compact(message.groups);
  });

  this.messages = new Messages(messages);
};

Index.prototype.render = function() {

  var List = require('../../ui/list/list.js');
};