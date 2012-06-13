/*
  Expose Group
*/
var GroupList = App.Views.GroupList = App.Views.List.extend();

/*
  `GroupList` classname
*/
GroupList.prototype.className = 'group-list';

/*
  Templates
*/
GroupList.prototype.itemTemplate = App.JST['group-list'];

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