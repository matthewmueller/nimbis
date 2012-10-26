var Comment = require('../models/comment'),
    comments = require('../support/monk')().get('comment');


// GET /messages/:messageId/comments
exports.index = function(req, res) {
  var params = req.params,
      messageId = params.messageId;

  // TODO: Refactor!
  comments.find({ messageId : messageId }, function(err, comments) {
    if(err) res.send(500, { error : err });
    res.send(comments);
  });
};


// POST /messages/:messageId/comments
exports.create = function(req, res) {
  var body = req.body,
      messageId = req.params.messageId,
      user = req.user.toJSON();

  // Add the author
  body.author = {
    id : user._id,
    name : user.name
  };

  // Add the message Id
  body.messageId = messageId;

  // Create a new comment
  var comment = new Comment(body);

  comment.save(function(err, model) {
    if(err) throw err;
    res.send(model);
  });
};

// GET /messages/comments/:id
exports.show = function(req, res) {
  var params = req.params,
      id = params.id;

  comments.findById(id, function(err, comment) {
    if(err) res.send(500, { error : err });
    res.send(comment);
  });
};
