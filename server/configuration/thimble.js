var path = require('path'),
    join = path.join,
    app = require('../app'),
    thimble = app.thimble;

/**
 * Set the view root. All assets and views should live within this root
 */
console.log(join(__dirname, 'client'));
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

// Start thimble
thimble.start(app.server);