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

//
var waypoint = {
    on: function() {
        $('#item-container').append($("<li id='waypoint' class='anime-blink'><div><span>Now Loading...</span></div></li>"));
    },
    off: function() {
        $('#waypoint').fadeOut(250, function() {
            $(this).remove();
        });
    }
};
//
var scrollEvent = {
    on: function(tmp) {
        console.log('scroll on')
        $(window).on('scroll orientationchange', function() {
            console.log('scroll')
            tmp.addItem();
        });
    },
    off: function() {
        console.log('scroll off')
        $(window).off('scroll orientationchange');
    }
};
//
var zoomEvent = {
    scrollTop: 0,
    on: function() {
        this.scrollTop = $(document).scrollTop();
    },
    off: function() {
        $('html body').animate({scrollTop: this.scrollTop}, 1);
    }
};
//
function createZoom(svg, data, dir) {
    $('#item-container, #close').fadeOut(100, function() {
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
        $('#zoom-container').fadeIn(100);
    });
}

//
var globalData = {
    index : 0,
    data: [],
    setIndex : function(index) {
        this.index = index;
        this.data[this.index].select();
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
            $("#main").fadeIn(250, function() {
                globalData.setIndex(index);
            });
        });
    });
});
//
$('#close').on('click', function() {
    $("#main").fadeOut(250, function() {
        $('#waypoint').hide();
        $("#menu").fadeIn(250);
        $('h1').removeClass('small');
        $('#item-container').html("");
    });
});
//
$('#zoom-container .item-image').on('click', function() {
    zoomEvent.off();
    $('#item-container, #close').fadeIn(250);
    $('#zoom-container').fadeOut(250);
});
//
function start() {
    $("#loading").fadeToggle(250, function(){
        $("#menu").fadeToggle(250);
    });
}
