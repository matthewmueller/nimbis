var Message = App.Models.Message = Backbone.Model.extend();

/*
  Model Name
*/
Message.prototype.name = 'Message';

/*
  Set the defaults
*/
Message.prototype.defaults = {
  message  : "",
  author   : {},
  groups   : [],
  comments : [],
  date : "Now"
};

/*
  `Message` model will use socket.io as it's transport
*/
Message.prototype.sync = Backbone.socketSync;

/*
  Use the recursive `toJSON`
*/
Message.prototype.toJSON = Message.prototype.recursiveToJSON;

/*
  Initialize the `Message` model
*/
Message.prototype.initialize = function() {
  var groups = this.get('groups'),
      author = this.get('author'),
      comments = this.get('comments');

  var groupCollection = [];

  // Loop through the groupIDs to match with User's groups
  _(groups).each(function(groupID, i) {
    var group = App.DS.groups.get(groupID);
    
    // Might be dangerous
    if(!group) return;
    groupCollection.push(group);
  });

  // TODO: Handle case where we shouldn't be seeing this message.
  if(!groupCollection.length) {
    console.log("Error: \"" + this.get('message') + "\" shouldn't be here");
  }

  this.set({
    'groups' : new App.Collections.Groups(groupCollection),
    'comments' : new App.Collections.Comments(comments),
    'author' : new App.Models.User(author)
  }, { silent : true });

  // This one is easier, we just instantiate a new comment collection
  // this.set('comments', new App.Collections.Comments(comments));

  // Instantiate the author object
  // this.set('author', new App.Models.User(author));
};

Message.prototype.validate = function(attrs) {
  // console.log(attrs.groups);
  // if(!attrs.groups.length)
    // return 'problem';
  // console.log('called', arguments.callee.caller);
  // console.log(attrs.groups);
  // console.log(attrs.groups);
  // if(!attrs.groups.size())
    // return 'Message should not be shown';
};

/*
  Load the groups
*/
// Message.prototype.groups = function(options) {
//   options = options || {};
  
//   var groups = this.get('groups');
  
//   // Check if groups already a collection
//   if(groups && groups.models) return groups;
  
//   // Obtain groups from groups list
//   console.log(App.DS.groups);
// };

// /*
//   Load the comments
// */
// Message.prototype.comments = function(options) {
//   options = options || {};
  
//   var comments = this.get('comments');
  
//   // Check if comments already a collection
//   if(comments && comments.models) {
//     return comments;
//   }
  
//   // Load comments based on options
  
  
//   // Add comments to a collection
//   comments = new App.Collections.Comments(comments);
  
//   // Add to the comments attribute
//   this.set({
//     comments : comments,
//     silent : true 
//   });
  
//   return comments;
// };