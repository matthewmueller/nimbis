var Message = App.Models.Message = Backbone.Model.extend();

/*
  Set the defaults
*/
Message.prototype.defaults = {
  message  : "",
  author   : "",
  groups   : [],
  comments : [],
  date : "Now"
};

/*
  Load the groups
*/
Message.prototype.groups = function(options) {
  options = options || {};
  
  var groups = this.get('groups');
  
  // Check if groups already a collection
  if(groups && groups.models) return groups;
  
  // Obtain groups from groups list
  console.log(App.DS.groups);
};

/*
  Load the comments
*/
Message.prototype.comments = function(options) {
  options = options || {};
  
  var comments = this.get('comments');
  
  // Check if comments already a collection
  if(comments && comments.models) {
    return comments;
  }
  
  // Load comments based on options
  
  
  // Add comments to a collection
  comments = new App.Collections.Comments(comments);
  
  // Add to the comments attribute
  this.set({
    comments : comments,
    silent : true 
  });
  
  return comments;
};