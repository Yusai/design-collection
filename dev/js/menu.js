//
$('#zoom-container .item-image').on('click', function() {
    $('#download').fadeOut(100);
    $('#zoom-container').fadeOut(100, function() {
        zoomEvent.off();
    });
});
//
function start() {
    //
    $('#menu .button').each(function(index) {
        $(this).on('click', function() {
            console.log('--click')
            //分割しないとコールバックを2回呼ぶバグが発生するので
            //$("#menu, h1").fadeOut(250, function() {...とは書けない
            $("h1").fadeOut(250);
            $("#menu").fadeOut(250, function() {
                $('h1').addClass('small').fadeIn(250);
                globalData.start();
            });
        });
    });
    //
    $("#loading").fadeToggle(250, function(){
        $("#menu").fadeToggle(250);
    });
}