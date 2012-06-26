!(function(context) {
  var trie = function(words) {
    words = words || [];

    var data = {};

    trie.traverse = function(word, on_match) {
      var T = data,
          w = word,
          i = 0,
          j = 0,
          len = w.length,
          m, 
          k;
      do {
          j++;
          k = w.substr(i, j);
          m = T[k];
          if (m !== undefined) {
              if (on_match) {
                  on_match(k, m, i, j, T);
              }
              i += j; 
              j = 0;
              T = m;
          }
      } while (len-- !== 1);
      return m;
    };

    trie.add = function(word) {
      var T = data;
      var w = word;
      var subT = T;
      var matched = '';
      var ret = this.traverse(w, function(k, m, i, j) {
          matched += k;
          subT = subT[k];
      });

      if (ret === undefined) {
          var u = w.replace(matched, '');

          var i, is_substr;
          for (var k in subT) {
              i = 0;
              is_substr = k[i] === u[i];
              if (is_substr) {
                  do {
                      if (k[i] !== u[i]) {
                          break;
                      }
                      i++;
                  } while (i < u.length && i < k.length);

                  // existing = "josh"
                  // new      = "john"
                  var topk = k.substr(0, i), // topk = "jo"
                      exsk = k.substr(i),    // exsk = "sh"
                      newk = u.substr(i);    // newk = "hn"

                  subT[topk] = {};
                  subT[topk][exsk] = subT[k];
                  if (newk !== '') {
                      subT[topk][newk] = {};
                  }
                  delete subT[k];
                  break;
              }
          }
          if (is_substr !== true) {
              subT[u] = {};
          }
      }
      return T;
    };

    trie.remove = function(word) {
      var q = [];
      traverse(w, T, function(k, m, i, j, p) {
          q.push(function(k, p) {
              return function() {
                  if (keys(p[k]).length === 0) {
                      delete p[k];
                      return true;
                  } else {
                      return false;
                  }
              };
          }(k, p));
      });
      var f;
      while (f = q.pop()) {
          if (!f()) break;
      }
    };

    trie.find = function(query) {
      var matched;
      var upto = '';
      
      if(!query) {
        return false;
      }
      
      trie.traverse(query, function(character, match) {
        upto += character;
        matched = match; 
      });

      var remaining = query.substr(upto.length, query.length);

      var entered = false;
      
      if (!upto) {
        for(var word in trie.data) {
          wordSlice = word.substr(0, query.length);
          if(remaining === wordSlice) {
            return word;
          }
        }
      }
      
      for(var match in matched) {
        entered = true;
        
        var matchSlice = match.substr(0, remaining.length);
        if (remaining === matchSlice) {
          if(size(match) === 1) {
            return false;
          } else {
            return upto + match;
          }
        }
      }

      if(!entered && !remaining) {
        return query;
      } else {
        return false;
      }
    };

    // Initialize
    for(var i = 0, len = words.length; i < len; i++) {
      trie.data = trie.add(words[i]);
    }

    trie.data = data;

    return trie;
  };

  function size(obj) {
    var s = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) s++;
    }
    return s;
  }

  function isString(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  }
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = trie;
  } else {
    context.trie = trie;
  }
  
})(this);