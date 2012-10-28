var app = require('app'),
    commentList = app.commentList;

exports.index = function(ctx, next) {
  var messageId = ctx.params.messageId;
  commentList.load(messageId);
};
