
###
  Tests for the layout plugin
###
thimble = require '../'
fixtures = __dirname + '/fixtures'

describe 'plugin', ->
  describe '.layout', ->
    
    options =
      root : fixtures
    
    beforeEach (done) ->
      thimble = thimble.create(options)
      thimble.use thimble.layout()
      done()
    
    it 'should place content within <yield /> tag', (done) ->
      str = 'hi there'
      options.layout = 'layout.html'
      
      thimble.eval str, options, (err, content) ->
        throw err if err

        content.should.include "<html>hi there</html>"

        done()