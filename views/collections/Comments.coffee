Backbone = require "backbone"
Comment = require("Comment:Model")

class Comments extends Backbone.Collection
  model : Comment
      
  initialize : () ->

  getLatestCommentID : () ->
    comment = this.last()
    return if comment then comment.get("id") else 0

# Export
require.register "Comments:Collection", Comments
