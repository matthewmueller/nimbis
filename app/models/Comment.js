var Backbone = require('backbone'),
    User = require('./user.js');

var Comment = module.exports = Backbone.Model.extend();

/*
  Model Name
*/
Comment.prototype.name = 'comment';

/**
 * Set up the default ID for Mongo
 */

Comment.prototype.idAttribute = '_id';


/*
  Set the defaults
*/
Comment.prototype.defaults = {
  comment : '',
  author  : {},
  date    : 'now'
};

/*
  Use a recursive `toJSON`
*/
Comment.prototype.toJSON = require('../support/backbone/toJSON.recursive.js');

/*
  `Comment` model will use socket.io as it's transport
*/
Comment.prototype.sync = require('../support/backbone/sync.socket.js');

/*
  Initialize the comment
*/
Comment.prototype.initialize = function() {
  var author = this.get('author');

  // Instantiate the author object
  this.set('author', new User(author), { silent : true });
};
