should = require 'should'
express = require 'express'

thimble = require '../'
fixtures = __dirname + '/fixtures'

options =
  root : fixtures

describe 'server', ->
  app = undefined
  
  beforeEach (done) ->
    thimble = thimble.create(options)
    done()

  afterEach (done) ->
    # Clear the environment
    delete process.env.NODE_ENV
    done()

  describe '.start', ->
  
    it 'adds three default middleware layers in development', (done) ->    
      app = express.createServer()
      thimble.start(app)
      stack = app.stack

      stack[0].handle.name.should.equal 'thimbleRender'
      stack.pop().handle.name.should.equal 'thimbleStatic'
      stack.pop().handle.name.should.equal 'thimbleMiddleware'
      
      done()
      
    it 'adds one middleware layer in production', (done) ->
      process.env.NODE_ENV = 'production'
      thimble
        public : './public'
        build  : './build'
      
      app = express.createServer()
      thimble.start(app)
      
      stack = app.stack
      
      stack[0].handle.name.should.equal 'thimbleRender'
      stack.pop().handle.name.should.not.equal 'thimbleStatic'
      stack.pop().handle.name.should.not.equal 'thimbleMiddleware'
      
      done()
      
    it 'should replace static middleware in dev', (done) ->
      app = express.createServer()
      app.use(express.static('./public'))
      app.use(express.favicon());
      stack = app.stack
      
      thimble.start(app);
      stack[0].handle.name.should.equal 'thimbleRender'
      stack.pop().handle.name.should.equal 'favicon'
      stack.pop().handle.name.should.equal 'thimbleStatic'
      stack.pop().handle.name.should.equal 'thimbleMiddleware'
      
      done()