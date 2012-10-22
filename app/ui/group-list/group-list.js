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

function GroupList() {
  if(!this instanceof GroupList) return new GroupList;
  List.call(this);
  this.template(template);
  this.el.addClass('group-list');
}

/**
 * Inherit from `List.prototype`
 */

GroupList.prototype = new List;
