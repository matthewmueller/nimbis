var request = require('superagent');
    user = require('../data/users.json'),
    messages = require('../data/messages.json');

exports.index = function(req, res) {
  var token = req.cookies.token;
  if(!token) return res.redirect('/login');

  request
    .get('api.localhost:8080/users')
    .set('Cookie', 'token=' + token)
    .end(function(r) {
      if(!r.ok) return res.send(404);
      res.render('index/index', {
        user : JSON.stringify(r.body),
        messages : JSON.stringify(messages)
      });
    });

  
};
