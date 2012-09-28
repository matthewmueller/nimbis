module.exports = function(conn) {
  conn = conn || 'localhost/mydb';
  return exports.monk || (exports.monk = require('monk')(conn));
};
