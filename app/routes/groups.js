/**
 * Module dependencies
 */

var $ = require('jquery'),
    Join = require('/ui/dialogs/join/join.js');

/**
 * /join
 *
 * Show the `join dialog`. Allows users to join new groups
 */

exports.join = function() {
  var join = new Join('Join a new group');

  join
    .overlay()
    .effect('scale')
    .closable()
    .button('Cancel')
    .button('Join')
    .show();

  join.on('cancel', function() {
    this.hide();
  });

  join.on('join', function() {
    this.hide();
  });

};

exports.new = function() {
  var dialog = new CreateDialog();
  $('#dialog-container').html(dialog.render().el);
  return this;
};

exports.edit = function() {
  console.log('edit');
};
