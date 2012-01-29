
###
  Tests for the embed plugin
###

thimble = require '../'

describe 'plugin', ->
  describe '.embed', ->
    
    options = 
      source : 'test.html'
      root : __dirname + '/fixtures/'
    
    beforeEach (done) ->
      thimble = thimble.create(options)

      # Add the plugins
      thimble.use thimble.embed()
      
      done()

    it 'should precompile hogan templates', (done) ->
      str = "<script type = 'text/template' src = '/template.mu'>"
      
      thimble.eval str, {}, (err, content) ->
        return done(err) if err
        
        content.should.include "Hogan.Template.prototype"
        content.should.include "window.JST['template']"
        content.should.include '_.f("planet"'

        done()
      
    it 'should ignore scripts that arent templates', (done) ->
      str = "<script type = 'text/javascript' src = '/template.mu'>"

      thimble.eval str, {}, (err, content) ->
        return done(err) if err
        
        content.should.include "src = '/template.mu'"
        content.should.not.include "Hogan.Template.prototype"
        content.should.not.include "window.JST['template']"
        
        done()
        
    it 'should skip templates that it doesnt understand', (done) ->
      str = '<script type = "text/template" src = "/template.newb">'
      
      thimble.eval str, {}, (err, content) ->
        return done(err) if err
        
        content.should.include 'src = "/template.newb"'
        content.should.not.include "Hogan.Template.prototype"
        content.should.not.include "window.JST['template']"
        
        done()
        
    it 'should work when both client and server using same templating', (done) ->
      thimble.set 'source', 'test.mu'
      str = "<script type = 'text/template' src = '/template.mu'>"
      
      thimble.eval str, { lulcatz : 'herro' }, (err, content) ->
        return done(err) if err
        
        content.should.include "Hogan.Template.prototype"
        content.should.include "window.JST['template']"
        content.should.include '_.f("planet"'

        done()