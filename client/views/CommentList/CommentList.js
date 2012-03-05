/*
  Expose CommentList, which extends List
*/

var CommentList = App.Views.CommentList = App.Views.List.extend();

/*
  `CommentList` classname
*/
CommentList.prototype.className = 'comment-list';

/*
  `CommentList` Template
*/
CommentList.prototype.itemTemplate = App.JST['comment-list'];

/*
  Initialize `CommentList`
*/
CommentList.prototype.initialize = function() {
  _.bindAll(this, 'render');
  
  // Bind once rendered
  this.on('rendered', this.bind);
};

/*
  `CommentList` Bindings
*/
CommentList.prototype.bind = function() {  
  // Bind Collection
  this.collection.on('add', this.render);
  this.collection.on('remove', this.render);
  
  // Hack for now, should be once(..)
  this.off('rendered', this.bind);
};
