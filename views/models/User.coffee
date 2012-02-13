Backbone = require "Backbone"
Groups = require "Groups:Collection"

class User extends Backbone.Model
  
  defaults : 
    first : ""
    last : ""
    
  initialize : (attrs) ->
    {groups} = attrs
    
    this.groups = new Groups groups
  
# Export
require.register "User:Model", User