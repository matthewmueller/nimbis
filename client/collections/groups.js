var Backbone = require('backbone');

var Groups = module.exports = Backbone.Collection.extend();

/*
  Collection name
*/
Groups.prototype.name = 'Groups';

/*
  Add the `Group` Model
*/
Groups.prototype.model = require('../models/group.js');
