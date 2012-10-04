var superagent = require('superagent');

exports['message:create'] = function(message, cookie, fn) {

  // Save the message
  superagent
    .post('api.nimbis.com:8080/messages')
    .set('cookie', cookie)
    .send(message)
    .end(function(res) {
      if(!res.ok) return fn(res.text);
    });

  // Broadcast to the other people
  // ...
  
};
