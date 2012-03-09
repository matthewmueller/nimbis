/*
  socket.js - controller for socket communications
*/

/*
  message:add - triggers when a message is create
*/
var templates = {};

templates['message'] = {
  message : '',
  author : {
    id : null,
    firstName : '',
    lastName : '',
    icon : ''
  },
  groups : [],
  comments : []
};

exports['message:create'] = function(message) {
  console.log(message.groups);
  console.log(this);
  console.log(this.clients);
};

