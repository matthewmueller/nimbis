/**
 * Make sure we're normalizing
 */

require('normalize.css');

/**
 * Module dependencies
 */

var $ = require('jquery'),
    Join = require('./join/join.js');
    Create = require('./create/create.js');


var join = new Join();
$('.out').html(join.render().el);

var create = new Create();
$('.out').html(create.render().el);
