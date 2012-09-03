var app = require('app'),
    $ = require('jquery'),
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

/*
 * Done
 */
JoinDialog.prototype.done = function() {
  var data = {},
      $el;

  this.$el.find('input').each(function() {
    $el = $(this);
    data[$el.attr('name')] = $el.val();
  });


  app.collection.groups.add(data);
  this.close();
};
