//
var scrollEvent = {
    on: function(e) {
        this.func = () => {e.addItem();};
        window.addEventListener('scroll', this.func, false);
    },
    off: function() {
        window.removeEventListener('scroll', this.func, false);
    }
};
//
var zoomEvent = {
    anime: (e) => {
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;
        //
        var param = [
            {style: 'top', start: y, end: 0, unit: 'px'}, {style: 'left', start: x, end: 0, unit: 'px'},
            {style: 'width', start: 0, end: 100, unit: '%'}, {style: 'height', start: 0, end: 100, unit: '%'}
        ];
        anime($$('#zoom-container'), param, 100);
    }
};
//
function createZoom(data, event) {
    //
    $$('#zoom-container .item-image').html(data.data);
    //
    $$('#link').html()
        .append($$('$$span').html('LINK'))
        .append($$('$$a')
            .setAttr({href: `//goo.gl/${data.link}` , target: '_blank'})
            .html(data.title)
        );
    //
    $$('#download a').setAttr({href: `svg/${data.url}.svg`, download: `${data.url}.svg`});
    //
    var own = $$('#own');
    data.own && own.addClass('own') || own.removeClass('own');
    //
    zoomEvent.anime(event);
}
