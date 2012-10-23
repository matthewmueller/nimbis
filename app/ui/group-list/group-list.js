/**
 * Module dependencies
 */

var List = require('/ui/list/list.js'),
    template = require('./group-list.mu'),
    mu = require('minstache');

/**
 * Add `group-list.styl`
 */

require('./group-list.styl');

/**
 * Export `GroupList`
 */

module.exports = GroupList;

/**
 * Initialize `GroupList`
 */

function GroupList(ds) {
  if(!this instanceof GroupList) return new GroupList(ds);

  var groups = this.groups = ds.groups;
  if(!groups) throw new Error('Group List: missing required data');

  List.call(this);
  this.template(template);
  this.el.addClass('group-list');

  groups.on('add', this.add.bind(this));
}

/**
 * Inherit from `List.prototype`
 */

GroupList.prototype.__proto__ = List.prototype;
