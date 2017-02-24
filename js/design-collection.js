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
    var parent = this;
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    if ((waypointTop - scrollTop + 12) < $(window).height()) {
        scrollEvent.off();
        this.loadItem()
            //次のアイテムがある場合はresolveが返ってきて、引き続きアイテム挿入を呼び出す
            .done(function() {
                waypoint.move();
                if (!parent.addItem()) {
                    scrollEvent.on(parent);
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
                .on('click', function(e) {
                    zoomEvent.on(e);
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

//
var waypoint = {
    on: function() {
        $('#rows-container').children().eq(this.calc())
            .append($("<li id='waypoint' class='anime-blink'><div><span>Now Loading...</span></div></li>"));
    },
    off: function() {
        $('#waypoint').fadeOut(250, function() {
            $(this).remove();
        });
        // $('#waypoint').show();
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
        $('#rows-container, #close').fadeIn(250);
        $('html body').animate({scrollTop: this.scrollTop}, 1);
    }
};
//
function createZoom(svg, data, dir) {
    $('#rows-container, #close').fadeOut(100, function() {
        $('#zoom-container').find('.item-image')
            .html(svg);
        $('#zoom-container').find('.link')
            .html("<a href='//goo.gl/" + data.url + "' target='_blank'>" + data.title + "</a>");
        // var serializer = new XMLSerializer();
        // var source = serializer.serializeToString(svg[0])
        // var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
        $('#download').find('a')
            .attr({
                'href' : 'svg/' + dir + '/' + data.svg + '.svg',
                'download' : data.svg + '.svg'
            });
        $('#zoom-container').show().animate({
            left: "0",
            top: "0",
            width: '100%',
            height: '100%'
        }, 100);
    });
}

$(window).on('orientationchange', function() {
    globalData.setIndex(globalData.getIndex());
});
//
var globalData = {
    index : 0,
    data: [],
    rows: 0,
    setIndex : function(index) {
        $('#rows-container').children().remove();
        $("#main").fadeIn(250);
        this.index = index;
        this.setRows();
        this.data[this.index].select();
    },
    getIndex : function() {
        return this.index;
    },
    setRows : function() {
        var rows = Math.floor($('html').width() / 180);
        if (rows == 0) {
            rows = 1;
        }
        this.rows = rows;
        //
        for (var i = 0; i < this.rows; i++) {
            $('#rows-container').append('<ul class="item-container"></ul>');
        }
    }
};
//
(function(fileList) {
    var dfds = [];
    fileList.forEach(function(file, num) {
        var dfd = $.Deferred();
        $.getJSON("json/" + file + ".json", function(json) {
            globalData.data[num] = new Categorydata(json);
            dfd.resolve();
        });
        dfds.push(dfd.promise());
    });
    $.when.apply($, dfds).then(function() {
        console.log(globalData);
        start();
    });
})(['by-pioneer', 'traced-a-photo']);

//
$('#menu .button').each(function(index) {
    $(this).on('click', function() {
        $('h1').fadeOut(250);
        $("#menu").fadeOut(250, function() {
            $('h1').addClass('small').fadeIn(250);
            globalData.setIndex(index);
        });
    });
});
//
$('#close').on('click', function() {
    $("#main").fadeOut(250, function() {
        $('#waypoint').hide();
        $("#menu").fadeIn(250);
        $('h1').removeClass('small');
    });
});
//
$('#zoom-container .item-image').on('click', function() {
    $('#zoom-container').fadeOut(100, function() {
        zoomEvent.off();
    });
});
//
function start() {
    $("#loading").fadeToggle(250, function(){
        $("#menu").fadeToggle(250);
    });
}