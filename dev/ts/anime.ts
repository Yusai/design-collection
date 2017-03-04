//
function anime(target, param, time) {
    var param = param.length ? param : [param];
    //
    var el = target.el || target;
    //
    var startTime = Date.now();
    //
    param.forEach((e) => {
        el.style[e.style] = '' + e.start + e.unit;
    });
    el.style.display = '';
    //
    return new Promise((resolve, reject) => {
        function step() {
            var progress = Date.now() - startTime;
            if (progress < time) {
                param.forEach((e) => {el.style[e.style] = '' + (e.start + (e.end - e.start) * (progress / time)) + e.unit;});
                //
                requestAnimationFrame(step);
            } else {
                param.forEach((e) => {el.style[e.style] = '' + e.end + e.unit;});
                //
                resolve();
            }
        }
        requestAnimationFrame(step);
    });
}
