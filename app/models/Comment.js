var Backbone = require('backbone'),
    User = require('./user.js');

var Comment = module.exports = Backbone.Model.extend();

/**
 * Set the URL
 */

Comment.prototype.url = function() {
  return 'http://api.nimbis.com:8080/messages/' + this.get('messageId') + '/comments';
};

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
  Initialize the comment
*/
Comment.prototype.initialize = function() {
  // var author = this.get('author');
  
  // Instantiate the author object
  // this.set('author', new User(author), { silent : true });
};
