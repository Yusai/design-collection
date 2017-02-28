(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function MyAnime(el, param, time) {
    var startTime = Date.now();
    //
    param.forEach(function(e) {
        el.style[e.style] = '' + e.start + e.unit;
    });
    el.style.display = '';
    //
    var promise = new Promise(function(resolve) {
        //
        function step() {
            var progress = Date.now() - startTime;
            if (progress < time) {
                //
                param.forEach(function(e) {
                    el.style[e.style] = '' + (e.start + (e.end - e.start) * (progress / time)) + e.unit;
                });
                //
                requestAnimationFrame(step);
            } else {
                param.forEach(function(e) {
                    el.style[e.style] = '' + e.end + e.unit;
                })
                resolve();
            }
        }
        //
        requestAnimationFrame(step);
    });
    return promise;
}

function Fade(el, time, sw) {
    if (sw) {
        el.style.opacity = 0;
        el.style.display = '';
        var param = [{style: 'opacity', start: 0, end: 1, unit: ''}];
    } else {
        var param = [{style: 'opacity', start: 1, end: 0, unit: ''}];
    }
    var anime = new MyAnime(el, param, time);
    anime.then(function() {
        el.style.opacity = '';
        if (!sw) {
            el.style.display = 'none';
        }
    });
    return anime;
}

var fade = {
    in: function(el, time) {
        return new Fade(el, time , true);
    },
    out: function(el, time) {
        return new Fade(el, time, false);
    }
};
