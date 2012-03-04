/*
  Expose List
*/
var List = app.v.List = Backbone.View.extend();

/*
  `List` classname
*/
// List.prototype.className = 'list';

/*
  `List` Templates
*/
List.prototype.template = JST['list'];
List.prototype.itemTemplate = JST['item'];

/*
  Render `List`
*/
List.prototype.render = function() {
  var self = this,
      items = [];

  if(!this.collection) return this;    
  
  // Render each comment
  this.collection.each(function(item) {
    // Attach the cid
    item.attributes.cid = item.cid;

    var html = self.itemTemplate(item.toJSON());
    items.push(html);
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