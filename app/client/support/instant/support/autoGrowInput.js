// jQuery autoGrowInput plugin by James Padolsey
// See related thread: http://stackoverflow.com/questions/931207/is-there-a-jquery-autogrow-plugin-for-text-fields
(function(window) {
  var $ = window.jQuery || require('jquery');

  var autoGrowInput = function(o) {
      
      o = $.extend({
          maxWidth: 1000,
          minWidth: 0,
          comfortZone: 70
      }, o);

      this.filter('input:text, textarea').each(function(){
          var minWidth = o.minWidth || $(this).width(),
              val = '',
              input = $(this),
              testSubject = $('<div>').css({
                  position: 'absolute',
                  top: -9999,
                  left: -9999,
                  width: 'auto',
                  textIndent: 0,
                  fontSize: input.css('fontSize'),
                  fontFamily: input.css('fontFamily'),
                  fontWeight: input.css('fontWeight'),
                  letterSpacing: input.css('letterSpacing'),
                  whiteSpace: 'nowrap'
              }),
              check = function() {
                  
                  if (val === (val = input.val())) {return;}
                  
                  // Enter new content into testSubject
                  var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,'&nbsp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                  testSubject.html(escaped);
                  
                  // Calculate new width + whether to change
                  var testerWidth = testSubject.width(),
                      newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                      currentWidth = input.width(),
                      isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                           || (newWidth > minWidth && newWidth < o.maxWidth);
                  
                  // Animate width
                  if (isValidWidthChange) {
                      input.width(newWidth);
                  }
                  
              };

          testSubject.insertAfter(input);
          
          $(this).bind('keyup keydown blur update background.change', check);
          
      });
      
      return this;
  
  };

  if(module && module.exports) {
    module.exports = autoGrowInput;
  }

  $.fn.autoGrowInput = autoGrowInput;
    
})(this);