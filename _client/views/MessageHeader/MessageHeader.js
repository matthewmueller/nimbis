/*
  Expose `MessageHeader`
*/

var MessageHeader = App.Views.MessageHeader = Backbone.View.extend();

/*
  `MessageHeader` classname
*/
MessageHeader.prototype.className = 'message-header clearfix';

/*
  `MessageHeader` Template
*/
MessageHeader.prototype.template = App.JST['message-header'];

/*
  Events
*/
MessageHeader.prototype.events = {

};

/*
  Initialize `MessageHeader`
*/
MessageHeader.prototype.initialize = function() {
  _.bindAll(this, 'render');
};

/*
  Render `MessageHeader`
*/
MessageHeader.prototype.render = function() {
  var message  = this.model.toJSON(),
      template = this.template({
        author : message.author,
        message : message.message,
        groups : message.groups,
        date : message.date
      });

  this.$el.html(template);

  // Will probably need to be refactored.. works for now though
  this.model.get('groups').each(function(group) {
    group.on('change', this.render, this);
  }, this);

  this.model.on('change', this.render, this);

  return this;
};