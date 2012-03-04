/*
  Expose MessageList, which extends List
*/

var MessageList = app.v.MessageList = app.v.List.extend();

/*
  `MessageList` classname
*/
MessageList.prototype.className = 'message-list';

/*
  `MessageList` Template
*/
MessageList.prototype.itemTemplate = JST['message-list'];

/*
  `MessageList` events
*/
MessageList.prototype.events = {
  'click .message-container' : 'loadChat'
}

/*
  Initialize `MessageList`
*/
MessageList.prototype.initialize = function() {
  _.bindAll(this, 'render');

  this.on('rendered', this.bind);
};

/*
  `MessageList` Bindings
*/
MessageList.prototype.bind = function() {
  // Bind Collection
  this.collection.on('add', this.render);
  this.collection.on('remove', this.render);

  // Refactor out
  this.off('rendered', this.bind);
}

/*
  loadChat
*/
MessageList.prototype.loadChat = function(e) {
  var cid = e.currentTarget.getAttribute('data-cid'),
      model = this.collection.getByCid(cid);
  
  var route = (model.isNew()) ? cid + '/local' : model.get('id');
  
  app.router.navigate('messages/' + route, { trigger : true });
};