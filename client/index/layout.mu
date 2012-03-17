<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8">
    <title>{{title}}</title>

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/vendor/normalize.css">
    <link rel="stylesheet" href="/index/css/base.styl">

    <!-- Third-Party Javascript -->
    <script src="/socket.io/socket.io.js"type="text/javascript"></script>
    <script src="/vendor/jquery.js" type="text/javascript"></script>
    <script src="/vendor/underscore.js" type="text/javascript"></script>
    <script src="/vendor/backbone.js" type="text/javascript"></script>
    <script src="/vendor/jquery.cookie.js" type="text/javascript"></script>

    <!-- Support Files -->
    <script src = "/support/backbone.toJSON.recursive.js" type="text/javascript"></script>    
    <script src = "/support/backbone.sync.socket.js" type="text/javascript"></script>

    <!-- Application -->
    <script src="/index/javascript/app.js" type="text/javascript"></script>

    <!-- Models -->
    <script src="/models/Comment.js" type="text/javascript"></script>
    <script src="/models/Group.js" type="text/javascript"></script>
    <script src="/models/Message.js" type="text/javascript"></script>
    <script src="/models/User.js" type="text/javascript"></script>

    <!-- Collections -->
    <script src="/collections/Comments.js" type="text/javascript"></script>
    <script src="/collections/Groups.js" type="text/javascript"></script>
    <script src="/collections/Messages.js" type="text/javascript"></script>

    <!-- Router -->
    <script src="/routers/index.js" type="text/javascript"></script>

    <!-- Socket routing -->

    <!-- Test data -->
    <script src="/development/data/users.json" type="text/json"></script>
    <script src="/development/data/messages.json" type="text/json"></script>
    
    <!-- Populate our application with initial data -->
    <script type="text/javascript">
    (function() {
      // Initialize data-stores
      App.DS.user = new App.Models.User({{{user}}});
      App.DS.groups = App.DS.user.get('groups');
      App.DS.messages = new App.Collections.Messages(App.JSON.messages);

      App.index = new App.Routers.Index();

    }());
    </script>
  </head>
  <body>
    <yield />
  </body>

</html>