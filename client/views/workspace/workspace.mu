<!-- Style -->
<style type="text/css">{{{scotch.css}}}</style>

<div id="ui">
  <div class="instant"></div>
</div>

<!-- Scripts -->
<script type="text/javascript">{{{scotch.js}}}</script>

<!-- Initialize -->
<script type="text/javascript">(function() {
  var workspace = require('workspace');

  workspace.instant();

  // $('.instant').html('hi!')
  // var Backbone = require('backbone'),
  //     index = require('index.js'),
  //     user = {{{user}}},
  //     messages = {{{messages}}};

  // window.app = new index(user, messages);
  // window.app.render();

  // // Start the history
  // Backbone.history.start({pushState: true});
  
})();</script>