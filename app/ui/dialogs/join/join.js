/**
 * Module dependencies
 */

var $ = require('jquery'),
    template = require('./join.mu'),
    Dialog = require('../dialog/dialog.js');

/**
 * Add the styling
 */

require('./join.styl');

/**
 * Export `Join`
 */

module.exports = Join;

/**
 * Initialize `Join`
 */

function Join() {
  this.el = $(template());
  this.addClass('join-dialog');
  Dialog.apply(this, arguments);
}

/**
 * Inherit from `Dialog`
 */

Join.prototype.__proto__ = Dialog.prototype;


// /**
//  * Module dependencies
//  */

// var $ = require('jquery'),
//     superagent = require('superagent'),
//     Dialog = require('../dialog/dialog.js');

// /**
//  * Add Style
//  */

// require('./join.styl');

// /**
//  * Export `Join`
//  */

// module.exports = Join;

// /**
//  * Initialize
//  */

// /**
//  * Events
//  */

// Join.prototype.events =  {
//   'click .cancel' : 'close',
//   'click .join' : 'join'
// };

// /**
//  * Dialog classname
//  */

// Join.prototype.className = 'join-dialog';

// /**
//  * Template
//  */

// Join.prototype.body = require('./body.mu');

// /**
//  * Defaults
//  */

// Join.prototype.defaults = {
//   header : 'Join a new group'
// };

// /**
//  * Initialize
//  */

// Join.prototype.initialize = function() {
//   // Call parent
//   Dialog.prototype.initialize.apply(this, arguments);
  
//   this.button('cancel', 'cancel');
//   this.button('join', 'join');
// };

// /*
//  * Done
//  */
// Join.prototype.join = function() {
//   var self = this,
//       json = {},
//       $el;

//   // Temporary
//   this.$el.find('input').each(function() {
//     $el = $(this);
//     json[$el.attr('name')] = $el.val();
//   });

//   if(!json.id) return this.close();

//   superagent
//     .post('http://api.nimbis.com:8080/join')
//     .send(json)
//     .end(function(res) {
//       if(!res.ok) return console.error(res.text);
//       console.log(res.body);
//       app.collection.groups.add(res.body);
//       self.close();
//     });

// };
