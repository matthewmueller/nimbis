var User = require('../models/user'),
    utils = require('../support/utils'),
    makeId = utils.makeId;

// Default authorization
exports = module.exports = function(req, res, next) {
  var body = req.body,
      email = body.email,
      password = body.password;

  // Authorize our user
  User.authorize(email, password, function(err, authenticated) {
    if(err) return next(err);
    if(!authenticated) return res.send(401);

    // Generate an access token
    var token = makeId(20);

    // Save the token in the session
    req.session.token = token;

    // Respond with the token
    res.send({ token : token });
  });
};
