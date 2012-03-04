/*
  Expose ShareMessage
*/

var ShareMessage = app.v.ShareMessage = Backbone.View.extend();

/*
  `Messages` classname
*/
ShareMessage.prototype.className = 'share-message';

/*
  `Messages` Template
*/
ShareMessage.prototype.template = JST['share-message'];

/*
  Events
*/
ShareMessage.prototype.events = {
  'click .message' : 'expand',
  'click .share' : 'share'
};

/*
  Initialize `Messages`
*/
ShareMessage.prototype.initialize = function() {
  _.bindAll(this, 'expand', 'shrink', 'share', 'render');
};

/*
  Render `ShareMessage`
*/
ShareMessage.prototype.render = function() {
  var template = JST['share-message']();

  this.$el.append(template);

  return this;
};

/*
  Share message
*/
ShareMessage.prototype.share = function(e) {
  // Stop form from being stupid
  e.preventDefault();
  
  var $el = this.$el,
      $message = $el.find('.message'),
      $groups = $el.find('.share-with'),
      author = app.ds.user.get('name') || '';
  
  // Add message to the Messages collection
  this.collection.add({
    message : $message.val(),
    groups  : $groups.val().split(','),
    author : author
  });
  
  this.clear();
  this.shrink();
};

/*
  Expand form
*/
ShareMessage.prototype.expand = function() {
  this.$el.find('.more').slideDown(100);
};

/*
  Shrink form
*/
ShareMessage.prototype.shrink = function() {
  this.$el.find('.more').slideUp(100);
};

/*
  Clear form
*/
ShareMessage.prototype.clear = function() {
  this.$el.find('textarea, input').val('');
};