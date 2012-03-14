/**
 * Model.js - All models will extend the base model
 * 
 * The point of this base model is to provide a low-level interface with the database,
 * allowing us to have a consistent save, delete, etc. from our models.
 * 
 * This layer will be interacting directly with Redis.
 */

var app = require('../../');
console.log(app);
/**
 * Constructor
 */
var Model = module.exports = function() {

};

Model.prototype.save = function(data) {

};