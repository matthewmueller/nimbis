n.models.Message = Backbone.Model.extend({
  
  // Defaults
  defaults : {
    topic : "",
    author : "",
    date : "Now",
    groups : [],
    comments : []
  },
  
  // Add a comment to this message
  addComment = function() {
    // var comment = new n.models.Comment()
  },
  
  // Add a group to this message
  addGroup = function() {
    
  }
  
});