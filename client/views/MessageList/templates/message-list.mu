<div class="message-container clearfix" data-cid="{{cid}}">
  <img class="icon" src="" />

  <div class="message">{{message}}</div>
  
  <!-- <div class="author">{{author}}</div> -->
  <div class="more clearfix">

    <div class="groups">
      {{#groups}}
        <span class="group" style="background-color:{{color}}">
          {{name}}
        </span>
      {{/groups}}
    </div><!-- .groups -->

    <div class="date">{{date}}</div>
    <div class="comments">{{comments.length}}</div>

  </div><!-- .messageInfo -->
</div><!--- .message-container -->