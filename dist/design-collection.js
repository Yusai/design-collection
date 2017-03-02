(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function MyAnime(target, param, time) {
    //
    var el = target.el || target;
    //
    var startTime = Date.now();
    //
    param.forEach(function(e) {
        el.style[e.style] = '' + e.start + e.unit;
    });
    el.style.display = '';
    //
    var promise = new Promise(function(resolve) {
        //
        function step() {
            var progress = Date.now() - startTime;
            if (progress < time) {
                //
                param.forEach(function(e) {
                    el.style[e.style] = '' + (e.start + (e.end - e.start) * (progress / time)) + e.unit;
                });
                //
                requestAnimationFrame(step);
            } else {
                param.forEach(function(e) {
                    el.style[e.style] = '' + e.end + e.unit;
                })
                resolve();
            }
        }
        //
        requestAnimationFrame(step);
    });
    return promise;
}

function Fade(target, time, sw) {
    var el = target.el || target;
    //
    if (sw) {
        el.style.opacity = 0;
        el.style.display = '';
        var param = [{style: 'opacity', start: 0, end: 1, unit: ''}];
    } else {
        var param = [{style: 'opacity', start: 1, end: 0, unit: ''}];
    }
    var anime = new MyAnime(el, param, time);
    anime.then(function() {
        el.style.opacity = '';
        !sw && (el.style.display = 'none');
    });
    return anime;
}

var fade = {
    in: function(el, time) {
        return new Fade(el, time , true);
    },
    out: function(el, time) {
        return new Fade(el, time, false);
    }
};

//
function Collection(json) {
    var _this = this;
    this.data = json;
    this.setRows();
    this.waypoint = new Waypoint();
    this.loaded = false;
    this.infinit = false; //for debug
    //
    window.addEventListener('orientationchange', function() {
        _this.orient();
    });
    //
    this.start();
    //
    return this;
}

Collection.prototype.start = function() {
    console.log('global start');
    var _this = this;
    fade.in($$('#main'), 250).then(function() {
        _this.restart();
    });
};

Collection.prototype.restart = function() {
    this.index = 0;
    this.fillMode = false;
    this.addStop = false;
    this.waypoint.on();
    //
    scrollEvent.on(this);
    //
    $$('#rows-container').removeClass('stretch');
    this.addItem();
};

Collection.prototype.orient = function() {
    $$('#rows-container').html();
    this.setRows();
    scrollEvent.off();
    this.restart();
};

Collection.prototype.setRows = function() {
    var rows = Math.floor(window.innerWidth / 160) || 1;
    if (window.innerHeight > window.innerWidth) {
        var max = Math.floor(this.data.length / 4);
    } else {
        var max = Math.floor(this.data.length / 3);
    }
    rows > max && (rows = max);
    //
    for (var i = 0; i < rows; i++) {
        $$('#rows-container').append($$('$$ul').addClass('item-container'));
    }
};
//
Collection.prototype.check = function() {
     return (this.index < this.data.length);
};
//
Collection.prototype.addItem = function() {
    var _this = this;
    if (!this.fillMode && this.addStop && this.loaded) {
        this.waypoint.off();
        return false;
    }
    // https://github.com/oneuijs/You-Dont-Need-jQuery#promises
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    if ((_this.waypoint.top() - scrollTop + 12) < window.innerHeight) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            .then(function() {
                _this.waypoint.move();
                //画面下まで到達または閉じるボタンが押された場合読み込み中断
                if (!_this.addItem()) {
                    scrollEvent.on(_this);
                    console.log('addItem stop');
                    _this.addStop = true;
                }
            }, function() {
            // //次のアイテムがない場合はrejectが返ってきて終了
                console.log('item loaded');
                _this.waypoint.off();
            });
        return true;
    } else {
        return false;
    }
};
//
Collection.prototype.loadItem = function() {
    var index = this.index;
    var tmp = this.getJSON();
    //check item loaded
    if (!tmp) {
        console.log('check')
        var promise = new Promise(function(resolve, reject) {
            setTimeout(function() {
                reject();
            }, 1);
        });
        return promise;
    }
    //
    var _this = this;
    var promise = new Promise(function(resolve, reject) {
        //
        function appendSVG() {
            if (tmp.data == 'image not found') {
                console.log('no image...');
                _this.check() ? resolve() : reject();
                // target.html('<span class="bold9 small">Not Found.</span>');
                return;
            }
            //
            var target = $$('$$dd').addClass('item-image');
            //
            var dl = $$('$$dl')
                .addClass('small')
                .setAttr({title: tmp.title, source_url: tmp.link});
            //
            var li = $$('$$li').addClass('item').hide();
            //
            _this.waypoint.before(li.append(dl.append(target)));
            //
            target.html(tmp.data);
            target.on('click', function(e) {
                createZoom(tmp, e);
            });
            //
            _this.showItem(li).then(function() {
                resolve();
            }, function() {
                reject();
            });
        }
        //
        if (tmp.data) {
            appendSVG();
        } else {
            var request = new XMLHttpRequest();
            request.open('get', 'svg/' + tmp.url + '.svg', true);
            request.onload = function(event) {
                if (request.status >= 200 && request.status < 400) {
                    //success
                    tmp.data = request.responseText;
                    console.log('SVG Loaded : %d', index);
                } else {
                    //false
                    console.log('File Not Found : %d', index);
                    tmp.data = 'image not found';
                }
                appendSVG();
            };
            request.send(null);
        }
    });
    return promise;
};
//
Collection.prototype.showItem = function(li) {
    var _this = this;
    var duration = 1;
    var promise = new Promise(function(resolve, reject) {
        fade.in(li, duration).then(function() {
            _this.check() ? resolve() : reject();
        });
    });
    return promise;
};
//
Collection.prototype.getJSON = function() {
    if (this.check()) {
        var tmp = this.data[this.index];
        this.index ++;
        //
        if (this.index == this.data.length && !this.loaded) {
            console.log('svg files loaded');
            this.loaded = true;
        }
        this.loaded && !this.infinit && this.addStop && (this.fillMode = false);
        //fill mode
        this.fillMode && this.index >= this.data.length && (this.index = 0);
    } else {
        var tmp = false;
    }
    return tmp;
};

//
function Waypoint() {
    var waypoint = $$('#waypoint');
    waypoint.on = function() {
        this.show();
    };
    waypoint.off = function() {
        scrollEvent.off();
        $$('#rows-container').addClass('stretch');
        this.hide();
    };
    waypoint.calc = function() {
        var heightList = [];
        var children = $$('#rows-container').children();
        for (var i = 0; i < children.length(); i++) {
            heightList.push(children.el[i].clientHeight);
        }
        return heightList.indexOf(Math.min.apply(null, heightList));
    };
    waypoint.move = function() {
        $$('#rows-container').children(this.calc()).append(this);
    };
    waypoint.top = function() {
        return getOffset(this.el).top;
    };
    waypoint.move();
    return waypoint;
}
//
var scrollEvent = {
    on: function(e) {
        this.func = function() {
            e.addItem();
        };
        window.addEventListener('scroll', this.func, false);
    },
    off: function() {
        window.removeEventListener('scroll', this.func, false);
    }
};
//
var zoomEvent = {
    anime: function(e) {
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;
        //
        var param = [
            {style: 'top', start: y, end: 0, unit: 'px'}, {style: 'left', start: x, end: 0, unit: 'px'},
            {style: 'width', start: 0, end: 100, unit: '%'}, {style: 'height', start: 0, end: 100, unit: '%'}
        ];
        new MyAnime($$('#zoom-container'), param, 100);
    }
};
//
function createZoom(data, event) {
    //
    $$('#zoom-container .item-image').html(data.data);
    //
    $$('#link').html()
        .append($$('$$span').html('LINK'))
        .append($$('$$a')
            .setAttr({href: '//goo.gl/' + data.link, target: '_blank'})
            .html(data.title)
        );
    //
    $$('#download a').setAttr({href: 'svg/' + data.url + '.svg', download: data.url + '.svg'});
    //
    var own = $$('#own');
    data.own && own.addClass('own') || own.removeClass('own');
    //
    zoomEvent.anime(event);
}

//
function start() {
    var menu = $$('#menu');
    var promise = new Promise(function(resolve) {
        //
        $$('#menu .button').on('click', function() {
            var h1 = $$('h1');
            fade.out(h1.el[0], 250);
            fade.out(menu, 250).then(function() {
                menu.remove();
                h1.addClass('small');
                fade.in(h1.el[0], 250);
                resolve();
            });
        });
    });
    var loading = $$('#loading');
    fade.out(loading, 250).then(function() {
        loading.remove();
        fade.in(menu, 250);
        //
        $$('#zoom-container .item-image').on('click', function() {
            fade.out($$('#zoom-container'), 100);
        });
    });
    //
    return promise;
}
//
(function() {
    var request = new XMLHttpRequest();
    request.open('get', 'json/data.json', true);
    request.onload = function(event) {
        if (request.status >= 200 && request.status < 400) {
            //success
            var json = JSON.parse(request.responseText);
            start().then(function() {
                console.log(new Collection(json));
            });
        }
    }
    request.send(null);
})();
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
