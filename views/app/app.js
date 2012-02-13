/*
  Nimbis application variable
*/

(function() {
  var exports = this;
  
  if(exports.n) {
    return this;
  }
  
  // Set up the application
  // ----------------------
  n = {
    collections : {},
    models : {},
    views : {},
    app : {}
  };
  
  // Export the n variable
  exports.n = n;

  return this;
// Call with current global context (window)
}).call(this);