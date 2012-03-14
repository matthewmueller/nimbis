/**
 * Auth.js - Authentication for our application
 */
exports.authenticate = function(req, res, next) {
  var query = req.query;

  // Temporary user database
  var users = JSON.parse(require('fs').readFileSync('./client/development/data/users.json', 'utf8'));

  // If we are in development, allow query to log us in
  if(query.user && env === 'development') {
    req.user = (users[query.user]) ? users[query.user] : users[0];
  } else {
    req.user = users[0];
    // console.log('TODO: Connect to database');
  }

  next();
};