$(function() {

  $('form').submit(function(e) {
    var $this = $(this),
        action = $this.attr('action'),
        method = $this.attr('method'),
        out = $this.find('.out'),
        query = $this.find('input:text, input:password, textarea').toJSON();

    // Replace param :key with value
    Object.keys(query).forEach(function(key) {
      action = action.replace(':'+key, query[key]);
    });

    var request = superagent[method](action);
    request = (method === 'post') ? request.send(query) : request;
    request.end(function(res) {
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

  function pathtoRegexp(path, keys, options) {
    options = options || {};
    var sensitive = options.sensitive;
    var strict = options.strict;
    keys = keys || [];

    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';

    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/\+/g, '__plus__')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return ''
          + (optional ? '' : slash)
          + '(?:'
          + (optional ? slash : '')
          + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
          + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/__plus__/g, '(.+)')
      .replace(/\*/g, '(.*)');

    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  }


  /**
   * Use Local Storage to store values
   */
  
  $('form').submit(function() {
    var $this = $(this),
        action = $this.attr('action');

    $this.find('input:text, input:password, textarea').each(function() {
      var $this = $(this),
          name = $this.attr('name'),
          key = action + '|' + name;

      localStorage.setItem(key, $this.val());
    });
  });

  $('form').each(function() {
    var $this = $(this),
        action = $this.attr('action');

    $this.find('input:text, input:password, textarea').each(function() {
      var $this = $(this),
          name = $this.attr('name'),
          key = action + '|' + name,
          item = localStorage.getItem(key);
      
      if(item) $this.val(item);
    });
  });

});
