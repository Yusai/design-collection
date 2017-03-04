//
function anime(target, param, time) {
    var param = param.length ? param : [param];
    //
    var el = target.el || target;
    //
    var startTime = Date.now();
    //
    param.forEach(function (e) {
        el.style[e.style] = '' + e.start + e.unit;
    });
    el.style.display = '';
    //
    return new Promise(function (resolve, reject) {
        function step() {
            var progress = Date.now() - startTime;
            if (progress < time) {
                param.forEach(function (e) { el.style[e.style] = '' + (e.start + (e.end - e.start) * (progress / time)) + e.unit; });
                //
                requestAnimationFrame(step);
            }
            else {
                param.forEach(function (e) { el.style[e.style] = '' + e.end + e.unit; });
                //
                resolve();
            }
        }
        requestAnimationFrame(step);
    });
}

/// <reference path="waypoint.ts" />
//
var Collection = (function () {
    //
    function Collection(json) {
        var _this = this;
        this.data = json;
        this.setRows();
        this.waypoint = new Waypoint('#waypoint');
        this.infinit = false; //for debug
        //
        window.addEventListener('orientationchange', function () { _this.orient(); });
        //
        this.start();
        //
        return this;
    }
    //
    Collection.prototype.start = function () {
        var _this = this;
        console.log('global start');
        // fade.in($$('#main'), 250).then(this.restart());
        $$('#main').fadeIn(250).then(function () { return _this.restart(); });
    };
    //
    Collection.prototype.restart = function () {
        this.index = 0;
        this.fillMode = false;
        this.addStop = false;
        this.loaded = false;
        this.waypoint._on();
        //
        scrollEvent.on(this);
        //
        $$('#rows-container').removeClass('stretch');
        this.addItem();
    };
    //
    Collection.prototype.orient = function () {
        $$('#rows-container').html();
        this.setRows();
        scrollEvent.off();
        this.restart();
    };
    //
    Collection.prototype.setRows = function () {
        var rows = Math.floor(window.innerWidth / 160) || 1;
        var max = window.innerHeight > window.innerWidth ? Math.floor(this.data.length / 4) : Math.floor(this.data.length / 3);
        rows > max && (rows = max);
        //
        var container = $$('#rows-container');
        var ul = $$('$$ul').addClass('item-container').el;
        for (var i = 0; i < rows; i++) {
            container.append(ul.cloneNode());
        }
    };
    //
    Collection.prototype.check = function () {
        return this.index < this.data.length;
    };
    //
    Collection.prototype.addItem = function () {
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
                .then(function () {
                _this.waypoint.move();
                //画面下まで到達または閉じるボタンが押された場合読み込み中断
                if (!_this.addItem()) {
                    scrollEvent.on(_this);
                    console.log('addItem stop');
                    _this.addStop = true;
                    //
                    if (_this.fillMode && _this.loaded) {
                        _this.waypoint.off();
                    }
                }
            }, function () {
                // //次のアイテムがない場合はrejectが返ってきて終了
                console.log('item loaded');
                _this.waypoint.off();
            });
            return true;
        }
        else {
            return false;
        }
    };
    //
    Collection.prototype.loadItem = function () {
        var _this = this;
        var index = this.index;
        var tmp = this.getJSON();
        //check item loaded
        if (!tmp) {
            console.log('check');
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject();
                }, 1);
            });
        }
        //
        return new Promise(function (resolve, reject) {
            //
            function appendSVG() {
                //
                var target = $$('$$dd').addClass('item-image');
                //
                if (tmp.data == 'image not found') {
                    console.log('no image...');
                    _this.check() ? resolve() : reject();
                    // target.html('<span class="bold9 small">Not Found.</span>');
                    return;
                }
                //
                var dl = $$('$$dl')
                    .addClass('small')
                    .setAttr({ title: tmp.title, source_url: tmp.link });
                //
                var li = $$('$$li').addClass('item').hide();
                //
                _this.waypoint.before(li.append(dl.append(target)));
                //
                target.html(tmp.data);
                target.on('click', function (e) { createZoom(tmp, e); });
                //
                _this.showItem(li).then(resolve, reject);
            }
            //
            if (tmp.data) {
                appendSVG();
            }
            else {
                var request = new XMLHttpRequest();
                request.open('get', "svg/" + tmp.url + ".svg", true);
                request.onload = function (event) {
                    if (request.status >= 200 && request.status < 400) {
                        //success
                        console.log("SVG Loaded : " + index);
                        tmp.data = request.responseText;
                    }
                    else {
                        //false
                        console.log("File Not Found : " + index);
                        tmp.data = 'image not found';
                    }
                    appendSVG();
                };
                request.send(null);
            }
        });
    };
    //
    Collection.prototype.showItem = function (li) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            li.fadeIn(5).then(function () {
                _this.check() ? resolve() : reject();
            });
        });
    };
    //
    Collection.prototype.getJSON = function () {
        var tmp;
        if (this.check()) {
            tmp = this.data[this.index];
            this.index++;
            //
            if (this.index == this.data.length && !this.loaded) {
                console.log('svg files loaded');
                this.loaded = true;
            }
            this.loaded && !this.infinit && this.addStop && (this.fillMode = false);
            //fill mode
            this.fillMode && this.index >= this.data.length && (this.index = 0);
        }
        else {
            tmp = false;
        }
        return tmp;
    };
    return Collection;
}());

//
var scrollEvent = {
    on: function (e) {
        this.func = function () { e.addItem(); };
        window.addEventListener('scroll', this.func, false);
    },
    off: function () {
        window.removeEventListener('scroll', this.func, false);
    }
};
//
var zoomEvent = {
    anime: function (e) {
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;
        //
        var param = [
            { style: 'top', start: y, end: 0, unit: 'px' }, { style: 'left', start: x, end: 0, unit: 'px' },
            { style: 'width', start: 0, end: 100, unit: '%' }, { style: 'height', start: 0, end: 100, unit: '%' }
        ];
        anime($$('#zoom-container'), param, 100);
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
        .setAttr({ href: "//goo.gl/" + data.link, target: '_blank' })
        .html(data.title));
    //
    $$('#download a').setAttr({ href: "svg/" + data.url + ".svg", download: data.url + ".svg" });
    //
    var own = $$('#own');
    data.own && own.addClass('own') || own.removeClass('own');
    //
    zoomEvent.anime(event);
}

/// <reference path="collection.ts" />
//
function start() {
    var menu = $$('#menu');
    //
    var loading = $$('#loading');
    loading.fadeOut(250).then(function () {
        loading.remove();
        menu.fadeIn(250);
        //
        $$('#zoom-container .item-image').on('click', function () {
            $$('#zoom-container').fadeOut(100);
        });
    });
    //
    return new Promise(function (resolve) {
        $$('#menu .button').on('click', function () {
            var h1 = $$('h1');
            h1.fadeOut(250);
            menu.fadeOut(250).then(function () {
                menu.remove();
                h1.addClass('small');
                h1.fadeIn(250);
                resolve();
            });
        });
    });
}
//
(function () {
    var request = new XMLHttpRequest();
    request.open('get', 'json/data.json', true);
    request.onload = function (event) {
        if (request.status >= 200 && request.status < 400) {
            //success
            var json = JSON.parse(request.responseText);
            start().then(function () {
                console.log(new Collection(json));
            });
        }
    };
    request.send(null);
})();

function $$(selector) {
    return new C(selector);
}
var C = (function () {
    function C(selector) {
        this.selector = selector;
        // this.el = $$(selector);
        this.el = (function (selector) {
            if (selector.split('$$').length == 2) {
                return document.createElement(selector.split('$$')[1]);
            }
            //selector
            var selector = selector.split(' ');
            //
            function get(parent) {
                if (selector.length == 0) {
                    return parent;
                }
                var tmp = selector.shift();
                if (tmp.split('#').length == 2) {
                    //
                    return get(parent.getElementById(tmp.split('#')[1]));
                }
                else if (tmp.split('.').length == 2) {
                    //
                    return parent.getElementsByClassName(tmp.split('.')[1]);
                }
                else {
                    //
                    return parent.getElementsByTagName(tmp);
                }
            }
            //
            return get(document);
        })(selector);
    }
    //
    C.prototype.addClass = function (_class) {
        if (this.el.length > 0) {
            for (var i = 0; i < this.el.length; i++) {
                this.el[i].classList.add(_class);
            }
        }
        else {
            this.el.classList.add(_class);
        }
        return this;
    };
    //
    C.prototype.removeClass = function (_class) {
        this.el.classList.remove(_class);
        return this;
    };
    //
    C.prototype.setAttr = function (attr) {
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
        }
        else {
            set(this.el, attr);
        }
        return this;
    };
    //
    C.prototype.children = function (index) {
        this.el = isFinite(index) && this.el.childNodes[index] || this.el.childNodes;
        return this;
    };
    //
    C.prototype.html = function (html) {
        function set(target, html) {
            target.innerHTML = html || '';
        }
        if (this.el.length > 0) {
            for (var i = 0; i < this.el.length; i++) {
                set(this.el[i], html);
            }
        }
        else {
            set(this.el, html);
        }
        return this;
    };
    //
    C.prototype.remove = function () {
        this.el.parentNode.removeChild(this.el);
        return this;
    };
    //
    C.prototype.hide = function () {
        this.el.style.display = 'none';
        return this;
    };
    //
    C.prototype.show = function () {
        this.el.style.display = '';
        return this;
    };
    //
    C.prototype.append = function (el) {
        this.el.appendChild(el.el || el);
        return this;
    };
    //
    C.prototype.length = function () {
        return this.el.length;
    };
    //
    C.prototype.on = function (event, func) {
        function set(el, event, func) {
            el.addEventListener(event, func);
        }
        //
        if (this.el.length > 0) {
            for (var i = 0; i < this.el.length; i++) {
                set(this.el[i], event, func);
            }
        }
        else {
            set(this.el, event, func);
        }
        return this;
    };
    //
    C.prototype.before = function (el) {
        this.el.parentNode.insertBefore(el.el || el, this.el);
        return this;
    };
    // https://github.com/oneuijs/You-Dont-Need-jQuery
    C.prototype.offset = function () {
        var box = this.el.getBoundingClientRect();
        return {
            top: box.top + window.pageYOffset - document.documentElement.clientTop,
            left: box.left + window.pageXOffset - document.documentElement.clientLeft
        };
    };
    //
    C.prototype.fade = function (time, sw) {
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
            return anime(el, param, time).then(function () {
                el.style.opacity = '';
                !sw && (el.style.display = 'none');
            });
        }
        var p;
        if (this.el.length) {
            //all
            p = Promise.all(Array.prototype.slice.call(this.el).map(function (el) {
                return _fade(el, time, sw);
            }));
        }
        else {
            //single
            p = _fade(this.el, time, sw);
        }
        return p;
    };
    //
    C.prototype.fadeIn = function (time) {
        return this.fade(time, true);
    };
    C.prototype.fadeOut = function (time) {
        return this.fade(time, false);
    };
    //
    C.prototype.eq = function (index) {
        this.el = this.el[index];
        return this;
    };
    return C;
}());

/// <reference path="anime.ts" />
/// <reference path="event.ts" />
/// <reference path="myquery.ts" />
//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Waypoint = (function (_super) {
    __extends(Waypoint, _super);
    function Waypoint(selector) {
        var _this = _super.call(this, selector) || this;
        _this.move();
        return _this;
    }
    Waypoint.prototype._on = function () { this.show(); };
    ;
    Waypoint.prototype.off = function () {
        scrollEvent.off();
        this.hide();
        //http://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
        var rows_container = $$('#rows-container ul');
        var maxHeight = Math.max(window.innerHeight, Math.max.apply(null, Array.prototype.slice.call(rows_container.el).map(function (ul) { return ul.clientHeight; })));
        var promise = [];
        for (var i = 0; i < rows_container.el.length; i++) {
            var param = { style: 'height', start: rows_container.el[i].clientHeight, end: maxHeight, unit: 'px' };
            promise.push(new Promise(function (resolve, reject) {
                anime(rows_container.el[i], param, 100).then(function () { resolve(); });
            }));
        }
        ;
        Promise.all(promise).then(function () {
            $$('#rows-container').addClass('stretch');
            for (var i = 0; i < rows_container.el.length; i++) {
                rows_container.el[i].style.height = '';
            }
        });
    };
    Waypoint.prototype.calc = function () {
        var heightList = [];
        var children = $$('#rows-container').children();
        for (var i = 0; i < children.length(); i++) {
            heightList.push(children.el[i].clientHeight);
        }
        return heightList.indexOf(Math.min.apply(null, heightList));
    };
    Waypoint.prototype.move = function () {
        $$('#rows-container').children(this.calc()).append(this);
    };
    Waypoint.prototype.top = function () {
        return this.offset().top;
    };
    return Waypoint;
}(C));
