Backbone = require "Backbone"
Message = require "Message:Model"

class Messages extends Backbone.Collection
  model : Message

# Export
require.register "Messages:Collection", Messages
