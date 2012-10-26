var Backbone = require('backbone');

/*
  Export the comments collection
*/
var Comments = module.exports = Backbone.Collection.extend();

/*
  Collection name
*/
Comments.prototype.name = 'comments';

/*
  Add the `Comment` Model
*/

Comments.prototype.model = require('/models/comment.js');

/**
 * Initialize
 */

Comments.prototype.initialize = function(attrs) {
  // console.log(attrs);
};
