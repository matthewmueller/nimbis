should = require "should"

thimble = require '../'
fixtures = __dirname + '/fixtures'

    
options =
  root : fixtures


describe 'thimble', ->

  beforeEach (done) ->
    thimble = thimble.create(options)
    done()
    
  describe '.render', ->
    
    it 'should render basic html correctly', (done) ->

      thimble.render 'index.html', {}, (err, content) ->
        throw err if err
        
        content.should.include "cool story, man."
        
        done()
        
    it 'should render with a layout', (done) ->
      
      thimble.render 'title.html', { layout : 'layout.html' }, (err, content) ->
        throw err if err

        content.should.include '<html>This is a pretty important title</html>'
        
        done()
        
    it 'should take allow a function as the 2nd parameter', (done) ->
      
      thimble.render 'index.html', (err, content) ->
        throw err if err
        
        content.should.include "cool story, man."
        
        done()
  
  describe '.use', ->
    
    it 'should add to the stack', ->
      before = thimble.stack.length
      thimble.use thimble.support()
      after = thimble.stack.length
      
      after.should.equal before + 1
      
   
  describe '.configure', ->
  
    # stupid minify
    minify = (content, options, next) ->
      next null, content.replace /\s+/g, ''
      
    it 'doesnt minify in development', (done) ->
      
      thimble.configure 'production', ->
        thimble.use minify
      
      thimble.render 'index.html', (err, content) ->
        
        content.should.include "cool story, man."
        
        done()
        
    it 'minifies in production', (done) ->
      thimble.settings.env = 'production'
      
      thimble.configure 'production', ->
        thimble.use minify
      
      thimble.render 'index.html', (err, content) ->
        content.should.include "coolstory,man."
        
        done()
        
  describe '.set', ->
    
    it 'should set the setting if second arg is present', ->
      thimble.set('env', 'staging')
      thimble.settings.env.should.equal 'staging'

  describe '.get', ->
    
    it 'should get setting if second arg undefined', ->
      thimble.get('env').should.equal 'development'

    it 'should return undefined if we get a non-existent setting', ->
      test = thimble.get('lolcats') is undefined
      test.should.be.true

