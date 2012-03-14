var thimble = require('thimble'),
    path = require('path'),
    join = path.join;

/**
 * Set the view root. All assets and views should live within this root
 */
thimble.set('root', join(__dirname, '../../client'));

/**
 * Set the thimble namespace on the frontend
 */
thimble.set('namespace', 'App');

/**
 * Thimble plugins for all environments
 */
thimble.configure(function(use) {
  use(thimble.flatten());
  use(thimble.embed({
    'json' : 'JSON'
  }));
});

// Export thimble
module.exports = thimble;