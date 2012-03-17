<!-- Load the application stylesheet -->
<link href="css/layout.styl" type="text/css" rel="stylesheet">

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

<!-- Application views -->
<include src="/views/GroupList/" />
<include src="/views/ShareMessage/" />
<include src="/views/MessageList/" />
<include src="/views/MessageHeader/" />
<include src="/views/CommentList/" />
<include src="/views/ShareComment/" />

<!-- Initialize our application :-D -->
<script src="javascript/index.js" type="text/javascript"></script>