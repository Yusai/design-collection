//
(() => {
    //
    function start() {
        var menu = $$('#menu');
        //
        var loading = $$('#loading');
        loading.fadeOut(250).then(() => {
            loading.remove();
            menu.fadeIn(250);
            //
            $$('#zoom-container .item-image').on('click', () => {
                $$('#zoom-container').fadeOut(100);
            });
        });
        //
        return new Promise((resolve) => {
            $$('#menu .button').on('click', () => {
                var h1 = $$('h1');
                h1.fadeOut(250);
                menu.fadeOut(250).then(() => {
                    menu.remove();
                    h1.addClass('small').fadeIn(250);
                    resolve();
                });
            });
        });
    }
    //
    var request = new XMLHttpRequest();
    request.open('get', 'dist/list.json', true);
    request.onload = (event) => {
        if (request.status >= 200 && request.status < 400) {
            //success
            var json = JSON.parse(request.responseText);
            start().then(() => console.log(new Collection(json)));
        }
    }
    request.send(null);
})();