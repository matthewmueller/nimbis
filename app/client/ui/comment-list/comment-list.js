var _ = require('underscore'),
    Backbone = require('backbone'),
    List = require('../list/list.js');

/*
  Add Style
*/
require('./comment-list.styl');

/*
  Expose CommentList, which extends List
*/

var CommentList = module.exports = List.extend();

/*
  `CommentList` classname
*/
CommentList.prototype.className = 'comment-list';

/*
  `CommentList` Template
*/
CommentList.prototype.itemTemplate = require('./comment-list.mu');

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
