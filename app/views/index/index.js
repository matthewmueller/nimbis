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
    MessageBox = require('/ui/message-box/message-box.js'),
    Inbox = require('/ui/inbox/inbox.js');

/**
 * Style Dependencies
 */

require('./index.styl');

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
 * Initialize the Models and Collections
 */

var user = new User,
    groups = new Groups,
    messages = new Messages;

/**
 * Build the `Group List`
 */

var groupList = new GroupList({
  groups : groups
});

groupList.el.appendTo('#left');

/**
 * Build the `Message Box`
 */

var messageBox = new MessageBox({
  groups : groups,
  messages : messages
});
messageBox.el.appendTo('#middle');

/**
 * Build the `Inbox`
 */

var inbox = new Inbox({
  groups : groups,
  messages : messages
});

inbox.el.appendTo('#middle');

/**
 * Boot up the application
 */

user.set(window.user);
groups.add(window.user.groups);
messages.add(window.messages);
