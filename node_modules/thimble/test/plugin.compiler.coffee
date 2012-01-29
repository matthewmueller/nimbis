
thimble = require '../'
should = require 'should'

describe 'plugin', ->
  describe '.compile', ->
      
    fixtures = __dirname + '/fixtures'
    options = 
      root : fixtures
      plugins : []
    
    beforeEach (done) ->
      thimble = thimble.create(options)
      done()
    
    it 'should compile stylus', (done) ->
      thimble.render 'style.styl', {}, (err, str) ->
        return done(err) if err
        str.should.include 'color: #999;'
        done()
    
    it 'should compile coffeescript', (done) ->
      thimble.render 'cool.coffee', {}, (err, str) ->
        return done(err) if err
        str.should.include 'return console.log("cool");'
        done()

    it 'should compile jade', (done) ->
      thimble.render 'post.jade', {}, (err, str) ->
        return done(err) if err
        
        str.should.include '<p>this is a post</p>'
        
        done()
      
    it 'should compile markdown', (done) ->
      thimble.use thimble.flatten()
      str = '<include src = "markdown.md" />'
      thimble.eval str, {}, (err, str) ->
        return done(err) if err

        str.should.include "<h1>Header 1</h1>"
        str.should.include "<strong>hi there</strong>"
        str.should.include "<em>cool</em>"

        done()

    it 'should render hogan in development', (done) ->
      # Fake page
      thimble.set('source', 'test.mu')
      
      str = """
        hello {{planet}}!
      """
      
      thimble.eval str, {planet : 'Mars'}, (err, str) ->
        return done(err) if err
        str.should.equal "hello Mars!"
        done()

      
      