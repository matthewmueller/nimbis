/* environment.js
  
  This thimble plugin will look for data-env attributes and hide/show markup
  based on if we are in the right environment

*/
var cheerio = require('cheerio');

module.exports = function(content, options, next) {
  var $ = cheerio.load(content);

  $('[data-env]').each(function() {
    var $this = $(this),
        env = $this.attr('data-env');
    
    if(options.env !== env) {
      $this.remove();
    }

  });

  next(null, $.html());
};
