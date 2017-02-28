var fade = {
    anime: function(el, time, sw, func) {
        //true : in, false : out
        var anime = el.animate([
            {opacity: 0},
            {opacity: 100}
        ], {
            fill: 'forwards',
            direction: (function() {
                if (sw) {
                    el.style.display = '';
                    return 'normal';
                } else {
                    return 'reverse';
                }
            })(),
            duration: time
        });
        //
        anime.pause();
        anime.onfinish = function() {
            if (!sw) {
                el.style.display = 'none';
            }
            if (func) {
                func();
            }
        }
        anime.play();
    },
    in: function (el, time, func) {
        this.anime(el, time, true, func);
    },
    out: function (el, time, func) {
        this.anime(el, time, false, func);
    }
};

var append = function(target, html) {
    target.insertAdjacentHTML('beforeend', html);
};

// https://github.com/oneuijs/You-Dont-Need-jQuery#promises
// Native
function getOffset (el) {
  const box = el.getBoundingClientRect();

  return {
    top: box.top + window.pageYOffset - document.documentElement.clientTop,
    left: box.left + window.pageXOffset - document.documentElement.clientLeft
  };
}
// Deferred way
function deferred() {
  var deferred = {};
  var promise = new Promise(function(resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  deferred.promise = function() {
    return promise;
  };

  return deferred;
}
