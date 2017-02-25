//
function Categorydata(json) {
    this.json = json;
}
//
Categorydata.prototype.select = function() {
    this.index = 0;
    waypoint.on();
    this.addItem();
}
//
Categorydata.prototype.check = function() {
     return (this.index < this.json.json.length);
}
//
Categorydata.prototype.addItem = function() {
    var _this = this;
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    if ((waypointTop - scrollTop + 12) < $(window).height()) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            .done(function() {
                waypoint.move();
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
    //
    if (tmp) {
        var item = this;
        var dl = $("<dl class='small'></dl>")
            .attr({
                title: tmp.title,
                source_url : tmp.url
            });
        var target = $("<dd class='item-image'></dd>")
        var li = $("<li class='item' style='display:none;'></li>");
        $('#waypoint').before(li.append(dl.append(target)));
        //
        function appendSVG() {
            if (tmp.data != 'image not found') {
                target
                    // .html($(svg).find('svg'))
                    .html(tmp.data)
                    .on('click', function(e) {
                        zoomEvent.on(e);
                        // var svg = $(this).find('svg').clone();
                        createZoom(tmp, item.json.dir);
                    });
            } else {
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
            appendSVG();
        } else {
            $.ajax({
                type: 'get',
                url: 'svg/' + item.json.dir + '/' + tmp.svg + '.svg'//,
                // dataType: 'xml',
            }).done(function(svg) {
                // tmp.data = $(svg).find('svg')[0];
                tmp.data = $('<div></div>').append($(svg).find('svg')).html();
                appendSVG();
            }).fail(function() {
                console.log('File Not Found...')
                tmp.data = 'image not found';
                appendSVG();
            }).always(function(){
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
    var duration = 1;
    // $('#waypoint').fadeOut(duration, function() {
        li.fadeIn(duration);
        if (item.check()) {
            // $('#waypoint').fadeIn(duration, function() {
                dfd.resolve();
            // });
        } else {
            dfd.reject();
        }
    // });
    return dfd;
}
//
Categorydata.prototype.getJSON = function() {
    if (this.check()) {
        var tmp = this.json.json[this.index];
        this.index ++;
    } else {
        var tmp = false;
    }
    return tmp;
}
