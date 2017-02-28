//
(function() {
    var zoom_container = document.getElementById('zoom-container');
    var item_image = document.getElementsByClassName('item-image');
    //
    item_image[0].addEventListener('click', function() {
        var download = document.getElementById('download');
        fade.out(download, 100);
        fade.out(zoom_container, 100);
    });
})();
//
var waypoint = {
    on: function() {
        var container = document.getElementById('rows-container');
        target = container.childNodes[this.calc()];
        target.innerHTML = '<li id="waypoint" class="anime-blink"><div><span>Now Loading...</span></div></li>';
    },
    off: function() {
        document.getElementById('waypoint').remove();
    },
    calc : function() {
        var heightList = [];
        var container = document.getElementById('rows-container');
        var children = container.childNodes;
        for (var i = 0; i < children.length; i++) {
            heightList.push(children[i].clientHeight);
        }
        return heightList.indexOf(Math.min.apply(null, heightList));
    },
    move : function() {
        var container = document.getElementById('rows-container');
        target = container.childNodes[this.calc()];
        var waypoint = document.getElementById('waypoint');
        target.appendChild(waypoint);
    }
};
//
var scrollEvent = {
    on: function(tmp) {
        window.addEventListener('scroll', function() {
            tmp.addItem();
        });
    },
    off: function() {
        window.removeEventListener('scroll', null);
    }
};
//
var zoomEvent = {
    anime: function(e) {
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;
        var zoom_container = document.getElementById('zoom-container');
        //
        var param = [
            {style: 'top', start: y, end: 0, unit: 'px'},
            {style: 'left', start: x, end: 0, unit: 'px'},
            {style: 'width', start: 0, end: 100, unit: '%'},
            {style: 'height', start: 0, end: 100, unit: '%'}
        ];
        new MyAnime(zoom_container, param, 100).then(function() {
            fade.in(download, 250);
        });
    }
};
//
function createZoom(data, event) {
    var zoom_container = document.getElementById('zoom-container');
    zoom_container.getElementsByClassName('item-image')[0].innerHTML = data.data;
    //
    var link = zoom_container.getElementsByClassName('link')[0];
    link.innerHTML = '<span>LINK</span><a href="//goo.gl/' + data.link + '" target="_blank">' + data.title + '</a>';
    //
    var a = document.getElementById('download').getElementsByTagName('a')[0];
    a.setAttribute('href', 'svg/' + data.url + '.svg');
    a.setAttribute('download', data.url + '.svg');
    var own = document.getElementById('own');
    if (data.own) {
        own.classList.add('own');
    } else {
        own.classList.remove('own');
    }
    zoomEvent.anime(event);
}
