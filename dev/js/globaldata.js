//
var globalData = {
    data: [],
    init: function(data) {
        this.data = new Categorydata(data);
        this.setRows();
    },
    start: function() {
        console.log('global start');
        var _this = this;
        $('#main').fadeIn(250, function() {
            _this.data.start();
        });
    },
    orient: function() {
        $('#rows-container').children().remove();
        this.setRows();
        this.data.start();
    },
    setRows : function() {
        var rows = Math.floor($('html').width() / 160);
        if (rows == 0) {
            rows = 1;
        }
        //
        for (var i = 0; i < rows; i++) {
            $('#rows-container').append('<ul class="item-container"></ul>');
        }
    }
};
console.log(globalData);
//
(function(fileList) {
    $.getJSON("json/data.json", function(json) {
        globalData.init(json);
        start();
    });
})();
