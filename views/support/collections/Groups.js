(function() {
  var app = this.n;
  
  var Groups = Backbone.Collection.extend({
    model : app.models['Group']
  });
  
  app.collections['Groups'] = Groups;
}).call(this);