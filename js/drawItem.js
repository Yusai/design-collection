function checkWaypoint() {
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    console.log(waypointTop - scrollTop + 32);
    console.log($(window).height())
    return (waypointTop - scrollTop + 32) < $(window).height();
}

function selectJSON(index) {
    var data = json_data[index];
    data.resetIndex();
    addItem(data);
    $(window).scroll(function() {
        if (checkWaypoint()) {
            addItem(data);
        }
    });
}

var loadItem = function(data) {
    var tmp = data.getJSON();
    if (!data.check()) {
        $('#waypoint').hide();
        $(window).off('scroll');
    }
    //
    if (tmp) {
        var dl = $("<dl class='small' style='display:none;'></dl>");
        var dfd = $.Deferred();
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
        $.ajax({
            type: 'get',
            url: 'svg/' + data.dir + '/' + tmp.svg + '.svg',
            dataType: 'xml',
        }).done(function(data) {
            target.html($(data).find('svg'));
            dfd.resolve();
        }).fail(function(data) {
            target.find('span').text('Image Not Found.');
            dfd.reject();
        }).always(function() {
            dl.fadeIn(500);
        });
        return dfd.promise();
    } else {
        return false;
    }
}

function addItem(data) {
    //画面内にwaypointがいたらアイテムを追加する
    if (checkWaypoint()) {
        loadItem(data).then(function() {
            addItem(data);
        });
    }
}