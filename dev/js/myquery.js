// https://github.com/oneuijs/You-Dont-Need-jQuery#promises
// Native
function getOffset (el) {
  const box = el.getBoundingClientRect();
  return {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  };
}
