/**
 * Module dependencies
 */

var $ = require('jquery'),
    JoinDialog = require('/ui/dialogs/join/join.js'),
    CreateDialog = require('/ui/dialogs/create/create.js');

/**
 * /join
 *
 * Show the `join dialog`. Allows users to join new groups
 */

exports.join = function() {
  var dialog = new JoinDialog();
  $('#dialog-container').html(dialog.render().el);
  return this;
};

exports.new = function() {
  var dialog = new CreateDialog();
  $('#dialog-container').html(dialog.render().el);
  return this;
};

exports.edit = function() {
  console.log('edit');
};
