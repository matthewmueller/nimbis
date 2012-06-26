var Backbone = require('backbone'),
    _ = require('underscore'),
    $ = require('jquery'),
    api = require('./lib/api.js'),
    trie = require('/support/trie.js')();

require('./instant.styl');

var Instant = module.exports = Backbone.View.extend();

Instant.prototype.className = 'instant';
Instant.prototype.template = require('./templates/instant.mu');
Instant.prototype.tokenTemplate = require('./templates/token.mu');

Instant.prototype.initialize = function() {
  _.bindAll(this, 'render', 'register');

  var index = this.index = {};

  if(!this.collection) throw new Error('Instant requires a collection');

  this.collection.each(function(model) {
    var key = model.get('name').toLowerCase();
    index[key] = model;
    trie.add(key);
  });

};

Instant.prototype.render = function() {
  this.$el.html(this.template({}));
  this.register(this.$el);
  return this;
};

Instant.prototype.register = function($el) {
  this.$list = $el.find('.token-list');
  this.$itemInput = $el.find('.token-item-input');
  this.$input = $el.find('.token-input');
  this.$background = $el.find('.token-background-input');
};

// Add in the api
_.extend(Instant.prototype, api);