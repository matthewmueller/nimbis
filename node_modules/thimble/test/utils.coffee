
###
  For testing the utils
###
should = require 'should'

utils = require('../').utils

describe 'utils', ->
  describe '.relative', ->
  
    it 'should produce nothing for files in same dir', ->
      
      a = '/hi/there'
      b = '/hi/there'
      
      utils.relative(b, a).should.equal ""
    
    it 'should find relative from root', ->
      
      root = '/root/'
      file = '/root/index/a.txt'
      
      utils.relative(root, file).should.equal "index/a.txt"