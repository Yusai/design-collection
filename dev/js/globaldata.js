//
var globalData = {
    // index : 0,
    data: [],
    // rows: 0,
    // setIndex : function(index) {
    //     $('#rows-container').children().remove();
    //     $("#main").fadeIn(250);
    //     this.index = index;
    //     this.setRows();
    //     this.data[this.index].select();
    // },
    // getIndex : function() {
    //     return this.index;
    // },
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
        // this.rows = rows;
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
        //
        // var menu = $('#menu ul');
        // json.forEach(function(data, index) {
        //     globalData.data[index] = new Categorydata(data);
        //     menu.append('<li class="button"><span>' + data.dir + '</span></li>');
        //     data.dir = data.dir.replace(' ', '_');
        // });
        start();
    });
})();
