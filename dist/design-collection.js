//
function Collection(json) {
    var _this = this;
    this.data = json;
    this.setRows();
    //
    $(window).on('orientationchange', function() {
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
    $('#main').fadeIn(250, function() {
        _this.restart();
    });
}

Collection.prototype.restart = function() {
    this.index = 0;
    waypoint.on();
    this.addItem();
}

Collection.prototype.orient = function() {
    $('#rows-container').children().remove();
    this.setRows();
    this.restart();
}

Collection.prototype.setRows = function() {
    var rows = Math.floor($('html').width() / 160);
    if (rows == 0) {
        rows = 1;
    }
    //
    for (var i = 0; i < rows; i++) {
        $('#rows-container').append('<ul class="item-container"></ul>');
    }
}
//
Collection.prototype.check = function() {
     return (this.index < this.data.length);
}
//
Collection.prototype.addItem = function() {
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
Collection.prototype.loadItem = function() {
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
                        createZoom(tmp);
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
Collection.prototype.showItem = function(li) {
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
Collection.prototype.getJSON = function() {
    if (this.check()) {
        var tmp = this.data[this.index];
        this.index ++;
    } else {
        var tmp = false;
    }
    return tmp;
}

//
var waypoint = {
    on: function() {
        $('#rows-container').children().eq(this.calc())
            .append($("<li id='waypoint' class='anime-blink'><div><span>Now Loading...</span></div></li>"));
    },
    off: function() {
        $('#waypoint').remove();
    },
    calc : function() {
        var heightList = [];
        $('#rows-container').children().each(function(){
            heightList.push($(this).height());
        });
        return heightList.indexOf(Math.min.apply(null, heightList));
    },
    move : function() {
        $('#waypoint').appendTo($('#rows-container').children().eq(this.calc()));
    }
};
//
var scrollEvent = {
    on: function(tmp) {
        $(window).on('scroll', function() {
            tmp.addItem();
        });
    },
    off: function() {
        $(window).off('scroll');
    }
};
//
var zoomEvent = {
    scrollTop: 0,
    on: function(e) {
        this.scrollTop = $(document).scrollTop();
        var x = e.pageX;
        var y = e.pageY - this.scrollTop;
        $('#zoom-container').css({top: y, left: x, width: '0', height: '0'});
    },
    off: function() {
        $('html body').animate({scrollTop: this.scrollTop}, 1);
    }
};
//
function createZoom(data) {
    $('#zoom-container').find('.item-image')
        .html(data.data);
    $('#zoom-container').find('.link')
        .html("<span>LINK</span><a href='//goo.gl/" + data.link + "' target='_blank'>" + data.title + "</a>");
    // var serializer = new XMLSerializer();
    // var source = serializer.serializeToString(svg[0])
    // var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    $('#download').find('a')
        .attr({
            'href' : 'svg/' + data.url + '.svg',
            'download' : data.url + '.svg'
        });
    if (data.own) {
        $('#own').addClass('own');
    } else {
        $('#own').removeClass('own');
    }
    $('#zoom-container').show().animate({
        left: "0",
        top: "0",
        width: '100%',
        height: '100%'
    }, 100, function() {
        $('#download').fadeIn(250);
    });
}

//
$('#zoom-container .item-image').on('click', function() {
    $('#download').fadeOut(100);
    $('#zoom-container').fadeOut(100, function() {
        zoomEvent.off();
    });
});
//
function start() {
    var dfd = $.Deferred();
    //
    $('#menu .button').each(function(index) {
        $(this).on('click', function() {
            console.log('--click')
            //分割しないとコールバックを2回呼ぶバグが発生するので
            //$("#menu, h1").fadeOut(250, function() {...とは書けない
            $("h1").fadeOut(250);
            $("#menu").fadeOut(250, function() {
                $('h1').addClass('small').fadeIn(250);
                dfd.resolve();
                // globalData.start();
            });
        });
    });
    //
    $("#loading").fadeOut(250, function(){
        $('#loading').remove();
        $("#menu").fadeIn(250);
    });
    return dfd.promise();
}
//
(function() {
    $.getJSON("json/data.json", function(json) {
        start().done(function() {
            console.log(new Collection(json));
        });
        // globalData.init(json);
        // start();
    });
})();
