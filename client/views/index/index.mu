<!-- Style -->
<link href="index.styl" rel="stylesheet">
<style type="text/css">{{{scotch.css}}}</style>

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
<script type="text/javascript">{{{scotch.js}}}</script>

<script type="text/javascript">
(function() {
  var index = require('index.js'),
      user = {{{user}}},
      messages = {{{messages}}};

  window.app = new index(user, messages);
  window.app.render();
})();

</script>