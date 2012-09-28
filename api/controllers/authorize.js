var User = require('../models/user'),
    utils = require('../support/utils'),
    client = require('../support/client'),
    makeId = utils.makeId;

// Default authorization
// watch "curl -d \"email=matt@matt.com&password=test\" localhost:8080/authorize"
exports = module.exports = function(req, res, next) {
  var body = req.body,
      email = body.email,
      password = body.password;

  if(!email || !password) return res.send(401);

  // Authorize our user
  User.authorize(email, password, function(err, userId) {
    if(err) return next(err);
    if(!userId) return res.send(401);

    // Store the token in a session
    req.session.userId = userId;

    // Respond with the token
    res.send({ token : req.session.id });
  });
};
