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
    <script src="/socket.io/socket.io.js"type="text/javascript"></script>
    <script src="/vendor/jquery.js" type="text/javascript"></script>
    <script src="/vendor/underscore.js" type="text/javascript"></script>
    <script src="/vendor/backbone.js" type="text/javascript"></script>
    <script src="/vendor/jquery.cookie.js" type="text/javascript"></script>

    <!-- Support Files -->
    <script src = "/support/backbone.toJSON.recursive.js" type="text/javascript"></script>
    <script src = "/support/backbone.sync.socket.js" type="text/javascript"></script>
    
    </script>
  </head>
  <body>
    <yield /><!-- Yield our application -->
  </body>

</html>