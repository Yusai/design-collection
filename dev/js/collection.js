//
function Collection(json) {
    var _this = this;
    this.data = json;
    this.setRows();
    //
    // $(window).on('orientationchange', function() {
    window.addEventListener('orientationchange', function() {
        console.log('orient')
        if ($('#main:visible').length) {
            _this.orient();
        }
    });
    //
    this.start();
    //
    return this;
}

Collection.prototype.start = function() {
    console.log('global start');
    var _this = this;
    // $('#main').fadeIn(250, function() {
    var main = document.getElementById('main');
    fade.in(main, 250, function() {
        _this.restart();
    });
};

Collection.prototype.restart = function() {
    this.index = 0;
    waypoint.on();
    this.addItem();
};

Collection.prototype.orient = function() {
    $('#rows-container').children().remove();
    this.setRows();
    this.restart();
};

Collection.prototype.setRows = function() {
    // var rows = Math.floor($('html').width() / 160);
    var rows = Math.floor(window.innerWidth / 160);
    if (rows == 0) {
        rows = 1;
    }
    //
    var container = document.getElementById('rows-container');
    for (var i = 0; i < rows; i++) {
//        $('#rows-container').append('<ul class="item-container"></ul>');
        container.insertAdjacentHTML("beforeend", '<ul class="item-container"></ul>');
    }
};
//
Collection.prototype.check = function() {
     return (this.index < this.data.length);
};
//
Collection.prototype.addItem = function() {
    //メニューに戻った場合、読み込み中断
    // if (!$('#waypoint:visible').length) {
    //     return false;
    // }
    //
    var _this = this;
//    var waypointTop = $('#waypoint').offset().top;
    var waypointTop = getOffset(document.getElementById('waypoint')).top;
    // https://github.com/oneuijs/You-Dont-Need-jQuery#promises
    var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    // var scrollTop = $(document).scrollTop();
    // if ((waypointTop - scrollTop + 12) < $(window).height()) {
    if ((waypointTop - scrollTop + 12) < window.innerHeight) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            // .done(function() {
            //     waypoint.move();
            //     //画面下まで到達または閉じるボタンが押された場合読み込み中断
            //     if (!_this.addItem()) {
            //         scrollEvent.on(_this);
            //         console.log('addItem stop')
            //     }
            // })
            // //次のアイテムがない場合はrejectが返ってきて終了
            // .fail(function() {
            //     console.log('item loaded')
            //     waypoint.off();
            // });
            .then(function() {
                waypoint.move();
                if (!_this.addItem()) {
                    scrollEvent.on(_this);
                    console.log('addItem stop');
                }
            }, function() {
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
        // var target = $("<dd class='item-image'></dd>")
        var target = document.createElement('dd');
        target.classList.add('item-image');
        // var dl = $("<dl class='small'></dl>")
        var dl = document.createElement('dl');
        dl.classList.add('small');
        dl.setAttribute('title', tmp.title);
        dl.setAttribute('source_url', tmp.link);
        dl.appendChild(target);
        // var li = $("<li class='item' style='display:none;'></li>");
        var li = document.createElement('li');
        li.classList.add('item');
        li.style.display = 'none';
        li.appendChild(dl);
        // $('#waypoint').before(li.append(dl.append(target)));
        var waypoint = document.getElementById('waypoint');
        waypoint.parentNode.insertBefore(li, waypoint);
        //
        function appendSVG() {
            if (tmp.data != 'image not found') {
                // target
                //     .html(tmp.data)
                //     .on('click', function(e) {
                //         zoomEvent.on(e);
                //         createZoom(tmp);
                //     });
                target.innerHTML = tmp.data;
                target.addEventListener('click', function(e) {
                    zoomEvent.on(e);
                    createZoom(tmp);
                });
            } else {
                console.log('no image...')
                // target.html('<span class="bold9 small">Not Found.</span>');
                append(target, '<span class="bold9 small">Not Found.</span>');
            }
            //
            item.showItem(li).then(function() {
                dfd.resolve();
            }, function() {
                def.reject();
            });
                // .done(function() {
                //     dfd.resolve();
                // })
                // .fail(function() {
                //     dfd.reject();
                // });
        }
        //
        if (tmp.data) {
            setTimeout(function() {
                appendSVG();
            }, 0);
        } else {
            // $.ajax({
            //     type: 'get',
            //     url: 'svg/' + tmp.url + '.svg'
            // }).done(function(svg) {
            //     tmp.data = $('<div></div>').append($(svg).find('svg')).html();
            // }).fail(function() {
            //     console.log('File Not Found...')
            //     tmp.data = 'image not found';
            // }).always(function(){
            //     appendSVG();
            // });
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
    // var dfd = $.Deferred();
    var dfd = deferred();
    var item = this;
    var duration = 0;
    // li.fadeIn(duration, function() {
    fade.in(li, duration, function() {
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
