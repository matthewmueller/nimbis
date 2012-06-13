/*
  backbone.toJSON.recursive.js

  If we have nested models or collections in our attributes,
  the provided `toJSON` will not turn those collections/models
  into JSON.

  This function provides that functionality for models/collections
  that have nested models/collections as attributes.
*/

(function() {
  if(typeof Backbone === 'undefined') return;

  Backbone.Model.prototype.recursiveToJSON = function() {
    return JSON.parse(JSON.stringify(this.attributes));
  };
}());
