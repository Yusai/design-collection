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
    console.log(data.index)
    var tmp = data.getJSON();
    if (tmp) {
        $('#item-container').append(
            $("<li class='item'></li>").append(
                $("<dl></dl>")
                    .append("<dt>Image</dt>").append("<dd>" + tmp.url + "</dd>")
                    .append(
                        $("<dt></dt>").append("<a href='" + tmp.url + "'>" + tmp.title + "</a>")
                    )
            )
        );
    } else {
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