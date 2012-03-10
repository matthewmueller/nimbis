/*
  Index controller
*/

exports.index = function(req, res) {
  console.log(req.user);
  res.render('app/app.mu', {
    layout : 'app/layout.mu',
    title : "Nimbis | VIP Access",
    user  : JSON.stringify(req.user)
  });
};