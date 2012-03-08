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
  // TODO: Refactor ShareMessage view to use this.groups instead of
  // calling App.DS.groups directly
  // shareMessage.groups = groups;

  // Load MessageList view
  var messageList = new App.Views.MessageList();
  messageList.collection = messages;

  // Add the ShareMessage and MessageList
  $('#middle')
    .append(shareMessage.render().el)
    .append(messageList.render().el);



}());