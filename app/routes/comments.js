/**
 * TODO... is this how all controllers should look?
 *
 * Probably not... we should be using comment.save() and comments.fetch()
 * but we cannot make url's dynamic in backbone... i don't think?
 */

var jquery = require('jquery'),
    app = require('app'),
    comments = app.comments,
    commentList = app.commentList,
    commentBox = app.commentBox;

exports.index = function(ctx, next) {
  var messageId = ctx.params.messageId;
  
  // Set up the views to respond to the right comments
  commentList.filter(messageId);
  commentBox.active(messageId);

  // Load comments
  superagent
    .get('http://api.nimbis.com:8080/messages/' + messageId + '/comments')
    .end(function(res) {
      if(!res.ok) throw new Error('Comment List: Unable to load data', res.text);
      comments.add(res.body);
    });
};
