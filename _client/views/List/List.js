/*
  Expose List
*/
var List = App.Views.List = Backbone.View.extend();

/*
  `List` classname
*/
// List.prototype.className = 'list';

/*
  `List` Templates
*/
List.prototype.template = App.JST['list'];
List.prototype.itemTemplate = App.JST['item'];

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
  
  // Add `list` class to el
  this.$el.addClass('list');
  
  // Place the html in the views`el`
  this.$el.html(html);
  
  // Trigger rendered
  this.trigger('rendered');
  
  // Return the view object
  return this;
};