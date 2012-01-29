###
  Focus module
###

exports = module.exports = (type) ->
  type = type || 'hide-others'
  
  return (content, options, next) ->
    
    return next null, content
  
  
###
  In the flatten plugin we could do something like:
  
  thimble.focus('blah') content, options, (err, content) ->
    console.log content
  
###