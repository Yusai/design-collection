var waypoint = (function() {
    return {
        on: function() {
            $('#item-container').append($("<li id='waypoint'><div><span>Now Loading...</span></div></li>"));
        },
        off: function() {
        }
    };
})();

var scrollEvent = (function() {
    return {
        on: function(data) {
            $(window).on('scroll orientationchange', function() {
                addItem(data);
            });
        },
        off: function() {
            $(window).off('scroll orientationchange');
        }
    };
})();

function selectJSON(index) {
    var data = json_data[index];
    data.resetIndex();
    waypoint.on();
    addItem(data);
}

function addItem(data) {
    if (!data.check()) {
        console.log('item loaded')
        waypoint.off();
        scrollEvent.off();
        return;
    }
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    if ((waypointTop - scrollTop + 12) < $(window).height()) {
        scrollEvent.off();
        loadItem(data)
            .done(function() {
                addItem(data);
                scrollEvent.on(data);
            })
            .fail(function() {
                console.log('error')
            });
    }
}

function loadItem(data) {
    console.log('index : %d', data.index);
    var tmp = data.getJSON();
    var dfd = $.Deferred();
    if (tmp) {
        var dl = $("<dl class='small'></dl>");
        var target = $("<dd class='item-image'><span class='bold9 anime-blink'>Now Loading...</span></dd>")
        var li = $("<li class='item' style='display:none;'></li>");
        $('#waypoint').before(
            li.append(
               dl
                    .append(target)
                    .attr({
                        title: tmp.title,
                        source_url : tmp.url
                    })
            )
        );
        $.ajax({
            type: 'get',
            url: 'svg/' + data.dir + '/' + tmp.svg + '.svg',
            dataType: 'xml',
        }).done(function(svg) {
            target
                .html($(svg).find('svg'))
                .on('click', function() {
                    zoomEvent.on();
                    var svg = $(this).find('svg').clone();
                    createZoom(svg, tmp);
                });
        }).fail(function() {
            target.find('span').text('Image Not Found.');
        }).always(function() {
            if ($('#item-container').find('.attention').length == 0) {
                li.fadeIn(500);
            }
            dfd.resolve();
        });
        return dfd.promise();
    } else {
        return dfd.reject();
    }
}

var zoomEvent = {
    scrollTop: 0,
    on: function() {
        this.scrollTop = $(document).scrollTop();
    },
    off: function() {
        $('html body').animate({scrollTop: this.scrollTop}, 1);
    }
};

function b64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
};

function createZoom(svg, data) {
    $('#item-container, #close').fadeOut(100, function() {
        $('#zoom-container').find('.item-image')
            .html(svg);
        $('#zoom-container').find('.link')
            .html("<a href='//goo.gl/" + data.url + "' target='_blank'>" + data.title + "</a>");
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg[0])
        var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
        $('#download').find('a')
            .attr({
                'href' : url,
                'download' : data.svg + '.svg'
            });
        $('#zoom-container').fadeIn(100);
    });
}