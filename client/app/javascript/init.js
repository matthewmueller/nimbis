/* 
  init.js - Will be used to instantiate the views and place them on the page
*/

(function() {
  var App = window.App,
      user = App.DS.user,
      messages = App.DS.messages;

  // Load GroupList view
  var groupList = new App.Views.GroupList();
  groupList.collection = App.DS.groups;
  
  // Add GroupList
  $('#left').append(groupList.render().el);

  // Load ShareMessage view
  var shareMessage = new App.Views.ShareMessage();
  shareMessage.collection = App.DS.messages;

  // Add the ShareMessage
  $('#middle').append(shareMessage.render().el);

}());