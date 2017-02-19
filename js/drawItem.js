var waypoint = (function() {
    return {
        on: function() {
            $('#item-container').append($("<li id='waypoint'><span class='anime-blink'>Now Loading...</span></li>"));
        },
        off: function() {
            $('#waypoint').remove();
        }
    };
})();

var scrollEvent = (function() {
    return {
        on: function(data) {
            $(window).on('scroll orientationchange', function() {
                addItem(data);
            });
        },
        off: function() {
            $(window).off('scroll orientationchange');
        }
    };
})();

function selectJSON(index) {
    var data = json_data[index];
    data.resetIndex();
    waypoint.on();
    addItem(data);
}

function loadItem(data) {
    console.log('index : %d', data.index);
    var tmp = data.getJSON();
    var dfd = $.Deferred();
    if (tmp) {
        var dl = $("<dl class='small' style='display:none;'></dl>");
        var target = $("<dd class='item-image'><span class='bold9 anime-blink'>Now Loading...</span></dd>")
        $('#waypoint').before(
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
        }).fail(function(data) {
            target.find('span').text('Image Not Found.');
        }).always(function() {
            dl.fadeIn(500);
            dfd.resolve();
        });
        return dfd.promise();
    } else {
        return dfd.reject();
    }
}

function addItem(data) {
    if (!data.check()) {
        console.log('item loaded')
        waypoint.off();
        scrollEvent.off();
        return;
    }
    //
    var waypointTop = $('#waypoint').offset().top;
    var scrollTop = $(document).scrollTop();
    if ((waypointTop - scrollTop + 32) < $(window).height()) {
        scrollEvent.off();
        loadItem(data)
            .done(function() {
                addItem(data);
                scrollEvent.on(data);
            })
            .fail(function() {
                console.log('error')
            });
    }
}