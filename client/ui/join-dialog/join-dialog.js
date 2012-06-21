var Backbone = require('backbone'),
    _ = require('underscore'),
    dispatcher = require('/support/dispatcher.js'),
    Dialog = require('/ui/dialog/dialog.js');

/*
 * Add Style
 */
require('./join-dialog.styl');

/*
 * Export JoinDialog
 */
var JoinDialog = module.exports = Dialog.extend();

