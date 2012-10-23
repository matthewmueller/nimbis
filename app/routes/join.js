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

exports = module.exports = function() {
  var dialog = new Dialog();
  $('#dialog-container').html(dialog.render().el);
  return this;
};

exports.id = function() {
  console.log('lol');
};
