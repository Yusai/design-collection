function selectJSON(index) {
    var data = json_data[index];
    data.resetIndex();
    addItemFirst(data);
    $(window).scroll(function() {
        var waypointTop = $('#waypoint').offset().top;
        var scrollTop = $(document).scrollTop();
        if ((waypointTop - scrollTop + 64) < $(window).height()) {
            loadItem(data);
        }
    });
}

function loadItem(data) {
    var tmp = data.getJSON();
    if (tmp) {
        var dl = $("<dl class='small' style='display:none;'></dl>");
        var target = $("<dd class='item-image'><span class='bold9 anime-blink'>Now Loading...</span></dd>")
        $('#item-container').append(
            $("<li class='item'></li>").append(
               dl
                    .append("<dt class='bold9'>Image</dt>")
                    .append(target)
                    .append("<dt class='bold9'>Source</dt>")
                    .append("<dd class='link'><a href='//goo.gl/" + tmp.url + "' target='_blank'>" + tmp.title + "</a></dd>")
            )
        );
        target.load('svg/' + data.dir + "/" + tmp.svg + '.svg', function () {
            dl.fadeIn(500);
        });
    }
    if (!data.check()) {
        $('#waypoint').hide();
        $(window).off('scroll');
    }
    return tmp;
}

function addItemFirst(data) {
    var beforeHeight = $(document).height();
    if (loadItem(data)) {
        if (beforeHeight > $('#waypoint').offset().top) {
            arguments.callee(data);
        }
    }
}
