//
$('#menu .button').each(function(index) {
    $(this).on('click', function() {
        $('h1').fadeOut(250);
        $("#menu").fadeOut(250, function() {
            $('h1').addClass('small').fadeIn(250);
            globalData.setIndex(index);
        });
    });
});
//
$('#close').on('click', function() {
    $("#main").fadeOut(250, function() {
        $('#waypoint').hide();
        $("#menu").fadeIn(250);
        $('h1').removeClass('small');
    });
});
//
$('#zoom-container .item-image').on('click', function() {
    $('#zoom-container').fadeOut(100, function() {
        zoomEvent.off();
    });
});
//
function start() {
    $("#loading").fadeToggle(250, function(){
        $("#menu").fadeToggle(250);
    });
}