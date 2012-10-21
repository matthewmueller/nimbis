var app = require('app'),
    $ = require('jquery'),
    User = require('/models/user.js'),
    Messages = require('/collections/messages.js');

var user = app.model.user = new User(window.user),
    groups = app.collection.groups = user.groups,
    messages = app.collection.message = new Messages(window.messages);

var MessageList = require('./message-list.js'),
    messageList = new MessageList({
      collection : messages
    });

messageList.render().$el.appendTo('.out');

