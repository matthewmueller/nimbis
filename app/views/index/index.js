/**
 * Module dependencies
 */

var $ = require('jquery'),
    app = require('app'),
    superagent = require('superagent'),
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
    Messages = require('/collections/messages.js'),
    Comments = require('/collections/comments.js');

/**
 * UI Dependencies
 */

var GroupList = require('/ui/group-list/group-list.js'),
    MessageBox = require('/ui/message-box/message-box.js'),
    Inbox = require('/ui/inbox/inbox.js'),
    CommentList = require('/ui/comment-list/comment-list.js');
    CommentBox = require('/ui/comment-box/comment-box.js');

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
 * Build the `Comment List`
 */

var commentList = new CommentList;
commentList.el.appendTo('#right');

/**
 * Build the `Comment Box`
 */

var commentBox = new CommentBox;
commentBox.el.appendTo('#right');

/**
 * Render the application
 */

user.set(window.user);
groups.add(window.user.groups);
messages.add(window.messages);

// Hand over data to `app`
app.user = user;
app.groups = groups;
app.messages = messages;

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
 * Setup client-side routes
 */

var routes = ['groups'],
    routeMap = require('route-map');

routes.forEach(function(route) {
  var fns = require('/routes/' + route),
      mapping;

  for(var r in fns) {
    mapping = '/' + [route, routeMap[r] || r].join('/');
    page(mapping, fns[r]);
  }
});

// Start the history
page();

/**
 * Set up the two buttons
 *
 * TODO: Figure out a better place for this
 */

$('.join').click(function() {
  page('/groups/join');
});

$('.create').click(function() {
  page('/groups/new');
});

inbox.on('select', function(message) {
  commentList.load(message._id);
});
