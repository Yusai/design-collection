//
function Categorydata(json) {
    this.json = json;
}
//
Categorydata.prototype.start = function() {
    this.index = 0;
    waypoint.on();
    this.addItem();
}
//
Categorydata.prototype.check = function() {
     return (this.index < this.json.length);
}
//
Categorydata.prototype.addItem = function() {
    //メニューに戻った場合、読み込み中断
    if (!$('#waypoint:visible').length) {
        return false;
    }
    //
    var _this = this;
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    if ((waypointTop - scrollTop + 12) < $(window).height()) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            .done(function() {
                waypoint.move();
                //画面下まで到達または閉じるボタンが押された場合読み込み中断
                if (!_this.addItem()) {
                    scrollEvent.on(_this);
                    console.log('addItem stop')
                }
            })
            //次のアイテムがない場合はrejectが返ってきて終了
            .fail(function() {
                console.log('item loaded')
                waypoint.off();
            });
        return true;
    } else {
        return false;
    }
}
//
Categorydata.prototype.loadItem = function() {
    console.log('loadItem - index : %d', this.index);
    var tmp = this.getJSON();
    var dfd = $.Deferred();
    //
    if (tmp) {
        var item = this;
        var dl = $("<dl class='small'></dl>")
            .attr({
                title: tmp.title,
                source_url : tmp.link
            });
        var target = $("<dd class='item-image'></dd>")
        var li = $("<li class='item' style='display:none;'></li>");
        $('#waypoint').before(li.append(dl.append(target)));
        //
        function appendSVG() {
            if (tmp.data != 'image not found') {
                target
                    .html(tmp.data)
                    .on('click', function(e) {
                        zoomEvent.on(e);
                        createZoom(tmp, item.json.dir);
                    });
            } else {
                console.log('no image...')
                target.html('<span class="bold9 small">Not Found.</span>');
            }
            //
            item.showItem(li)
                .done(function() {
                    dfd.resolve();
                })
                .fail(function() {
                    dfd.reject();
                });
        }
        //
        if (tmp.data) {
            setTimeout(function() {
                appendSVG();
            }, 0);
        } else {
            $.ajax({
                type: 'get',
                url: 'svg/' + tmp.url + '.svg'
            }).done(function(svg) {
                tmp.data = $('<div></div>').append($(svg).find('svg')).html();
            }).fail(function() {
                console.log('File Not Found...')
                tmp.data = 'image not found';
            }).always(function(){
                appendSVG();
            });
        }
        return dfd.promise();
    } else {
        return dfd.reject();
    }
}
//
Categorydata.prototype.showItem = function(li) {
    var dfd = $.Deferred();
    var item = this;
    var duration = 0;
    li.fadeIn(duration, function() {
        if (item.check()) {
            dfd.resolve();
        } else {
            dfd.reject();
        }
    });
    return dfd;
}
//
Categorydata.prototype.getJSON = function() {
    if (this.check()) {
        var tmp = this.json[this.index];
        this.index ++;
    } else {
        var tmp = false;
    }
    return tmp;
}
