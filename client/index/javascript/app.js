/* app.js - defines the global application object.
  
  The `App` object contains the following:

  - Models: Contains model classes
  - Collections: Contains collection classes
  - Views: Contains view classes
  - Routers: Contains router classes
  - UI: Contains instances of views
  - DS: Short for Data Store. Contains instances of data (models/collections)
  - JSON: Contains json data, used for testing, handled by thimble
  - JST: Contains client-side templates, handled by thimble
  - IO: Socket.io connection
  
*/
(function() {

  var App = {
    Models : {},
    Collections : {},
    Views : {},
    Routers : {},
    UI : {},
    DS : {},
    JSON : {},
    JST : {}
  };
  console.log(io);
  // Connect socket.io
  App.IO = io.connect('http://localhost');

  // Attach the event system onto the App object
  App = _.extend(App, Backbone.Events);

  // Make the application object global
  window.App = App;
})();