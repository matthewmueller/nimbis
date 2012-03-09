/*
  Websocket implementation of Backbone.sync

  Based on the LocalStorage implementation:
  http://documentcloud.github.com/backbone/docs/backbone-localstorage.html
*/

(function() {
  if(typeof Backbone === 'undefined') return;

  var sync = {};

  sync.create = function(model) {
    console.log(model.toJSON());
  };

  // Export socketSync
  Backbone.socketSync = function(method, model, options) {
    sync[method].call(Backbone, model, options);
  };

}());