var Groups = App.Collections.Groups = Backbone.Collection.extend();

/*
  Collection name
*/
Groups.prototype.name = 'Groups';

/*
  Add the `Group` Model
*/
Groups.prototype.model = App.Models.Group;
