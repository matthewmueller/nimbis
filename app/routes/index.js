var user = require('../data/users.json'),
    messages = require('../data/messages.json');

exports.index = function(req, res) {
  res.render('index/index', {
    user : JSON.stringify(user[0]),
    messages : JSON.stringify(messages)
  });
};
