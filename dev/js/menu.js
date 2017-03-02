//
function start() {
    var menu = $$('#menu');
    var promise = new Promise(function(resolve) {
        //
        $$('#menu .button').on('click', function() {
            var h1 = $$('h1');
            fade.out(h1.el[0], 250);
            fade.out(menu, 250).then(function() {
                menu.remove();
                h1.addClass('small');
                fade.in(h1.el[0], 250);
                resolve();
            });
        });
    });
    var loading = $$('#loading');
    fade.out(loading, 250).then(function() {
        loading.remove();
        fade.in(menu, 250);
        //
        $$('#zoom-container .item-image').on('click', function() {
            fade.out($$('#zoom-container'), 100);
        });
    });
    //
    return promise;
}
//
(function() {
    var request = new XMLHttpRequest();
    request.open('get', 'json/data.json', true);
    request.onload = function(event) {
        if (request.status >= 200 && request.status < 400) {
            //success
            var json = JSON.parse(request.responseText);
            start().then(function() {
                console.log(new Collection(json));
            });
        }
    }
    request.send(null);
})();