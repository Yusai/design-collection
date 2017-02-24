//
var globalData = {
    index : 0,
    data: [],
    rows: 0,
    setIndex : function(index) {
        $('#rows-container').children().remove();
        $("#main").fadeIn(250);
        this.index = index;
        this.setRows();
        this.data[this.index].select();
    },
    getIndex : function() {
        return this.index;
    },
    setRows : function() {
        var rows = Math.floor($('html').width() / 180);
        if (rows == 0) {
            rows = 1;
        }
        this.rows = rows;
        //
        for (var i = 0; i < this.rows; i++) {
            $('#rows-container').append('<ul class="item-container"></ul>');
        }
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
