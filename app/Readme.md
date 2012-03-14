# Nimbis | Confetti | Jungle

## Ideas

### GroupList

### ShareMessage

### MessageList
- Groups collapse to color balls on screen size reduction
- Tool tip when you hover over the author's icon

### MessageHeader

### CommentList

- Display number to the right of name, where number is the level of connection
   via LinkedIn
  * No way, LinkedIn is sooo boring. This is a product for everyone, including all the scrubs who don't have a linkedIn. That includes me.
  () So the idea: often times you will be chatting with a lot of random people. What's a better way to see ppl you're talking to are actually close to you. Make new connections? Maybe not linkedIn. better we if define our own degree of closeness algorithm (took a class on it). Maybe as simple as a subtle highlight of someone in your friend or family. Instead of "1st" to the right of the name, it will have "Family". Some sort of identification in the massive pool of chatting.
- When scrolled up and new comment arrives, have a quarter opacity bottom strip
   displaying latest comment
  * I like the idea, How would it work though? What if 2 new comments arrive. What about 10?
  () Only shows the *latest comment*. Per your example, it will show the 2nd and 10th respectively, replacing the one prior.

### ShareComment
- emoticons: attracts girl attention
  * Definitely, it's a must have. We need to look for good emoticon libraries

- a dynamic row of templates: letter, document, etc
  * Maybe... Let's be more facebook than MySpace. Or Apple than Microsoft. A good message design should be able to cover talking about random shit with friends and writing a professional post. We shouldn't need people to pick their template.
  () Isn't the comment input box just a field where you type plain text horizontally? It would be painful for me to format my professional post. On a second thought, I don't think anyone would need to use a full blown mail letter template. Could probably scratch after some simple discussions. And how do the analogies relate? lol

- block color change on enter [NO]
  * Too complicated. Less options, better defaults. We should be making the decisions, not them.
  () I don't think you understand what I'm trying to say, but I thought about it and I do not think it will look nice. Scratch.

- Paint comment mode: turn the comment box into a canvas
  * Nice idea, maybe later..

- Figure out good verbs for: showing a picture, linking to something, starting or inviting someone to an event.
  () where are we storing the events?

- address parser to nice, readable format

- bookmark a comment section. on action event to go to bookmarked element, auto scroll to that element

## Data Schema

This is how the data will be formatted when it's sent down initially

    User Object
      id : String
      firstName : String
      lastName : String
      icon : String
      groups : [ String color, String name, String id ]

    Message Object
      id : String
      author : User Object
      message : String
      date : String
      groups : [ String groupID, String groupID, ... ]
      comments : [ String commentID, String commentID, ...]

> Note: Normally we would pass down the `group` information because we need it right away. The thing is we need to link it with the User.groups collection anyway in order to listen to updates. Therefore, on load we link the groupIDs passed down in the Message Objects with the groups passed down in the User Object

    Comment Object
      id : String
      author : User Object
      date : String

> Note: Comment Objects (and data) will not be loaded on page load, but instead loaded on demand, when a user clicks on the message

    Group Object
      id : String
      name : String
      description : String
      type : String public|private|forum|debate...

> Note: This isn't passed down initially, Group object represents 'more information'. Something like, when we edit, add a group. More data will probably go in here.










