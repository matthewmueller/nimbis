/*
  Expose `MessageHeader`
*/

var MessageHeader = app.v.MessageHeader = Backbone.View.extend();

/*
  `MessageHeader` classname
*/
MessageHeader.prototype.className = 'message-header clearfix';

/*
  `MessageHeader` Template
*/
MessageHeader.prototype.template = JST['message-header'];

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

  this.$el.append(template);

  return this;
};