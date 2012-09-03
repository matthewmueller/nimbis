var user = require('../data/users.json'),
    messages = require('../data/messages.json');

exports.index = function(req, res) {
  var i = (req.query.user) ? req.query.user : 0;
  res.render('index/index', {
    user : JSON.stringify(user[i]),
    messages : JSON.stringify(messages)
  });
};
