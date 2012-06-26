var $ = require('jquery');

var selectPrevious = exports.selectPrevious = function() {
  var $list = this.$el,
      $itemInput = this.$itemInput,
      $input = this.$input;

  $item = $list.find('.selected');
  if($item.length) {
    $prev = $item.prev('li');
    if($prev.length) {
      $item.removeClass('selected');
      $prev.addClass('selected');
    } else {
      $input.show();
    }
  } else {
    $prev = $itemInput.prev('li');
    if($prev.length) {
      $prev.addClass('selected');
      $input.hide();
    }
  }

  return this;
};

var selectNext = exports.selectNext = function() {
  var $list = this.$list,
      $input = this.$input,
      $item = $list.find('.selected');

  if(!$item.length) return;

  $next = $item.next('li');
  if($next) {
    if($next.hasClass('token-item-input')) {
      $item.removeClass("selected");
      $input.show();
    } else {
      $item.removeClass('selected');
      $next.addClass('selected');
    }
  }

  return this;
};

var remove = exports.remove = function() {
  var toRemove = this.$list.find('.selected');
  selectPrevious();
  toRemove.remove();

  return this;
};

var complete = exports.complete = function() {
  var value = this.$background.val(),
      $input = this.$input,
      $inputItem = this.$inputItem;

  var model = this.collection.find(function(model) {
    return (model.get('name') === value);
  });

  var token = this.tokenTemplate(model.toJSON());

  return this;
};