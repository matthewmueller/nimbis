<div class="message clearfix" data-cid="{{cid}}">
  <img class="icon" src="{{author.icon}}" />

  <div class="topic">{{message}}</div>
  
  <div class="more clearfix">

    <div class="groups">
      {{#groups}}
        <span class="group" style="background-color:{{color}}">
          {{name}}
        </span>
      {{/groups}}
    </div><!-- .groups -->

    <div class="comments">{{comments.length}}
    </div>

  </div><!-- .messageInfo -->
</div><!--- .message-container -->