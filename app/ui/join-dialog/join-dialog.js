var app = require('app'),
    $ = require('jquery'),
    superagent = require('superagent'),
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
  'click .cancel' : 'close',
  'click .done' : 'done'
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
    { className : 'primary done', text : 'Save'},
    { className : 'secondary cancel', text : 'Cancel'}
  ]
};

/*
 * Done
 */
JoinDialog.prototype.done = function() {
  var json = {},
      $el;

  // Temporary
  this.$el.find('input').each(function() {
    $el = $(this);
    json[$el.attr('name')] = $el.val();
  });

  if(!json.id) return this.close();
  
  superagent
    .post('api.localhost')
    .send(json)
    .end(function(r) {
      if(!r.ok) return console.error(r.text);
      console.log(r.body);
    });

  app.collection.groups.add(data);
  this.close();
};
