# list

Generic list component, based on the [menu component](https://github.com/component/menu).

Useful for creating inboxes, contact lists, etc. 

![list example](http://f.cl.ly/items/0R073N0e1f0b0a390z3Y/Screen%20Shot%202012-10-21%20at%201.51.31%20PM.png)

![inbox example](http://f.cl.ly/items/0G091L250Q2c0n002b0b/Screen%20Shot%202012-10-21%20at%204.40.04%20PM.png)
  
## Installation

    $ component install matthewmueller/list

## Features

* Custom templating support, defaulting to [minstache](https://github.com/visionmedia/minstache).
* Events for composition
* Structural CSS
* Fluent API

## Events

* `add` (item) when an item is added
* `remove` (item) when an item is removed
* `select` (item) when an item is selected

## Example

### Message Template:

```html
<script type="text/template" id="message">
  <a href='#'>
    <span class='from'>{from}</span>
    <span class='subject'><strong>{subject}</strong></span>
    <span class='message'><small>{message}</small></span>
  </a>
</script>
```

### Usage:

```js
var List = require('list'),
    inbox = new List;

inbox.template(document.getElementById('message').text)

var messages = [
  { from : 'jim', subject : 'hey', message : 'blah'},
  { from : 'matt', subject : 'sup', message : 'cool'},
  { from : 'drew', subject : 'howdy', message : 'yah'},
]

inbox.add(messages, function(message) {
  console.log('invoked fn', message);
})

inbox.el.appendTo('body');

inbox.on('add', function(message) {
  console.log('message added:', message);
});

inbox.on('remove', function(message) {
  console.log('message removed:', message);
})

inbox.on('select', function(message) {
  console.log('message selected:', message);
});

inbox.add({
  from : 'zak',
  subject : 'no way',
  message : 'crazy'
});

inbox.remove(3);
```

## API 

### List()

Create a new `List`:

```js
var List = require('list');
var list = new List(); // or...
var list = List();
```

### List#template(str)

Add a template string to be used when adding items. The default templating engine is [minstache](https://github.com/visionmedia/minstache).

```js
list.template('<li><a href={url}>{text}</a></li>')
```

You can use another templating engine by overwriting the engine attribute. If you'd like to use hogan.js, check out [matthewmueller/hogan](https://github.com/MatthewMueller/hogan)

```js
list.engine = require('hogan');
```

### List#add(arr | obj, [fn])

Add new list item(s). Pass each `obj` into the templating function. When `selected` the optional callback `fn` will be invoked.

```js
list.add({ name : 'apple' }, function(item) {
  console.log('You selected:', item.name);
})
```

You can also use arrays:

```js
list.add([{ name : 'apple' }, { name : 'pear' }]);
```

You can also use text and the default template:

```js
list.add('apple'); // <li><a href="#">apple</a></li>
```

### List#remove(i)

Remove an item by it's place in the list

```js
list.remove(0);
```

### List.has(i)

Checks to see if an item exists.

```js
list.has(1);
```

## License

  MIT
