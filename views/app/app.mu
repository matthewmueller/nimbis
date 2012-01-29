<!-- Load the stylesheets -->
<link href="app.styl" type="text/css" rel="stylesheet" />

<!-- Load the model classes -->

<!-- Load the collection classes -->



<!-- Markup -->
<div id="wrapper">
  <!-- Load the header -->
  <include src="header/header.mu" />

  <!-- Main content -->
  <div id="main">
    
    <div id="left">
      <!-- Load the contacts -->
      <include src="contacts/contacts.mu" />
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