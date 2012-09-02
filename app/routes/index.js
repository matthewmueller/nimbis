var user = require('../data/users.json');

exports.index = function(req, res) {
  res.render('index/index', {
    user : JSON.stringify(user[0])
  });
};
