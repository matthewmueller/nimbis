/* 
  init.js - Will be used to instantiate the views and place them on the page
*/

(function() {
  var App = window.App,
      user = App.DS.user,
      groups = App.DS.groups,
      messages = App.DS.messages;

  // Load GroupList view
  var groupList = new App.Views.GroupList();
  groupList.collection = groups;
  
  // Add GroupList
  $('#left').append(groupList.render().el);

  // Load ShareMessage view
  var shareMessage = new App.Views.ShareMessage();
  shareMessage.collection = messages;

  // Load MessageList view
  var messageList = new App.Views.MessageList();
  messageList.collection = messages;

  // Add the ShareMessage and MessageList
  $('#middle')
    .append(shareMessage.render().el)
    .append(messageList.render().el);

  App.on('message-list:open', function(message) {

    // Load the MessageHeader view
    var messageHeader = new App.Views.MessageHeader();
    messageHeader.model = message;

    // Load the CommentList view
    var commentList = new App.Views.CommentList();
    commentList.collection = message.get('comments');

    console.log(message);
    var shareComment = new App.Views.ShareComment();
    console.log(message.id);
    shareComment.messageID  = message.get('id');
    shareComment.collection = message.get('comments');

    var placeholder = $('<div></div>');

    placeholder
      .append(messageHeader.render().el)
      .append(commentList.render().el)
      .append(shareComment.render().el);

    $('#right').html(placeholder);
  });

}());