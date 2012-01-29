should = require "should"

thimble = require '../'
fixtures = __dirname + '/fixtures'
    
options =
  root : fixtures
  
  

describe 'middleware', ->
  middleware = undefined
  beforeEach (done) ->
    thimble = thimble.create(options)
    middleware = thimble.middleware()
    
    done()
    
  describe '.middleware', ->
    
  ###
    TO BE CONTINUED...
  ###