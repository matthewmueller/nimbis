/*
  Index controller
*/

exports.index = function(req, res) {
  res.render('app/blah.mu', {
    layout : 'app/layout.mu',
    title : "Nimbis | Ke$ha"
  });
};