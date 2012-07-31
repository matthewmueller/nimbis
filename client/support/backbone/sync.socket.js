/*
  Websocket implementation of Backbone.sync

  Based on the LocalStorage implementation:
  http://documentcloud.github.com/backbone/docs/backbone-localstorage.html
*/
var Backbone = require('backbone');

exports.create = function(model, options) {
  if(!model.name) {
    console.log("Websockets sync requires a model name!");
  }

  var name = model.name.toLowerCase(),
      event = name + ':create',
      data = model.toJSON();

  // Send the model data to the server
  if(app.socket) {
    console.log('Sending data through socket', event, data);
    app.socket.emit(event, data);
  } else {
    throw new Error('app.socket is not present');
  }
};

module.exports = function(method, model, options) {
  exports[method].call(Backbone, model, options);
};