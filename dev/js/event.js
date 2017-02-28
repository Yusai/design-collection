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
    item_image[0].addEventListener('click', function() {
        var download = document.getElementById('download');
        fade.out(download, 100);
        fade.out(zoom_container, 100);
            // .done(function() {
            //     zoomEvent.off();
            // });
    });
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
    // scrollTop: 0,
    // on: function(e) {
    anime: function(e) {
        // this.scrollTop = $(document).scrollTop();
        // this.scrollTop = scrollTop();
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;//scrollTop();// - this.scrollTop;
        // $('#zoom-container').css({top: y, left: x, width: '0', height: '0'});
        var zoom_container = document.getElementById('zoom-container');
        //
        var anime = zoom_container.animate([
            {
                width: '0%',
                height: '0%',
                left: '' + x + 'px',
                top: '' + y + 'px'
            },
            {
                width: '100%',
                height: '100%',
                left: '0px',
                top: '0px'
            }
        ], {
            fill: 'forwards',
            duration: 100
        });
        anime.pause();
        zoom_container.style.display = '';
        anime.onfinish = function() {
            fade.in(download, 250);
        };
        anime.play();
    }//,
    // off: function() {
    //     // $('html body').animate({scrollTop: this.scrollTop}, 1);
    // }
};
//
function createZoom(data, event) {
    var zoom_container = document.getElementById('zoom-container');
    // $('#zoom-container').find('.item-image')
    //     .html(data.data);
    zoom_container.getElementsByClassName('item-image')[0].innerHTML = data.data;
    // $('#zoom-container').find('.link')
    //     .html("<span>LINK</span><a href='//goo.gl/" + data.link + "' target='_blank'>" + data.title + "</a>");
    var link = zoom_container.getElementsByClassName('link')[0];
    link.innerHTML = '<span>LINK</span><a href="//goo.gl/' + data.link + '" target="_blank">' + data.title + '</a>';
    // $('#download').find('a')
    //     .attr({
    //         'href' : 'svg/' + data.url + '.svg',
    //         'download' : data.url + '.svg'
    //     });
    var a = document.getElementById('download').getElementsByTagName('a')[0];
    a.setAttribute('href', 'svg/' + data.url + '.svg');
    a.setAttribute('download', data.url + '.svg');
    var own = document.getElementById('own');
    if (data.own) {
        // $('#own').addClass('own');
        own.classList.add('own');
    } else {
        // $('#own').removeClass('own');
        own.classList.remove('own');
    }
    // $('#zoom-container').show().animate({
    //     left: "0",
    //     top: "0",
    //     width: '100%',
    //     height: '100%'
    // }, 100, function() {
    //     $('#download').fadeIn(250);
    // });
    zoomEvent.anime(event);
}
