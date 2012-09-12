var User = require('../models/user'),
    utils = require('../support/utils'),
    session = require('../support/session'),
    makeId = utils.makeId;

// Default authorization
exports = module.exports = function(req, res, next) {
  var body = req.body,
      email = body.email,
      password = body.password;

  // Authorize our user
  User.authorize(email, password, function(err, userId) {
    if(err) return next(err);
    if(!userId) return res.send(401);

    // Generate an access token
    var token = makeId(20);

    // Store the token in a session
    session.set('token:' + token, userId);

    // Respond with the token
    res.send({ token : token });
  });
};
