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
function createZoom(data, dir) {
    $('#zoom-container').find('.item-image')
        .html(data.data);
    $('#zoom-container').find('.link')
        .html("<a href='//goo.gl/" + data.link + "' target='_blank'>" + data.title + "</a>");
    // var serializer = new XMLSerializer();
    // var source = serializer.serializeToString(svg[0])
    // var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
    $('#download').find('a')
        .attr({
            'href' : 'svg/' + dir + '/' + data.url + '.svg',
            'download' : data.url + '.svg'
        });
    $('#zoom-container').show().animate({
        left: "0",
        top: "0",
        width: '100%',
        height: '100%'
    }, 100);
}

$(window).on('orientationchange', function() {
    console.log('orient')
    if ($('#main:visible').length) {
        console.log('orient')
        // globalData.setIndex(globalData.getIndex());
        globalData.orient();
    }
});
//
var globalData = {
    // index : 0,
    data: [],
    // rows: 0,
    // setIndex : function(index) {
    //     $('#rows-container').children().remove();
    //     $("#main").fadeIn(250);
    //     this.index = index;
    //     this.setRows();
    //     this.data[this.index].select();
    // },
    // getIndex : function() {
    //     return this.index;
    // },
    init: function(data) {
        this.data = new Categorydata(data);
        this.setRows();
    },
    start: function() {
        console.log('global start');
        var _this = this;
        $('#main').fadeIn(250, function() {
            _this.data.start();
        });
    },
    orient: function() {
        $('#rows-container').children().remove();
        this.setRows();
        this.data.start();
    },
    setRows : function() {
        var rows = Math.floor($('html').width() / 160);
        if (rows == 0) {
            rows = 1;
        }
        // this.rows = rows;
        //
        for (var i = 0; i < rows; i++) {
            $('#rows-container').append('<ul class="item-container"></ul>');
        }
    }
};
console.log(globalData);
//
(function(fileList) {
    $.getJSON("json/data.json", function(json) {
        globalData.init(json);
        //
        // var menu = $('#menu ul');
        // json.forEach(function(data, index) {
        //     globalData.data[index] = new Categorydata(data);
        //     menu.append('<li class="button"><span>' + data.dir + '</span></li>');
        //     data.dir = data.dir.replace(' ', '_');
        // });
        start();
    });
})();

//
// $('#close').on('click', function() {
//     $('#waypoint').hide();
//     $("#main").fadeOut(250, function() {
//         $("#menu").fadeIn(250);
//         $('h1').removeClass('small');
//     });
// });
//
$('#zoom-container .item-image').on('click', function() {
    $('#zoom-container').fadeOut(100, function() {
        zoomEvent.off();
    });
});
//
function start() {
    //
    $('#menu .button').each(function(index) {
        $(this).on('click', function() {
            console.log('--click')
            //分割しないとコールバックを2回呼ぶバグが発生するので
            //$("#menu, h1").fadeOut(250, function() {...とは書けない
            $("h1").fadeOut(250);
            $("#menu").fadeOut(250, function() {
                $('h1').addClass('small').fadeIn(250);
                globalData.start();
                // globalData.setIndex(index);
            });
        });
    });
    //
    $("#loading").fadeToggle(250, function(){
        $("#menu").fadeToggle(250);
    });
}