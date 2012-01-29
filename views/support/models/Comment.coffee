Backbone = require("backbone");

class Comment extends Backbone.Model
  
  defaults :
    comment : ""
    from : 
      id : undefined
      author : ""
      thumb : ""
    date : ""
  

# Export
require.register "Comment:Model", Comment