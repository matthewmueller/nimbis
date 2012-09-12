/**
 * Session storage for tokens
 *
 * Temporary:
 * - LRU (least-recently-used) cache isn't exactly what we want,
 *   self-expiring keys
 * - Right now the keys persist in memory, ideally they would persist
 *   on redis
 */

/**
 * Module Dependencies
 */

var LRU = require('lru-cache');

/**
 * LRU caching options
 *
 * max     - The maximum number of items. Not setting this is kind of silly, 
 *           since that's the whole purpose of this lib, but it defaults to Infinity.
 * maxAge  - Maximum age in ms. Items are not pro-actively pruned out 
 *           as they age, but if you try to get an item that is too old, 
 *           it'll drop it and return undefined instead of giving it to you.
 * length  - Function that is used to calculate the length of stored items.
 *           If you're storing strings or buffers, then you probably want 
 *           to do something like function(n){return n.length}. The default
 *           is function(n){return 1}, which is fine if you want to store n 
 *           like-sized things.
 * dispose - Function that is called on items when they are dropped from 
 *           the cache. This can be handy if you want to close file 
 *           descriptors or do other cleanup tasks when items are no 
 *           longer accessible. Called with key, value. It's called 
 *           before actually removing the item from the internal cache,
 *           so if you want to immediately put it back in, you'll have to
 *           do that in a nextTick or setTimeout callback or it won't do
 *           anything.
 */

var options = {
  max : Infinity,
  maxAge : 1000 * 60 * 60, // 1 hr
  length : function(n) { return 1; }
};

/**
 * Export an instance of the cache
 */

module.exports = LRU(options);
