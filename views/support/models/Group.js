(function() {
  
  var Group = Backbone.Model.extend({
    defaults : {
      name : '',
      color : ''
    }
  });
  
  this.n.models['Group'] = Group;
}).call(this);