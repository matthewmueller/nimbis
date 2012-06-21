var app = window.app,
    Backbone = require('backbone'),
    _ = require('underscore'),
    Dialog = require('/ui/dialog/dialog.js');

/*
 * Add Style
 */
require('./join-dialog.styl');

/*
 * Export JoinDialog
 */
var JoinDialog = module.exports = Dialog.extend();

/*
 * Events
 */
JoinDialog.prototype.events =  {
  'click .cancel' : 'close'
};

/*
  `Dialog` classname
*/
JoinDialog.prototype.className = 'join-dialog';

/*
 * Template
 */
JoinDialog.prototype.bodyTemplate = require('./join-dialog-body.mu');

/*
 * Defaults
 */
JoinDialog.prototype.defaults = {
  header : 'Join new group',
  buttons : [
    { className : 'primary done', text : 'Done'},
    { className : 'secondary cancel', text : 'Cancel'}
  ]
};

JoinDialog.prototype.initialize = function() {
  console.log(this);
};


/*
 * Done
 */
JoinDialog.prototype.done = function() {
  var group = this.$el.find('input[type=text]').val();
  console.log('lol');
  app.groups.add({ name : group });
  this.close();
};