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
    console.log('add item');
    var parent = this;
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    if ((waypointTop - scrollTop + 12) < $(window).height()) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            .done(function() {
                if (!parent.addItem()) {
                    scrollEvent.on(parent);
                }
            })
            //次のアイテムがない場合はrejectが返ってきて終了
            .fail(function() {
                console.log('item loaded')
                waypoint.off();
            });
        return true;
    } else {
        console.log('addItem stop')
        return false;
    }
}
//
Categorydata.prototype.loadItem = function() {
    console.log('index : %d', this.index);
    var tmp = this.getJSON();
    var dfd = $.Deferred();
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
        $.ajax({
            type: 'get',
            url: 'svg/' + item.json.dir + '/' + tmp.svg + '.svg',
            dataType: 'xml',
        }).done(function(svg) {
            target
                .html($(svg).find('svg'))
                .on('click', function() {
                    zoomEvent.on();
                    var svg = $(this).find('svg').clone();
                    createZoom(svg, tmp, item.json.dir);
                });
        }).fail(function() {
            console.log('File Not Found...')
            target.html('<span class="bold9 small">Image Not Found.</span>');
        }).always(function(){
            item.showItem(li)
                .done(function() {
                    dfd.resolve();
                })
                .fail(function() {
                    dfd.reject();
                });
        });
        return dfd.promise();
    } else {
        return dfd.reject();
    }
}
//
Categorydata.prototype.showItem = function(li) {
    var dfd = $.Deferred();
    var item = this;
    var duration = 5;
    $('#waypoint').fadeOut(duration, function() {
        li.fadeIn(duration);
        if (item.check()) {
            $('#waypoint').fadeIn(duration, function() {
                dfd.resolve();
            });
        } else {
            dfd.reject();
        }
    });
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
