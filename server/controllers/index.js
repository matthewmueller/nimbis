/**
 * index.js - This is our application controller
 */

/*
  Index controller
*/

exports.index = function(req, res) {
  res.render('index/index.mu', {
    layout : 'index/layout.mu',
    title : "Nimbis | VIP Access",
    user  : JSON.stringify(req.user)
  });
};