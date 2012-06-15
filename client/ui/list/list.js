var Backbone = require('backbone');

/*
  Add style
*/
require('./list.styl');

/*
  Expose List
*/
var List = module.exports = Backbone.View.extend();

/*
  `List` Templates
*/
List.prototype.template = require('./templates/list.mu');
List.prototype.itemTemplate = require('./templates/item.mu');

/*
  Render `List`
*/
List.prototype.render = function() {
  var self = this,
      items = [];

  if(!this.collection) return this;

  // Render each comment
  this.collection.each(function(item) {
    var attributes = item.toJSON();

    // Attach the cid
    attributes.cid = item.cid;

    var html = self.itemTemplate(attributes);
    items.push(html);

    // TODO: Optimize. Currently re-renders the entire list.
    item.on('change', self.render, self);
  });

  // Render the container template
  var html = this.template({
    items : items.join('')
  });
  
  // Add `list` class to el, because we want the class to be there anyway
  // and not overwritten
  this.$el.addClass('list');
  
  // Place the html in the views`el`
  this.$el.html(html);
  
  // Trigger rendered
  this.trigger('rendered');
  
  // Return the view object
  return this;
};