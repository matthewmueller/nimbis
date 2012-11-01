var jquery = require('jquery'),
    app = require('app'),
    comments = app.comments,
    commentList = app.commentList,
    commentBox = app.commentBox;

exports.index = function(ctx, next) {
  var messageId = ctx.params.messageId;
  
  // Show the comments with the specified messageId
  commentList.filter(messageId);

  // Reset commentBox
  commentBox.off('share');
  commentBox.on('share', function(comment) {
    comment.set('messageId', messageId);
    comments.add(comment);
  });

  // Load comments
  superagent
    .get('http://api.nimbis.com:8080/messages/' + messageId + '/comments')
    .end(function(res) {
      if(!res.ok) throw new Error('Comment List: Unable to load data', res.text);
      comments.add(res.body);
    });
};
