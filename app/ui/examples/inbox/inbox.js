var List = require('list'),
    inbox = new List;

/**
 * Default message
 */

var message1 = {
  author : {
    name : 'Matt',
    icon : 'https://secure.gravatar.com/avatar/824b41e6108a22c4c96f50ee23419369?s=140&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png'
  },
  message : 'Hi there!',
  groups : [
    {
      name : 'javascript',
      color : 'red'
    },
    {
      name : 'Soccer',
      color : 'blue'
    }
  ]
};

var message2 = {
  author : {
    name : 'Matt',
    icon : 'https://secure.gravatar.com/avatar/824b41e6108a22c4c96f50ee23419369?s=140&d=https://a248.e.akamai.net/assets.github.com%2Fimages%2Fgravatars%2Fgravatar-user-420.png'
  },
  message : 'Howdy!',
  groups : [
    {
      name : 'football',
      color : 'brown'
    },
    {
      name : 'Soccer',
      color : 'blue'
    }
  ]
};

inbox.el.addClass('inbox');

inbox.engine = require('matthewmueller-hogan');
inbox.template(document.getElementById('message-template').text);
inbox.add(message1);
inbox.add(message2);
inbox.el.appendTo('body');
