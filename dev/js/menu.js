//
function start() {
    // var dfd = $.Deferred();
    // //
    // $('#menu .button').each(function(index) {
    //     $(this).on('click', function() {
    //         console.log('--click')
    //         //分割しないとコールバックを2回呼ぶバグが発生するので
    //         //$("#menu, h1").fadeOut(250, function() {...とは書けない
    //         $("h1").fadeOut(250);
    //         $("#menu").fadeOut(250, function() {
    //             $('h1').addClass('small').fadeIn(250);
    //             dfd.resolve();
    //             // globalData.start();
    //         });
    //     });
    // });
    // //
    // $("#loading").fadeOut(250, function(){
    //     $('#loading').remove();
    //     $("#menu").fadeIn(250);
    // });
    // return dfd.promise();
    var promise = new Promise(function(resolve) {
        //
        var menu = document.getElementById('menu');
        var button = menu.getElementsByClassName('button')[0];
        button.addEventListener('click', function() {
            var h1 = document.getElementsByTagName('h1')[0];
            fade.out(h1, 250);
            fade.out(menu, 250).then(function() {
                h1.classList.add('small');
                fade.in(h1, 250);
                resolve();
            });
        });
    });
    // fadeOut(loading, 250, false).onfinish(function() {
    //     loading.remove();
    //     fade(document.getElementById('menu', 250));
    // });
    var loading = document.getElementById('loading');
    // fade.out(loading, 250, function() {
    //     loading.remove();
    //     fade.in(document.getElementById('menu'), 250);
    // });
    fade.out(loading, 250).then(function() {
        loading.remove();
        fade.in(document.getElementById('menu'), 250);
    });
    //
    return promise;
}
//
// (function() {
//     $.getJSON("json/data.json", function(json) {
//         start().done(function() {
//             console.log(new Collection(json));
//         });
//     });
// })();

(function() {
    var request = new XMLHttpRequest();
    request.open('get', 'json/data.json', true);
    request.onload = function(event) {
        if (request.status >= 200 && request.status < 400) {
            //success
            var json = JSON.parse(request.responseText);
            // start().done(function() {
            //     console.log(new Collection(json));
            // });
            start().then(function() {
                console.log(new Collection(json));
            });
        }
    }
    request.send(null);
})();