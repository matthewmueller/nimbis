exports.index = function(req, res) {
  var user = req.user,
      messages = req.messages;
      
  if(!user) return res.redirect('/login');

  res.render('index/index', {
    user : JSON.stringify(user),
    messages : JSON.stringify(messages)
  });
};
