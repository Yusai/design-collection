//
$('#menu .button').each(function(index) {
    $(this).on('click', function() {
        $('h1').fadeOut(250);
        $("#menu").fadeOut(250, function() {
            $('h1').addClass('small').fadeIn(250);
            $("#main").fadeIn(250, function() {
                globalData.setIndex(index);
            });
        });
    });
});
//
$('#close').on('click', function() {
    $("#main").fadeOut(250, function() {
        $('#waypoint').hide();
        $("#menu").fadeIn(250);
        $('h1').removeClass('small');
        $('#item-container').html("");
    });
});
//
$('#zoom-container .item-image').on('click', function() {
    zoomEvent.off();
    $('#item-container, #close').fadeIn(250);
    $('#zoom-container').fadeOut(250);
});
//
function start() {
    $("#loading").fadeToggle(250, function(){
        $("#menu").fadeToggle(250);
    });
}
