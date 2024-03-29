/**
 * Module dependencies
 */

var $ = require('jquery'),
    Join = require('./join/join.js');
    Create = require('./create/create.js'),
    Groups = require('/collections/groups.js'),
    app = require('app');

app.collection.groups = new Groups();

var join = new Join();
$('.out').html(join.render().el);

var create = new Create();
$('.out').html(create.render().el);
