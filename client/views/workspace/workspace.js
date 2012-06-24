var $ = require('jquery'),
    Backbone = require('backbone');

// Give backbone jQuery
Backbone.setDomLibrary($);

// UI
var Instant = require('/ui/instant/instant.js');

// module.exports = function() {
//   $('#ui').children().map(function() {
//     var $this = $(this),
//         name = $this.attr('class'),
//         path = '/ui/' + name + '/' + name + '.js';

//     var ui = require(path);

//     $this.html();
//   });
// };


exports.instant = function() {
  var instant = new Instant();
  $('.instant').html(instant.render().el);


};