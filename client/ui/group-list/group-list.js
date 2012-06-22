var Backbone = require('backbone'),
    _ = require('underscore'),
    List = require('../list/list.js');

/*
  Add style
*/
require('./group-list.styl');

/*
  Expose Group
*/
var GroupList = module.exports = List.extend();

/*
  `GroupList` events
*/
GroupList.prototype.events = {
  'click .edit' : 'edit'
};

/*
  `GroupList` classname
*/
GroupList.prototype.className = 'group-list';

/*
  Templates
*/
GroupList.prototype.itemTemplate = require('./templates/group-item.mu');
GroupList.prototype.template = require('./templates/group-list.mu');

/*
  Initialize `GroupList`
*/
GroupList.prototype.initialize = function() {
  _.bindAll(this, 'bind');

  this.on('rendered', this.bind);
};

/*
  `GroupList` Bindings
*/
GroupList.prototype.bind = function() {
  // Bind Collection
  this.collection.on('add', this.render, this);
  this.collection.on('remove', this.render, this);

  this.off('rendered', this.bind);
};