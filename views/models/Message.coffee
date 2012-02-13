_ = require "underscore"

Backbone = require "Backbone"
Groups = require "Groups:Collection"
Comments = require "Comments:Collection"

class Message extends Backbone.Model

  defaults: 
    topic : ""
    from : ""
    date : "Now"
    groups : []
    commentCount : 0
    
  initialize : (attrs) ->
    {comments, groups} = attrs
    # Pull in Groups and watch the underlying Group models
    # Nimbis.Groups when closure first called - so its here.
    
    groups = _(groups).map (id) ->
      return require("Groups").get(id)
    
    this.groups = new Groups(groups)
          
    # Pull in comments
    this.comments = new Comments
    this.comments.url = '/message/' + this.id + '/comments'      
    
    # If there exists any when instantiated add them immediately, the rest
    # will be lazy-loaded
    if comments
      this.comments.reset comments

    # Used to lazy-load the latest comments - probably will be moved into view.
    latestCommentID = this.comments.getLatestCommentID()
    
    # Not quite ready for you yet :-)!
    # this.comments.fetch
    #   add : true
    #   data :
    #     latest : latestCommentID

# Export
require.register "Message:Model", Message
  
