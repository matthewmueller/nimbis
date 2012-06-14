<!-- Style -->
<link href="/scotch.css" rel="stylesheet">

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

<!-- Scripts -->
<script src="/scotch.js" type="text/javascript"></script>

<!-- Init -->
<script type="text/javascript">
  var Nimbis = {};
  window.user = "{{user}}";
  // window.pages.index = require('./index.js');
  var index = require('./index.js');
  console.log(index);
</script>