function F(selector) {
  this.selector = selector;
  // this.el = $$(selector);
  this.el = (function(selector) {
    if (selector.split('$$').length == 2) {
      return document.createElement(selector.split('$$')[1]);
    }
    //selector
    var selector = selector.split(' ');
    //
    function get(parent) {
      if (selector.length == 0){
        return parent;
      }
      var tmp = selector.shift();
      if (tmp.split('#').length == 2) {
        //
        return get(parent.getElementById(tmp.split('#')[1]));
      } else if (tmp.split('.').length == 2) {
        //
        return parent.getElementsByClassName(tmp.split('.')[1]);
      } else {
        //
        return parent.getElementsByTagName(tmp);
      }
    }
    //
    return get(document);
  })(selector);
}
//
F.prototype.addClass = function(_class) {
  if (this.el.length > 0) {
    for (var i = 0; i < this.el.length; i++) {
      this.el[i].classList.add(_class);
    }
  } else {
    this.el.classList.add(_class);
  }
  return this;
};
F.prototype.removeClass = function(_class) {
  this.el.classList.remove(_class);
  return this;
}
//
F.prototype.setAttr = function(attr) {
  function set(el, attr) {
    for (var key in attr) {
      var value = attr[key];
      el.setAttribute(key, value);
    }
  }
  if (this.el.length > 0) {
    for (var i = 0; i < this.el.length; i++) {
      set(this.el[i], attr);
    }
  } else {
    set(this.el, attr);
  }
  return this;
};
//
F.prototype.children = function(index) {
  this.el = isFinite(index) && this.el.childNodes[index] || this.el.childNodes;
  return this;
};
//
F.prototype.html = function(html) {
  function set(target, html) {
    target.innerHTML = html || '';
  }
  if (this.el.length > 0) {
    for (var i = 0; i < this.el.length; i++) {
      set(this.el[i], html);
    }
  } else {
    set(this.el, html);
  }
  return this;
};
//
F.prototype.remove = function() {
  this.el.parentNode.removeChild(this.el);
};
//
F.prototype.hide = function() {
  this.el.style.display = 'none';
  return this;
};
//
F.prototype.show = function() {
  this.el.style.display = '';
  return this;
};
//
F.prototype.append = function(el) {
  this.el.appendChild(el.el || el);
  return this;
};
//
F.prototype.length = function() {
  return this.el.length;
};
//
F.prototype.on = function(event, func) {
  function set(el, event, func) {
    el.addEventListener(event, func);
  }
  //
  if (this.el.length > 0) {
    for (var i = 0; i < this.el.length; i++) {
      set(this.el[i], event, func);
    }
  } else {
    set(this.el, event, func);
  }
  return this;
};
//
F.prototype.before = function(el) {
  this.el.parentNode.insertBefore(el.el || el, this.el);
  return this;
};
//
//
//
(function() {
  window.$$ = function(selector) {
    return new F(selector);
  }
})();
// https://github.com/oneuijs/You-Dont-Need-jQuery#promises
// Native
function getOffset (el) {
  const box = el.getBoundingClientRect();
  return {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  };
}
