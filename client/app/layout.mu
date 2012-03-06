<html>
	<head>
		<meta http-equiv="Content-type" content="text/html; charset=utf-8">
		<title>{{title}}</title>

		<!-- Stylesheets -->
		<link rel="stylesheet" href="/vendor/normalize.css">
		<link rel="stylesheet" href="/app/app.styl">

    <!-- Third-Party Javascript -->
    <script src="/vendor/jquery.js" type="text/javascript"></script>
    <script src="/vendor/underscore.js" type="text/javascript"></script>
    <script src="/vendor/backbone.js" type="text/javascript"></script>

    <!-- Application -->
    <script src="/app/app.js" type="text/javascript"></script>

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
    <script src="/routers/app.js" type="text/javascript"></script>

    <!-- Test data -->
    <script src="/development/data/users.json" type="text/json"></script>
    <script src="/development/data/groups.json" type="text/json"></script>
    <script src="/development/data/messages.json" type="text/json"></script>
    <script src="/development/data/comments.json" type="text/json"></script>

    <!-- Server: Populate our application with data -->

    <!-- Test: Populate our appication with data-->
    <script type="text/javascript" data-env="development">
    (function() {
      App.DS.user = new App.Models.User(App.JSON.users[1]);
      App.DS.groups = new App.Collections.Groups(App.JSON.groups);

    }());
    </script>

    <script type="text/javascript" data-env="production">
    (function() {
      App.DS.user = new App.Models.User({{User}});
      App.DS.groups = new App.Collections.Groups({{Groups}});
    }())
    </script>

  </head>
  <body>
    <yield />
  </body>

</html>