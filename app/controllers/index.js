/*
  Index controller
*/

exports.index = function(req, res) {
  res.render('index/index.mu', {
    layout : 'layout.html',
    planet : "mars"
  });
};