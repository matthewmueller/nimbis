var messages = require('../data/messages.json');

exports.index = function(req, res) {
  var user = req.user;
  if(!user) return res.redirect('/login');

  res.render('index/index', {
    user : JSON.stringify(user),
    messages : JSON.stringify(messages)
  });
};
