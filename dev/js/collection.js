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
            if (tmp.data != 'image not found') {
                target.html(tmp.data);
                target.on('click', function(e) {
                    createZoom(tmp, e);
                });
            } else {
                console.log('no image...')
                target.html('<span class="bold9 small">Not Found.</span>');
            }
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
