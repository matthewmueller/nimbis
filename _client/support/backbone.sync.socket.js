/*
  Websocket implementation of Backbone.sync

  Based on the LocalStorage implementation:
  http://documentcloud.github.com/backbone/docs/backbone-localstorage.html
*/

(function() {
  if(typeof Backbone === 'undefined') return;

  var sync = {};

  sync.create = function(model, options) {
    if(!model.name) {
      console.log("Websockets sync requires a model name!");
    }

    var name = model.name.toLowerCase(),
        event = name + ':create',
        data = model.toJSON();

    // Send the model data to the server
    App.IO.emit(event, data);
  };

  // Export socketSync
  Backbone.socketSync = function(method, model, options) {
    sync[method].call(Backbone, model, options);
  };

}());