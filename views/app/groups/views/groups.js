(function() {
  var GroupList = Backbone.View.extend({
    className : "groups",

    render : function() {
      var $groups = $(this.el),
          title = this.options.title,
          groupList;
          
      $groups.html(JST['groups']({title : title}));
      groupList = $groups.find('.group-list');
      
      this.collection.each(function(Group) {
        var group = JST['group'](Group.toJSON());
        groupList.append(group);
      });
            
      return this;
    }
    
  });
  
  // Export
  this.n.views['Groups'] = GroupList;
}).call(this);