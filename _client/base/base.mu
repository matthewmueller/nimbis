<!-- 
    base.mu - This is our base layout, all our applications will extend
    from this.
-->

<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>{{title}}</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/vendor/normalize.css">
    <link rel="stylesheet" href="/base/base.styl">

    <!-- Third-Party Javascript -->
    <script src="/vendor/socket.io.js"type="text/javascript"></script>
    <script src="/vendor/jquery.js" type="text/javascript"></script>
    <script src="/vendor/underscore.js" type="text/javascript"></script>
    <script src="/vendor/backbone.js" type="text/javascript"></script>
    <script src="/vendor/jquery.cookie.js" type="text/javascript"></script>

    <!-- Support Files -->
    <script src = "/support/backbone.toJSON.recursive.js" type="text/javascript"></script>
    <script src = "/support/backbone.sync.socket.js" type="text/javascript"></script>
    
    <script type="text/javascript">
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

          // Connect socket.io
          // App.IO = io.connect('http://localhost');

          // Attach the event system onto the App object
          App = _.extend(App, Backbone.Events);

          // Make the application object global
          window.App = App;
        })();
    </script>
  </head>
  <body>
    <yield /><!-- Yield our application -->
  </body>

</html>