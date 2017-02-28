//
function start() {
    var dfd = $.Deferred();
    //
    $('#menu .button').each(function(index) {
        $(this).on('click', function() {
            console.log('--click')
            //分割しないとコールバックを2回呼ぶバグが発生するので
            //$("#menu, h1").fadeOut(250, function() {...とは書けない
            $("h1").fadeOut(250);
            $("#menu").fadeOut(250, function() {
                $('h1').addClass('small').fadeIn(250);
                dfd.resolve();
                // globalData.start();
            });
        });
    });
    //
    $("#loading").fadeOut(250, function(){
        $('#loading').remove();
        $("#menu").fadeIn(250);
    });
    return dfd.promise();
}
//
(function() {
    $.getJSON("json/data.json", function(json) {
        start().done(function() {
            console.log(new Collection(json));
        });
        // globalData.init(json);
        // start();
    });
})();
