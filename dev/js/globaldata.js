//
var globalData = {
    index : 0,
    data: [],
    setIndex : function(index) {
        this.index = index;
        this.data[this.index].select();
    }
};
//
(function(fileList) {
    var dfds = [];
    fileList.forEach(function(file, num) {
        var dfd = $.Deferred();
        $.getJSON("json/" + file + ".json", function(json) {
            globalData.data[num] = new Categorydata(json);
            dfd.resolve();
        });
        dfds.push(dfd.promise());
    });
    $.when.apply($, dfds).then(function() {
        console.log(globalData);
        start();
    });
})(['by-pioneer', 'traced-a-photo']);
