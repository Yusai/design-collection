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
        globalData.orient();
    }
});