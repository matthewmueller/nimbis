var request = require('superagent');
    user = require('../data/users.json'),
    messages = require('../data/messages.json');

exports.index = function(req, res) {
  console.log(req.cookies.user);
  request
    .get('api.localhost:8080/users/' + req.cookies.user)
    .end(function(r) {
      if(!r.ok) return res.send(404);
      console.log(r.body);

      res.render('index/index', {
        user : JSON.stringify(r.body),
        messages : JSON.stringify(messages)
      });
    });

  
};
