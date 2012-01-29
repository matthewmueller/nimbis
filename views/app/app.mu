<!-- Load the model classes -->
<script src="/support/models/Group.js" type="text/javascript" charset="utf-8"></script>

<!-- Load the collection classes -->
<script src="/support/collections/Groups.js" type="text/javascript" charset="utf-8"></script>

<!-- Application wrapper -->
<div id="wrapper">
  
  <!-- Top bar -->
  <div id="top">
    <!-- Load the header -->
    <include src="header/header.mu" />
  </div>

  <!-- Main content -->
  <div id="main">
    
    <div id="left">
      <!-- Load the contacts -->
      <include src="groups/index.html" />
    </div>
    
    <div id="middle">
      <!-- Load the share bar -->
      <include src="share/share.mu" />
      
      <!-- Load the inbox -->
      <include src="inbox/inbox.mu" />
    </div>
    
    <div id="right">
      <!-- Load the chat box -->
      <include src="chat/chat.mu" />
    </div>
    
  </div><!-- #main -->
  
</div><!-- #wrapper -->