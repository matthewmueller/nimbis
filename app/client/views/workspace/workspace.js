var $ = require('jquery'),
    Backbone = require('backbone');

require('./workspace.styl');

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
  var Groups = require('/collections/groups.js');
      instant = new Instant({
        collection : new Groups([
          { name : 'javascript', color : 'red' },
          { name : 'football', color : 'brown' },
          { name : 'wildlife', color : 'green' }
        ])
      });

  $('.workspace-instant').html(instant.render().el);


};