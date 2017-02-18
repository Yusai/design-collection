$("#menu .button").click(function() {
    var index = $("#menu .button").index(this);
    $("#menu").fadeOut(250, function() {
        $("#main").fadeIn(250, function() {
            $('#waypoint').show();
            selectJSON(index);
        });
        $('h1').addClass('small');
    });
});

$('#close').click(function() {
    $("#main").fadeOut(250, function() {
        $('#waypoint').hide();
        $("#menu").fadeIn(250);
        $('h1').removeClass('small');
        $('#item-container').html("");
    });
});