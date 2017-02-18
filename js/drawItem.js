function selectJSON(index) {
    var data = json_data[index];
    data.resetIndex();
    addItemFirst(data);
    $(window).scroll(function() {
        var waypointTop = $('#waypoint').offset().top;
        var scrollTop = $(document).scrollTop();
        if ((waypointTop - scrollTop + 96) < $(window).height()) {
            loadItem(data);
        }
    });
}

function loadItem(data) {
    var tmp = data.getJSON();
    if (tmp) {
        var target = $("<dd class='item-image'><span class='bold9 anime-blink'>Now Loading...</span></dd>")
        $('#item-container').append(
            $("<li class='item'></li>").append(
                $("<dl class='small'></dl>")
                    .append("<dt class='bold9'>Image</dt>")
                    .append(target)
                    .append("<dt class='bold9'>Source</dt>")
                    .append("<dd class='link'><a href='" + tmp.url + "'>" + tmp.title + "</a></dd>")
            )
        );
        loadSVG(target, tmp.svg);
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

function loadSVG(target, file) {
    console.log(target);
    console.log(file);
    var svg = {};
    target.load('svg/nypl/' + file + '.svg');
    return svg;
}