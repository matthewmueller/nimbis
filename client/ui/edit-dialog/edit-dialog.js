var app = window.app,
    $ = require('jquery'),
    Backbone = require('backbone'),
    _ = require('underscore'),
    Dialog = require('/ui/dialog/dialog.js');

/*
 * Add Style
 */
require('./edit-dialog.styl');

/*
 * Export EditDialog
 */
var EditDialog = module.exports = Dialog.extend();

/*
 * Events
 */
EditDialog.prototype.events =  {
  'click .cancel' : 'close'
};

/*
  `Dialog` classname
*/
EditDialog.prototype.className = 'edit-dialog';

/*
 * Template
 */
EditDialog.prototype.bodyTemplate = require('./edit-dialog-body.mu');

/*
 * Defaults
 */
EditDialog.prototype.defaults = {
  header : 'Edit new group',
  buttons : [
    { className : 'primary done', text : 'Done'},
    { className : 'secondary cancel', text : 'Cancel'}
  ]
};

/*
 * Done
 */
EditDialog.prototype.done = function() {
  var data = {},
      $el;

  this.$el.find('input').each(function() {
    $el = $(this);
    data[$el.attr('name')] = $el.val();
  });

  this.model.set(data);
  this.close();
};