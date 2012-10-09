var db = require('../support/monk')('localhost/mydb'),
    users = db.get('users'),
    User = require('../models/user'),
    Group = require('../models/group'),
    _ = require('underscore');

// GET /users?token=...
// Will get the current user
exports.index = function(req, res, next) {
  var token = req.token,
      userId = req.session.userId;

  if(!userId) return next();

  User.find(userId, function(err, user) {
    if(err) return next(err);
    if(!user) return next();
    res.send(user);
  });
};

// POST /users
// watch "curl -d \"name=matt&email=matt@matt.com&password=test\" localhost:8080/users"
exports.create = function(req, res, next) {
  var body = req.body;
  console.log(body);
  User.create(body, function(err, model) {
    if(err) return next(err);
    console.log(model);
    res.send(201, model);
  });
};

// GET /users/:id
// curl -HAccept:text/json localhost:8080/users/matt
exports.show = function(req, res) {
  var params = req.params;

  var user = new User({ id : params.id });

  user.fetch(function(err, model) {
    if(err) throw err;

    res.send(model);
  });
};

// POST /join
// watch "curl -d \"id=5065853844a1150000000004\" localhost:8080/join?token=hJJvjqkqcn50zVL4dBZ2S4XL"
exports.join = function(req, res) {
  var body = req.body,
      user = req.user,
      groups = user.get('groups');

  if(!body.id) return res.send(200);
  var id = _(groups).find(function(group) {
    return (String(group.id) === String(body.id));
  });

  // If already exists, just return
  if(id) return res.send(200);

  // Find the group and add the group to the user
  Group.find(body.id, function(err, group) {
    if(err) return res.send(500, { error : err });
    else if(!group) return res.send(500, { error : 'Cannot find group' });

    user.join(group, function(err) {
      if(err) return res.send(500, { error : err });
      res.send(200, group);
    });
  });
};
