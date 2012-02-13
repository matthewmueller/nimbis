/*
  Tests for the minify plugin
*/

var thimble = require('../'),
    should = require('should'),
    fixtures = __dirname + '/fixtures';

describe ('plugin', function() {
  
  var options = {
    root : fixtures,
    source : 'minify.html'
  };
  
  beforeEach(function(done) {
    thimble = thimble.create(options);
    thimble.use(thimble.minify());
    done();
  });
  
  describe('.minify', function() {
    
    it('should minify css', function(done) {
      
      thimble.render('minify.html', {}, function(err, content) {
        if(err) return done(err);
        content.should.include('h1{background-color:blue}');
        done();
      });
      
    });
    
    it('should minify js', function(done) {
      
      thimble.render('minify.html', {}, function(err, content) {
        if(err) return done(err);
        content.should.include('var step=exports.step=function(){');
        done();
      });
      
    });

  });
});
