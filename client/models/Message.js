var Backbone = require('backbone'),
    User = require('./user.js'),
    Comments = require('../collections/comments.js');

/*
  Export Message
*/
var Message = module.exports = Backbone.Model.extend();

/*
  Model Name
*/
Message.prototype.name = 'message';

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
Message.prototype.sync = require('../support/backbone/sync.socket.js');

/*
  Use a recursive `toJSON`
*/
Message.prototype.toJSON = require('../support/backbone/toJSON.recursive.js');

/*
  Initialize the `Message` model
*/
Message.prototype.initialize = function() {
  var groups = this.get('groups'),
      author = this.get('author'),
      comments = this.get('comments');



  this.set({
    'comments' : new Comments(comments),
    'author' : new User(author)
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