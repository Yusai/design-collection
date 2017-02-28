(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function MyAnime(el, param, time) {
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

function Fade(el, time, sw) {
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
        if (!sw) {
            el.style.display = 'none';
        }
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
    //
    window.addEventListener('orientationchange', function() {
        console.log('orient')
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
    var main = document.getElementById('main');
    fade.in(main, 250).then(function() {
        _this.restart();
    });
};

Collection.prototype.restart = function() {
    this.index = 0;
    waypoint.on();
    this.addItem();
};

Collection.prototype.orient = function() {
    document.getElementById('rows-container').innerHTML = '';
    this.setRows();
    this.restart();
};

Collection.prototype.setRows = function() {
    var rows = Math.floor(window.innerWidth / 160);
    if (rows == 0) {
        rows = 1;
    }
    //
    var container = document.getElementById('rows-container');
    for (var i = 0; i < rows; i++) {
        container.insertAdjacentHTML("beforeend", '<ul class="item-container"></ul>');
    }
};
//
Collection.prototype.check = function() {
     return (this.index < this.data.length);
};
//
Collection.prototype.addItem = function() {
    var _this = this;
    var waypointTop = getOffset(document.getElementById('waypoint')).top;
    // https://github.com/oneuijs/You-Dont-Need-jQuery#promises
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    if ((waypointTop - scrollTop + 12) < window.innerHeight) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            .then(function() {
                waypoint.move();
                //画面下まで到達または閉じるボタンが押された場合読み込み中断
                if (!_this.addItem()) {
                    scrollEvent.on(_this);
                    console.log('addItem stop');
                }
            }, function() {
            // //次のアイテムがない場合はrejectが返ってきて終了
                console.log('item loaded');
                waypoint.off();
            });
        return true;
    } else {
        return false;
    }
};
//
Collection.prototype.loadItem = function() {
    console.log('loadItem - index : %d', this.index);
    var tmp = this.getJSON();
    var dfd = deferred();
    //
    if (tmp) {
        var item = this;
        //
        var target = document.createElement('dd');
        target.classList.add('item-image');
        //
        var dl = document.createElement('dl');
        dl.classList.add('small');
        dl.setAttribute('title', tmp.title);
        dl.setAttribute('source_url', tmp.link);
        dl.appendChild(target);
        //
        var li = document.createElement('li');
        li.classList.add('item');
        li.style.display = 'none';
        li.appendChild(dl);
        //
        var waypoint = document.getElementById('waypoint');
        waypoint.parentNode.insertBefore(li, waypoint);
        //
        function appendSVG() {
            if (tmp.data != 'image not found') {
                target.innerHTML = tmp.data;
                target.addEventListener('click', function(e) {
                    createZoom(tmp, e);
                });
            } else {
                console.log('no image...')
                append(target, '<span class="bold9 small">Not Found.</span>');
            }
            //
            item.showItem(li).then(function() {
                dfd.resolve();
            }, function() {
                dfd.reject();
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
                } else {
                    //false
                    console.log('File Not Found...');
                    tmp.data = 'image not found';
                }
                appendSVG();
            };
            request.send(null);
        }
        return dfd.promise();
    } else {
        return dfd.reject();
    }
};
//
Collection.prototype.showItem = function(li) {
    var dfd = deferred();
    var item = this;
    var duration = 0;
    fade.in(li, duration).then(function() {
        if (item.check()) {
            dfd.resolve();
        } else {
            dfd.reject();
        }
    });
    return dfd.promise();
};
//
Collection.prototype.getJSON = function() {
    if (this.check()) {
        var tmp = this.data[this.index];
        this.index ++;
        //fill mode
        if (this.index >= this.data.length) {
            console.log('fill mode')
            this.index = 0;
        }
    } else {
        var tmp = false;
    }
    return tmp;
};

//
(function() {
    var zoom_container = document.getElementById('zoom-container');
    var item_image = document.getElementsByClassName('item-image');
    //
    item_image[0].addEventListener('click', function() {
        var download = document.getElementById('download');
        fade.out(download, 100);
        fade.out(zoom_container, 100);
    });
})();
//
var waypoint = {
    on: function() {
        var container = document.getElementById('rows-container');
        target = container.childNodes[this.calc()];
        append(target, '<li id="waypoint" class="anime-blink"><span>Now Loading...</span></li>');
    },
    off: function() {
        document.getElementById('waypoint').remove();
    },
    calc : function() {
        var heightList = [];
        var container = document.getElementById('rows-container');
        var children = container.childNodes;
        for (var i = 0; i < children.length; i++) {
            heightList.push(children[i].clientHeight);
        }
        return heightList.indexOf(Math.min.apply(null, heightList));
    },
    move : function() {
        var container = document.getElementById('rows-container');
        target = container.childNodes[this.calc()];
        var waypoint = document.getElementById('waypoint');
        target.appendChild(waypoint);
    }
};
//
var scrollEvent = {
    on: function(tmp) {
        window.addEventListener('scroll', function() {
            tmp.addItem();
        });
    },
    off: function() {
        window.removeEventListener('scroll', null);
    }
};
//
var zoomEvent = {
    anime: function(e) {
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;
        var zoom_container = document.getElementById('zoom-container');
        //
        var param = [
            {style: 'top', start: y, end: 0, unit: 'px'},
            {style: 'left', start: x, end: 0, unit: 'px'},
            {style: 'width', start: 0, end: 100, unit: '%'},
            {style: 'height', start: 0, end: 100, unit: '%'}
        ];
        new MyAnime(zoom_container, param, 100).then(function() {
            fade.in(download, 250);
        });
    }
};
//
function createZoom(data, event) {
    var zoom_container = document.getElementById('zoom-container');
    zoom_container.getElementsByClassName('item-image')[0].innerHTML = data.data;
    //
    var link = zoom_container.getElementsByClassName('link')[0];
    link.innerHTML = '<span>LINK</span><a href="//goo.gl/' + data.link + '" target="_blank">' + data.title + '</a>';
    //
    var a = document.getElementById('download').getElementsByTagName('a')[0];
    a.setAttribute('href', 'svg/' + data.url + '.svg');
    a.setAttribute('download', data.url + '.svg');
    var own = document.getElementById('own');
    if (data.own) {
        own.classList.add('own');
    } else {
        own.classList.remove('own');
    }
    zoomEvent.anime(event);
}

//
function start() {
    var promise = new Promise(function(resolve) {
        //
        var menu = document.getElementById('menu');
        var button = menu.getElementsByClassName('button')[0];
        button.addEventListener('click', function() {
            var h1 = document.getElementsByTagName('h1')[0];
            fade.out(h1, 250);
            fade.out(menu, 250).then(function() {
                h1.classList.add('small');
                fade.in(h1, 250);
                resolve();
            });
        });
    });
    var loading = document.getElementById('loading');
    fade.out(loading, 250).then(function() {
        loading.remove();
        fade.in(document.getElementById('menu'), 250);
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
