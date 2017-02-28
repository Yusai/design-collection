//
// $('#zoom-container .item-image').on('click', function() {
//     $('#download').fadeOut(100);
//     $('#zoom-container').fadeOut(100, function() {
//         zoomEvent.off();
//     });
// });
(function() {
    var zoom_container = document.getElementById('zoom-container');
    var item_image = document.getElementsByClassName('item-image');
    //
    function on(target) {
        target.addEventListener('on', function() {
            var download = document.getElementById('download');
            fadeOut(download, 100);
            fadeOut(zoom_container, 100)
                .done(function() {
                    zoomEvent.off();
                });
        });
    }
    on(zoom_container);
    on(item_image[0]);
})();
//
var waypoint = {
    on: function() {
        // $('#rows-container').children().eq(this.calc())
        //     .append($("<li id='waypoint' class='anime-blink'><div><span>Now Loading...</span></div></li>"));
        var container = document.getElementById('rows-container');
        target = container.childNodes[this.calc()];
        append(target, '<li id="waypoint" class="anime-blink"><span>Now Loading...</span></li>');
    },
    off: function() {
        // $('#waypoint').remove();
        document.getElementById('waypoint').remove();
    },
    calc : function() {
        var heightList = [];
        // $('#rows-container').children().each(function(){
        //     heightList.push($(this).height());
        // });
        var container = document.getElementById('rows-container');
        container.childNodes.forEach(function(node) {
            heightList.push(node.clientHeight);
        });
        return heightList.indexOf(Math.min.apply(null, heightList));
    },
    move : function() {
        // $('#waypoint').appendTo($('#rows-container').children().eq(this.calc()));
        var container = document.getElementById('rows-container');
        target = container.childNodes[this.calc()];
        var waypoint = document.getElementById('waypoint');
        target.appendChild(waypoint);
    }
};
//
var scrollEvent = {
    on: function(tmp) {
        // $(window).on('scroll', function() {
        window.addEventListener('scroll', function() {
            tmp.addItem();
        });
    },
    off: function() {
        // $(window).off('scroll');
        window.removeEventListener('scroll', null);
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
