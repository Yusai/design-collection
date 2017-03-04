
function $$(selector) {
  return new C(selector);
}

class C {
  selector: string;
  el: any;
  constructor (selector) {
    this.selector = selector;
    // this.el = $$(selector);
    this.el = ((selector) => {
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
  addClass (_class) {
    if (this.el.length > 0) {
      for (var i = 0; i < this.el.length; i++) {
        this.el[i].classList.add(_class);
      }
    } else {
      this.el.classList.add(_class);
    }
    return this;
  }
  //
  removeClass (_class) {
    this.el.classList.remove(_class);
    return this;
  }
  //
  setAttr (attr) {
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
  }
  //
  children (index?) {
    this.el = isFinite(index) && this.el.childNodes[index] || this.el.childNodes;
    return this;
  }
  //
  html (html?) {
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
  }
  //
  remove () {
    this.el.parentNode.removeChild(this.el);
    return this;
  }
  //
  hide () {
    this.el.style.display = 'none';
    return this;
  }
  //
  show () {
    this.el.style.display = '';
    return this;
  }
  //
  append (el) {
    this.el.appendChild(el.el || el);
    return this;
  }
  //
  length () {
    return this.el.length;
  }
  //
  on (event, func) {
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
  }
  //
  before (el) {
    this.el.parentNode.insertBefore(el.el || el, this.el);
    return this;
  }
  // https://github.com/oneuijs/You-Dont-Need-jQuery
  offset () {
    const box = this.el.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }
  //
  fade (time, sw) {
    function _fade(el, time, sw) {
      if (sw) {
        el.style.opacity = 0;
        el.style.display = '';
      }
      var param = [{
          style: 'opacity',
          start: sw ? 0 : 1,
          end: sw ? 1 : 0,
          unit: ''
        }];
      return anime(el, param, time).then(() => {
        el.style.opacity = '';
        !sw && (el.style.display = 'none');
      });
    }
    var p;
    if (this.el.length) {
      //all
      p = Promise.all(Array.prototype.slice.call(this.el).map((el) => {
        return _fade(el, time, sw);
      }));
    } else {
      //single
      p = _fade(this.el, time, sw);
    }
    return p;
  }
  //
  fadeIn (time) {
    return this.fade(time, true);
  }
  fadeOut (time) {
    return this.fade(time, false);
  }
  //
  eq (index: number) {
    this.el = this.el[index];
    return this;
  }
}
