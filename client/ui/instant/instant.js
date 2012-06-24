var Backbone = require('backbone');

require('./instant.styl');

var Instant = module.exports = Backbone.View.extend();

Instant.prototype.render = function() {
  this.$el.html('oh hai');
  return this;
};