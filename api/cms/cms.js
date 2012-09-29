$(function() {

  $('form').submit(function(e) {
    var $this = $(this),
        action = $this.attr('action'),
        method = $this.attr('method'),
        out = $this.find('.out'),
        query = $this.find('input:text, input:password').toJSON();

    superagent[method](action)
      .send(query)
      .end(function(res) {
        if(!res.ok) out.text(res.text);
        else out.html(syntaxHighlight(res.body));
      });

    return false;
  });

  $.fn.toJSON = function() {
    var out = {};
    $(this).each(function(el) {
      var $el = $(this),
          val = $el.val().split(',');

      out[$el.attr('name')] = (val.length === 1) ? val[0] : val;
    });
    
    return out;
  };

  function syntaxHighlight(json) {
      if (typeof json != 'string') {
           json = JSON.stringify(json, undefined, 2);
      }
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
              if (/:$/.test(match)) {
                  cls = 'key';
              } else {
                  cls = 'string';
              }
          } else if (/true|false/.test(match)) {
              cls = 'boolean';
          } else if (/null/.test(match)) {
              cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
      });
  }

});
