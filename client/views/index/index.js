
var User = require('../../models/user.js');
var user = new User({ firstName : "Matt", lastName: "Mueller" });
console.log(user.toJSON());
