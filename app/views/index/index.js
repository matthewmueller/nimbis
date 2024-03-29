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
    messages = new Messages,
    comments = new Comments;

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

var commentList = new CommentList({
  comments : comments
});

commentList.el.appendTo('#right');

/**
 * Build the `Comment Box`
 */

var commentBox = new CommentBox({
  user : user,
  comments : comments
});

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
app.comments = comments;

// Add the view instances to `app`
app.groupList = groupList;
app.messageBox = messageBox;
app.inbox = inbox;
app.commentList = commentList;
app.commentBox = commentBox;

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

commentBox.on('share', function(comment) {
  io.send('comment', comment.toJSON());
});

io.on('message', function(message) {
  console.log('recieving message...');
  messages.add(message);
});

io.on('comment', function(comment) {
  comments.add(comment);
});

/**
 * Setup client-side routes
 *
 * TODO: Add to a router, so we can start reusing variables.
 * router.add('/messages/:messageId/comments', 'comments.index');
 */

var route = {
  groups : require('/routes/groups'),
  comments : require('/routes/comments')
};

// Groups
page('/groups/join', route.groups.join);
page('/groups/new', route.groups.new);
page('/groups/:id/edit', route.groups.edit);

// Comments
page('/messages/:messageId/comments', route.comments.index);

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

/**
 * Display comments
 */

inbox.on('select', function(message) {
  page('/messages/' + message.id + '/comments');
});

messageBox.on('share', function(message) {
  page('/messages/' + message.id + '/comments');
});


/**
 * Load comments
 */

// function loadComments(ctx, next) {
//   var messageId = ctx.params.messageId,
//       comments = commentsCache[messageId];

//   // This might not stay up to-date (maybe it could though..)
//   comments = (comments) ? comments : new Comments;

//   superagent
//     .get('http://api.nimbis.com:8080/messages/' + messageId + '/comments')
//     .end(function(res) {
//       if(!res.ok) throw new Error('Comment List: Unable to load data', res.text);
//       commentsCache[messageId] = comments;
//       comments.add(res.body);
//     });
// }
