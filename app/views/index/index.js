/**
 * Module dependencies
 */

var $ = require('jquery'),
    App = require('app'),
    page = require('page'),
    IO = require('io');

/**
 * Style Dependencies
 */

require('./index.styl');

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
 * Setup client-side routes
 */

var routes = ['join'];

routes.forEach(function(route) {
  route = '/' + route;
  page(route, require('/routes' + route));
});

page();

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
 * Render the application
 */

user.set(window.user);
groups.add(window.user.groups);
messages.add(window.messages);

/**
 * Initialize websockets
 */

var io = new IO({
  host : 'ws.nimbis.com',
  port: 8080
});

io.socket.on('error', function() {
  throw new Error('IO: Could not open websocket');
});

/**
 * Handle message sharing and recieving
 */

messageBox.on('share', function(message) {
  io.send('message', message.toJSON());
});

io.on('message', function(message) {
  messages.add(message);
});

/**
 * Set up the routes
 */



