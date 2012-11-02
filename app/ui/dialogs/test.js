/**
 * Module dependencies
 */

var $ = require('jquery'),
    dialog = require('./dialog/dialog.js');
    // Join = require('./join/join.js');
    // Create = require('./create/create.js'),
    // Groups = require('/collections/groups.js'),
    // app = require('app');

dialog('tittleee', 'mezzage')
  .effect('scale')
  .overlay()
  .closable()
  .show();
  // .on('hide', function(){
  //   console.log('closed third');
  // });
// $('.out').

// app.collection.groups = new Groups();

// var join = new Join();
// $('.out').html(join.render().el);

// var create = new Create();
// $('.out').html(create.render().el);
