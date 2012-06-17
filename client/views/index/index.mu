<!-- Style -->
<link href="index.styl" rel="stylesheet">
<style type="text/css">{{{scotch.css}}}</style>

<div id="wrapper">
  <div id="top">
    <div class="logo">Nimbis</div>
  </div><!-- Top navigation -->
  <div id="container"><!-- Main application container -->
    <div id="left"></div><!-- Left Pane -->
    <div id="middle"></div><!-- Middle Pane -->
    <div id="right"></div><!-- Right Pane -->
  </div><!-- #container -->
</div><!-- #wrapper -->

<!-- Scripts -->
<script type="text/javascript">{{{scotch.js}}}</script>

<!-- Initialize -->
<script type="text/javascript">(function() {
    
  var Backbone = require('backbone'),
      index = require('index.js'),
      user = {{{user}}},
      messages = {{{messages}}};

  window.app = new index(user, messages);
  window.app.render();

  // Start the history
  Backbone.history.start({pushState: true});
  
})();</script>