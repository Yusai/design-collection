var waypoint = (function() {
    return {
        on: function() {
            $('#item-container').append($("<li id='waypoint'><div><span>Now Loading...</span></div></li>"));
        },
        off: function() {
            // $('#waypoint').remove();
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
    //
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
                    // .append("<dt class='bold9'>Image</dt>")
                    .append(target)
                    // .append("<dt class='bold9'>Source</dt>")
                    // .append("<dd class='link'><a href='//goo.gl/" + tmp.url + "' target='_blank'>" + tmp.title + "</a></dd>")
                    // .attr({
                    //     title: tmp.title,
                    //     source_url : tmp.url
                    // })
            )
        );
        $.ajax({
            type: 'get',
            url: 'svg/' + data.dir + '/' + tmp.svg + '.svg',
            dataType: 'xml',
        }).done(function(data) {
            target
                .html($(data).find('svg'))
                .on('click', function() {
                    zoomEvent.on();
                    console.log(tmp)
                    var svg = $(this).find('svg').clone();
                    $('#item-container, #close').fadeOut(100, function() {
                        $('#zoom-container').find('.item-image')
                            .html(svg);
                        $('#zoom-container').find('.link')
                            .html("<a href='//goo.gl/" + tmp.url + "' target='_blank'>" + tmp.title + "</a>");
                        $('#zoom-container').fadeIn(100);
                    });
                    
                    // var li = $(this).parents('li');
                    // if (li.hasClass('attention')) {
                    //     li.fadeOut(100, function() {
                    //         li.removeClass('attention');
                    //         $('#item-container').find('li').fadeIn(100, zoomEvent.off());
                    //         $('#close').fadeIn();
                    //     });
                    // } else {
                    //     zoomEvent.on();
                    //     $('#close').fadeOut();
                    //     $('#item-container').find('li').fadeOut(100, function() {
                    //         li.fadeIn().addClass('attention');
                    //     });
                    // }
                });
        }).fail(function(data) {
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
        console.log('zoom-open')
        this.scrollTop = $(document).scrollTop();
    },
    off: function() {
        console.log('zoom-close')
        $('html body').animate({scrollTop: this.scrollTop}, 1);
    }
};