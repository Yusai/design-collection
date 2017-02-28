//
function start() {
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
    var loading = document.getElementById('loading');
    fade.out(loading, 250).then(function() {
        loading.remove();
        fade.in(document.getElementById('menu'), 250);
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