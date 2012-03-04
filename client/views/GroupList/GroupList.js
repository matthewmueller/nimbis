/*
  Expose Group
*/
var GroupList = app.v.GroupList = app.v.List.extend();

/*
  `GroupList` classname
*/
GroupList.prototype.className = 'group-list';

/*
  Templates
*/
GroupList.prototype.itemTemplate = JST['group-list']

/*
  Initialize `GroupList`
*/
GroupList.prototype.initialize = function() {
  _.bindAll(this, 'bind');

  this.on('rendered', this.bind);
};

/*
  `GroupList` Bindings
*/
GroupList.prototype.bind = function() {
  // Bind Collection
  this.collection.on('add', this.render);
  this.collection.on('remove', this.render);

  this.off('rendered', this.bind);
};