//
var append = function(target, html) {
    target.insertAdjacentHTML('beforeend', html);
};

// https://github.com/oneuijs/You-Dont-Need-jQuery#promises
// Native
function getOffset (el) {
  const box = el.getBoundingClientRect();
  return {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  };
}
// Deferred way
function deferred() {
  var deferred = {};
  var promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  deferred.promise = function() {
    return promise;
  };
  return deferred;
}
//
// function scrollTop() {
//     return (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
// }