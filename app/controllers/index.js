/*
  Index controller
*/

exports.index = function(req, res) {
  res.render('index/index.mu', {planet : "mars"});
};