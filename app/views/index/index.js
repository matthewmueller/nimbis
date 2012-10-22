/**
 * Module dependencies
 */

var App = require('app'),
    page = require('page'),
    IO = require('io');

/**
 * Data Model and Collection Dependencies
 */

var User = require('/models/user.js'),
    Groups = require('/collections/groups.js'),
    Messages = require('/collections/messages.js');

/**
 * UI Dependencies
 */

var GroupList = require('/ui/group-list/group-list.js'),
    Inbox = require('/ui/inbox/inbox.js');

/**
 * Style Dependencies
 */

require('./index.styl');

/**
 * Initialize the Models and Collections
 */

var user = new User(window.user),
    groups = user.groups,
    messages = new Messages;

// var app = new App({
//   user : window.user,
//   messages : window.messages
// });

/**
 * Initialize websockets
 */

var io = new IO({
  host : 'ws.nimbis.com',
  port: 8080
});

io.on('open', function() {
  console.log('opened websockets');
});

/**
 * Build the `Group List`
 */

var groupList = new GroupList;
groupList.add(groups.toJSON());
groupList.el.appendTo('#left');

/**
 * Build the `Inbox`
 */

var inbox = new Inbox;
inbox.el.appendTo('#middle');

/**
 * Example bindings
 *
 * TODO: Think about how I can move most of this out of index.js,
 * or if I shouldn't. Keep in mind `groups` needs to be present
 */

messages.on('add', function(message) {
  var ids = message.attributes.groups,
      len = ids.length,
      models = [];

  for(var i = 0; i < len; i++) {
    models[i] = groups.get(ids[i]).toJSON();
  }

  var json = message.toJSON();
  json.groups = models;
  inbox.add(json);
});

messages.add(window.messages);

// var inbox = new Inbox;
// inbox.add(app.messages.toJSON());
// inbox.el.appendTo('#middle');

// app.messages.on('add', function(message) {
//   message.attributes.message = 'lol';
//   console.log('message', message.toJSON());
// });

// app.messages.add({
//   message : 'sup'
// });

// console.log(app.messages.at(app.messages.length-1).toJSON());
