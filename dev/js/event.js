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

var zoomEvent = {
    scrollTop: 0,
    on: function() {
        this.scrollTop = $(document).scrollTop();
    },
    off: function() {
        $('html body').animate({scrollTop: this.scrollTop}, 1);
    }
};

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