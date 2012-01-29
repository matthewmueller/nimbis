
###
  Tests for the bundle plugin
###

fs = require 'fs'

should = require 'should'
cheerio = require 'cheerio'
fixtures = __dirname + '/fixtures'

thimble = require '../'

describe 'plugin', ->
  describe '.bundle', ->
    options =
      root : fixtures
      
    beforeEach (done) ->
      thimble = thimble.create(options)
      thimble.use(thimble.bundle())
      done()
    
    it 'should merge two inline scripts', (done) ->
      
      html = """
        <script type = "text/javascript">alert('one');</script>
        <script type = "text/javascript">alert('two');</script>
        <body></body>
      """

      thimble.eval html, {}, (err, content) ->
        
        return done(err) if err
        $ = cheerio.load content
        $('script').length.should.equal 1
        $('body').find('script').length.should.equal 1
        
        done(null)
    
    
    it 'should merge two inline styles', (done) ->
      html = """
        <head></head>
        <style type = "text/css">h1 { background-color : red }</style>
        <style type = "text/css">h2 { background-color : blue }</style>
      """
      
      thimble.eval html, {}, (err, content) ->
        return done(err) if err
        
        $ = cheerio.load content
        $('style').length.should.equal 1
        $('head').find('style').length.should.equal 1
        
        done(null)
    
    it 'should bring in external scripts', (done) ->
      
      html = """
        <head></head>
        <script type = "text/template" src = "/script.js"></script>
        <script type = "text/javascript" src = "/script.js"></script>
        <link type = "text/css" href = "/style.css" />
        <body></body>
      """
      
      thimble.eval html, {}, (err, content) ->
        return done(err) if err
      
        $ = cheerio.load content
        
        # All scripts should be merged
        script = $('script[type="text/javascript"]')
        script.length.should.equal 1
        
        # Should be at bottom of body
        $('body').find('script[type="text/javascript"]').length.should.equal 1

        # No scripts with srcs, besides templates
        templates = $('script[type="text/template"]').length
        ($('script[src]').length - templates).should.equal 0
        
        # No more link tags
        $('link').length.should.equal 0
        
        # Only one style tag
        style = $('style')
        style.length.should.equal 1
        
        # Should be at bottom of head
        $('head').find('style').length.should.equal 1
        
        done(null)
        
    it 'should compile assets like stylus and coffeescript', (done) ->
      html = """
        <head></head>
        <script type = "text/javascript" src = "/cool.coffee"></script>
        <link type = "text/css" href = "/style.styl" />
        <body></body>
      """
      
      thimble.eval html, {}, (err, content) ->
        return done(err) if err
      
        $ = cheerio.load content
        
        # Everything should be compiled
        $('script').text().should.include 'console.log("cool");'
        $('style').text().should.include 'color: #999;'
        
        done()
        
    it 'should maintain proper order', (done) ->
      html = """
        <head></head>
        <script type = "text/javascript" src = "/cool.coffee"></script>
        <script type = "text/javascript">alert("hi world");</script>
        <link type = "text/css" href = "/style.styl" />
        <style type = "text/css">h1 { background-color : red; }</style>
        <body></body>
      """
      
      thimble.eval html, {}, (err, content) ->
        return done(err) if err
      
        $ = cheerio.load content
        
        # Scripts keep order
        script = $('script').text()
        str1 = script.indexOf('console.log("cool");')
        str2 = script.indexOf('alert("hi world");')
        
        (str1 >= 0).should.be.true
        (str2 >= 0).should.be.true
        (str1 < str2).should.be.true

        # Style keeps order
        style = $('style').text()
        str1 = style.indexOf('color: #999;')
        str2 = style.indexOf('h1 { background-color : red; }')
        
        (str1 >= 0).should.be.true
        (str2 >= 0).should.be.true
        (str1 < str2).should.be.true
        
        done()
        
    it 'should ignore http://', (done) ->
      html = """
        <head></head>
        <script type = "text/javascript" src = "http://code.jquery.com/jquery-1.7.1.min.js"></script>
        <link type = "text/css" href = "http://yui.yahooapis.com/3.4.1/build/cssreset/cssreset-min.css" />
        <body></body>
      """
      
      thimble.eval html, {}, (err, content) ->
        return done(err) if err
      
        $ = cheerio.load content
        
        $('script[src]').length.should.equal 1
        $('link').length.should.equal 1
        
        done()
      