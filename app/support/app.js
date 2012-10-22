/**
 * Module dependencies
 */

 var User = require('/models/user.js'),
     Messages = require('/collections/messages.js'),
     Groups = require('/collections/groups.js');

/**
 * Export `App`
 */

module.exports = App;

/**
 * Initialize the `App`
 * @param {Object} json
 * @return {App}
 */

function App(json) {
  if(!json.user || !json.messages)
    throw new Error('App: Cannot load app, missing JSON data');

  this.user = new User(json.user);
  this.groups = this.user.groups;
  this.messages = new Messages(json.messages);
}
