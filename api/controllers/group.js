var Group = require('../models/group');

// GET /groups
// curl localhost:8080/groups
// TODO: Should get all the information about the groups I'm in
exports.index = function(req, res) {
  var user = req.user,
      groups = user.get('groups');

  res.send(groups);
};

// POST /groups
// watch "curl -d \"name=Family&type=private&description=Family%20Time\" localhost:8080/groups?token=..."
exports.create = function(req, res) {
  var body = req.body,
      user = req.user;

  body.creator = user;

  Group.create(body, function(err, model) {
    if(err) return res.send(err);

    user.join(model, function(err, doc) {
      if(err) return res.send(err);
      return res.send(model);
    });
  });
};

// GET /groups/:id
// curl localhost:8080/groups/506575e4ab9669e0fd000001
exports.show = function(req, res) {
  var params = req.params;
  
  Group.find(params.id, function(err, model) {
    if(err) return res.send(err);
    return res.send(model);
  });
};
