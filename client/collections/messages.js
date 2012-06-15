var Backbone = require('backbone');

/*
  Export the messages collection
*/
var Messages = module.exports = Backbone.Collection.extend();

/*
  Collection name
*/
Messages.prototype.name = 'Messages';

/*
  Add the `Message` Model
*/
Messages.prototype.model = require('../models/message.js');