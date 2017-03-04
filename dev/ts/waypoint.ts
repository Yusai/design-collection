/// <reference path="anime.ts" />
/// <reference path="event.ts" />
/// <reference path="myquery.ts" />
//

class Waypoint extends C {
    constructor(selector) {
        super(selector);
        this.move();
    }
    _on () {this.show();};
    off () {
        scrollEvent.off();
        this.hide();
        //http://stackoverflow.com/questions/222841/most-efficient-way-to-convert-an-htmlcollection-to-an-array
        var rows_container = $$('#rows-container ul');
        var maxHeight = Math.max(window.innerHeight, Math.max.apply(null, Array.prototype.slice.call(rows_container.el).map((ul) => {return ul.clientHeight;})));
        var promise = [];
        for (var i = 0; i < rows_container.el.length; i++) {
            var param = {style : 'height', start: rows_container.el[i].clientHeight, end: maxHeight, unit: 'px'};
            promise.push(new Promise((resolve, reject) => {
                anime(rows_container.el[i], param, 100).then(() => {resolve();});
            }));
        };
        Promise.all(promise).then(() => {
            $$('#rows-container').addClass('stretch');
            for (var i = 0; i < rows_container.el.length; i++) {
                rows_container.el[i].style.height = '';
            }
        });
    }
    calc () {
        var heightList = [];
        var children = $$('#rows-container').children();
        for (var i = 0; i < children.length(); i++) {
            heightList.push(children.el[i].clientHeight);
        }
        return heightList.indexOf(Math.min.apply(null, heightList));
    }
    move () {
        $$('#rows-container').children(this.calc()).append(this);
    }
    top () {
        return this.offset().top;
    }
}
