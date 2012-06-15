// Load jQuery
var $ = window.$ = require('jquery-browserify');

var User = require('../../models/user.js');
console.log(window.user);
var user = new User(window.user);
console.log(user.toJSON());
