<!-- Style -->
<link href="index.styl" rel="stylesheet">
<link href="/scotch.css" rel="stylesheet">

<div id="wrapper">
  <div id="top"></div><!-- Top navigation -->
  <div id="container"><!-- Main application container -->
    <div id="left"></div><!-- Left Pane -->
    <div id="middle"></div><!-- Middle Pane -->
    <div id="right"></div><!-- Right Pane -->
  </div><!-- #container -->
</div><!-- #wrapper -->

<!-- Grab the user data from the server -->
<script type="text/javascript">
  // window.user = {{{user}}};
  //window.messages = {{{messages}}};
</script>

<!-- Scripts -->
<script src="/scotch.js" type="text/javascript"></script>

<script type="text/javascript">
require.define('app', function(require, module, exports, __dirname, __filename) {
  var user = {{{user}}},
      messages = {{{messages}}};
      
  // TODO: Really ugly, fix later
  var index = require("/client/views/index/index.js"),
      app = module.exports = new index(user, messages);
});

// Render our application
require('app').render()
</script>