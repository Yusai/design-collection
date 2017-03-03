//
function Waypoint() {
    var waypoint = $$('#waypoint');
    waypoint.on = function() {
        this.show();
    };
    waypoint.off = function() {
        scrollEvent.off();
        this.hide();
        //http://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
        var rows_container = $$('#rows-container ul');
        var maxHeight = Math.max(window.innerHeight, Math.max.apply(null, Array.prototype.slice.call(rows_container.el).map(function(ul) {
            return ul.clientHeight;
        })));
        var promise = [];
        for (var i = 0; i < rows_container.el.length; i++) {
            var param = {style : 'height', start: rows_container.el[i].clientHeight, end: maxHeight, unit: 'px'};
            promise[i] = new Promise(function(resolve, reject) {
                new MyAnime(rows_container.el[i], param, 100).then(function() {
                    resolve();
                });
            });
        };
        Promise.all(promise).then(function() {
            $$('#rows-container').addClass('stretch');
            for (var i = 0; i < rows_container.el.length; i++) {
                rows_container.el[i].style.height = '';
            }
        });
    };
    waypoint.calc = function() {
        var heightList = [];
        var children = $$('#rows-container').children();
        for (var i = 0; i < children.length(); i++) {
            heightList.push(children.el[i].clientHeight);
        }
        return heightList.indexOf(Math.min.apply(null, heightList));
    };
    waypoint.move = function() {
        $$('#rows-container').children(this.calc()).append(this);
    };
    waypoint.top = function() {
        return getOffset(this.el).top;
    };
    waypoint.move();
    return waypoint;
}
//
var scrollEvent = {
    on: function(e) {
        this.func = function() {
            e.addItem();
        };
        window.addEventListener('scroll', this.func, false);
    },
    off: function() {
        window.removeEventListener('scroll', this.func, false);
    }
};
//
var zoomEvent = {
    anime: function(e) {
        var x = e.pageX;
        var y = e.pageY - document.body.scrollTop;
        //
        var param = [
            {style: 'top', start: y, end: 0, unit: 'px'}, {style: 'left', start: x, end: 0, unit: 'px'},
            {style: 'width', start: 0, end: 100, unit: '%'}, {style: 'height', start: 0, end: 100, unit: '%'}
        ];
        new MyAnime($$('#zoom-container'), param, 100);
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
            .setAttr({href: '//goo.gl/' + data.link, target: '_blank'})
            .html(data.title)
        );
    //
    $$('#download a').setAttr({href: 'svg/' + data.url + '.svg', download: data.url + '.svg'});
    //
    var own = $$('#own');
    data.own && own.addClass('own') || own.removeClass('own');
    //
    zoomEvent.anime(event);
}
