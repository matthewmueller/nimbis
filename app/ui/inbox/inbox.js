/**
 * Module dependencies
 */

var List = require('/ui/list/list.js'),
    template = require('./inbox.mu');

/**
 * Add `inbox.styl`
 */

require('./inbox.styl');

/**
 * Export `Inbox`
 */

module.exports = Inbox;

/**
 * Initialize `Inbox`
 */

function Inbox() {
  if (!(this instanceof Inbox)) return new Inbox;
  List.call(this);
  this.template(template);
  this.el.addClass('inbox');
}

/**
 * Inherit from List
 */

Inbox.prototype = new List;
