/// <reference path="waypoint.ts" />
//
class Collection {
    data: any;
    waypoint: any;
    index: number;
    infinit: boolean;
    fill: boolean;
    addStop: boolean;
    loaded: boolean;
    //
    constructor (json) {
        this.data = json;
        this.setRows();
        this.waypoint = new Waypoint('#waypoint');
        //for debug
        this.infinit = false;
        this.fill = false;
        //
        window.addEventListener('orientationchange', () => {this.orient();});
        //
        this.start();
        //
        return this;
    }
    //
    start () {
        console.log('start');
        this.waypoint.move();
        // fade.in($$('#main'), 250).then(this.restart());
        $$('#main').fadeIn(250).then(() => {this.restart();});
    }
    //
    restart () {
        this.index = 0;
        this.addStop = false;
        this.loaded = false;
        this.waypoint._on();
        //
        scrollEvent.on(this);
        //
        $$('#rows-container').removeClass('stretch');
        this.addItem();
    }
    //
    orient () {
        $$('#rows-container').html();
        this.setRows();
        // scrollEvent.off();
        this.restart();
    }
    //
    setRows () {
        var rows = Math.floor(window.innerWidth / 160) || 1;
        var max = Math.floor(this.data.length / (window.innerHeight > window.innerWidth ? 4 : 3));
        rows > max && (rows = max);
        //
        var container = $$('#rows-container');
        var ul = $$('$$ul').addClass('item-container').el;
        for (var i = 0; i < rows; i++) {
            container.append(ul.cloneNode());
        }
    }
    //
    check () {
        return this.index < this.data.length;
    }
    //
    addItem () {
        // var _this = this;
        if (!this.fill && this.addStop && this.loaded && !this.infinit) {
            this.waypoint.off();
            return false;
        }
        // https://github.com/oneuijs/You-Dont-Need-jQuery
        var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if ((this.waypoint.top() - scrollTop + 12) < window.innerHeight) {
            // scrollEvent.off();
            this.loadItem()
                //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
                .then(() => {
                    this.waypoint.move();
                    //画面下まで到達または閉じるボタンが押された場合読み込み中断
                    if (!this.addItem()) {
                        // scrollEvent.on(_this);
                        console.log('addItem stop');
                        this.addStop = true;
                        //
                        if (this.fill && this.loaded && !this.infinit) {
                            this.waypoint.off();
                        }
                    }
                }, () => {
                // //次のアイテムがない場合はrejectが返ってきて終了
                    if (!this.infinit && !this.fill) {
                        console.log('item loaded');
                        this.waypoint.off();
                    }
                });
            return true;
        } else {
            return false;
        }
    }
    //
    loadItem () {
        var item = this;
        var index = this.index;
        var tmp = this.getJSON();
        //check item loaded
        if (!tmp) {
            console.log('check')
            return Promise.reject("no json");
            // return new Promise((resolve, reject) => {setTimeout(() => {reject()}, 1)});
        }
        //
        function loadSVG(tmp) {
            return new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open('get', `svg/${tmp.url}.svg`, true);
                request.onload = (event) => {
                    if (request.status >= 200 && request.status < 400) {
                        //success
                        console.log(`SVG Loaded : ${index}`);
                        tmp.data = request.responseText;
                    } else {
                        //false
                        console.log(`File Not Found : ${index}`);
                        tmp.data = 'image not found';
                    }
                    resolve();
                    // appendSVG();
                };
                request.send(null);
            });
        }
        //
        return new Promise((resolve, reject) => {
            //
            function appendSVG(tmp) {
                //
                var target = $$('$$dd').addClass('item-image');
                //
                if (tmp.data == 'image not found') {
                    console.log('no image...');
                    item.check() ? resolve() : reject();
                    // target.html('<span class="bold9 small">Not Found.</span>');
                    return;
                }
                //
                var dl = $$('$$dl')
                    .addClass('small')
                    .setAttr({title: tmp.title, source_url: tmp.link});
                //
                var li = $$('$$li').addClass('item').hide();
                //
                item.waypoint.before(li.append(dl.append(target)));
                //
                target.html(tmp.data);
                target.on('click', (e) => {createZoom(tmp, e)});
                //
                item.showItem(li).then(resolve, reject);
            }
            //
            if (tmp.data) {
                appendSVG(tmp);
            } else {
                loadSVG(tmp).then(() => {appendSVG(tmp)});
            }
        });
    }
    //
    showItem (li) {
        // var _this = this;
        return new Promise((resolve, reject) => {
            li.fadeIn(5).then(() => {this.check() ? resolve() : reject()});
        });
    }
    //
    getJSON () {
        var tmp;
        if (this.check()) {
            tmp = this.data[this.index];
            this.index ++;
            //
            if (this.index == this.data.length && !this.loaded) {
                console.log('svg files loaded');
                this.loaded = true;
            }
            this.loaded && this.addStop && (this.fill = false);
            //infinit mode
            (this.infinit || this.fill) && (this.index >= this.data.length) && (this.index = 0);
        } else {
            tmp = false;
        }
        return tmp;
    }
}