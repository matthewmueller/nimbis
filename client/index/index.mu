<!-- Load the application stylesheet -->
<link href="index.styl" type="text/css" rel="stylesheet">

<!-- Application wrapper -->
<div id="wrapper">
  <!-- Top navigation -->
  <div id="top"></div>

  <!-- Main application container -->
  <div id="container">
    <!-- Left Pane -->
    <div id="left"></div>

    <!-- Middle Pane -->
    <div id="middle"></div>

    <!-- Right Pane -->
    <div id="right"></div>

  </div><!-- #container -->
</div><!-- #wrapper -->

<!-- Load the app object -->
<script src = "javascript/app.js" type="text/javascript"></script>

<!-- Models -->
<script src="/models/Comment.js" type="text/javascript"></script>
<script src="/models/Group.js" type="text/javascript"></script>
<script src="/models/Message.js" type="text/javascript"></script>
<script src="/models/User.js" type="text/javascript"></script>

<!-- Collections -->
<script src="/collections/Comments.js" type="text/javascript"></script>
<script src="/collections/Groups.js" type="text/javascript"></script>
<script src="/collections/Messages.js" type="text/javascript"></script>

<!-- Views -->
<include src="/views/GroupList/" />
<include src="/views/ShareMessage/" />
<include src="/views/MessageList/" />
<include src="/views/MessageHeader/" />
<include src="/views/CommentList/" />
<include src="/views/ShareComment/" />

<!-- Router -->
<script src="javascript/router.js" type="text/javascript"></script>

<!-- Test data -->
<script src="/development/data/users.json" type="text/json"></script>
<script src="/development/data/messages.json" type="text/json"></script>

<!-- Initialize our application -->
<script type="text/javascript">
  
  // Initialize data-stores
  App.DS.user = new App.Models.User({{{user}}});
  App.DS.groups = App.DS.user.get('groups');
  App.DS.messages = new App.Collections.Messages(App.JSON.messages);

  // Initialize the application router
  App.index = new App.Routers.Index();

  // Start the history
  Backbone.history.start({pushState: true});

</script>