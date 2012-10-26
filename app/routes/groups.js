/**
 * Module dependencies
 */

var $ = require('jquery'),
    Dialog = require('/ui/dialogs/join/join.js');

/**
 * /join
 * 
 * Show the `join dialog`. Allows users to join new groups
 */

exports.join = function() {
  var dialog = new Dialog();
  $('#dialog-container').html(dialog.render().el);
  return this;
};

exports.new = function() {
  console.log('lol');
};

exports.edit = function() {
  console.log('edit');
};
