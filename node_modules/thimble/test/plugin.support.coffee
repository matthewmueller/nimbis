
###
  Needs updating!
###

###
  Tests for the support plugin
###
fs = require 'fs'

should = require 'should'
cheerio = require 'cheerio'
fixtures = __dirname + '/fixtures'

thimble = require '../'

describe 'plugin', ->
  describe '.support', ->
        
    options =
      root : fixtures
      
    beforeEach (done) ->
      thimble = thimble.create(options)
      done()
    
    index = fs.readFileSync fixtures + '/index.html', 'utf8'
    
    it 'should not modify the content if no support files are present', (done) ->
      thimble.render 'index.html', {}, (err, content) ->
        return done(err) if err

        content.should.equal(index)
        content.should.not.include "Hogan.Template.prototype"
        
        return done()

    
    it 'should append support script to the <head> by default', (done) ->
      # Add the support file
      thimble.insert __dirname + '/../support/hogan.js'
      
      thimble.render 'index.html', {}, (err, content) ->
        return done(err) if err
          
        content.should.include "Hogan.Template.prototype"

        done()
    
    it 'should put support file in front if tag not present', (done) ->
      # Add the support file
      thimble.insert __dirname + '/../support/hogan.js'

      thimble.eval '<h2>hi world</h2>', {}, (err, content) ->
        return done(err) if err

        content.should.include "Hogan.Template.prototype"
        before = content.indexOf('Hogan.Template.prototype')
        after = content.indexOf('<h2>')
        # .registerHelper should come before <h2>
        (before < after).should.be.ok 
        
        done()
    
    ###
      Not enough support files right now
    ###
    # it 'should ignore files that arent css or js files', (done) ->
    #   options.support.files.push 'style.styl'
    #   
    #   thimble.support() index, options, (err, content) ->        
    #     done(err)
    
    