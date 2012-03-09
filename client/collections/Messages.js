var Messages = App.Collections.Messages = Backbone.Collection.extend();

/*
  Collection name
*/
Messages.prototype.name = 'Messages';

/*
  Add the `Message` Model
*/
Messages.prototype.model = App.Models.Message;