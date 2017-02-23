//
// function SingleData(json) {
//     this.dir = json.dir;
//     this.json = json.json;
//     this.index = 0;
// }
// SingleData.prototype.getJSON = function() {
//     if (this.check()) {
//         var tmp = this.json[this.index];
//         this.index ++;
//     } else {
//         var tmp = false;
//     }
//     return tmp;
// }
// SingleData.prototype.resetIndex = function() {
//     this.index = 0;
// }
// SingleData.prototype.check = function() {
//     return (this.index < this.json.length);
// }
//
// function loadJson(file) {
//     var dfd = $.Deferred();
//     $.getJSON("json/" + file + ".json", function(json) {
//         data.push(new SingleData(json));
//         dfd.resolve();
//     });
//     return dfd.promise();
// }
//
// new (function(fileList) {
//     //
//     this.index = 0;
//     this.data = [];
//     //
//     var global = this;
//     //
//     var dfds = [];
//     fileList.forEach(function(file, num) {
//         var dfd = $.Deferred();
//         $.getJSON("json/" + file + ".json", function(json) {
//             global.data[num] = {
//                 index : 0,
//                 json : json
//             };
//             dfd.resolve();
//         });        
//         dfds.push(dfd.promise());
//     });
//     $.when.apply($, dfds).then(function() {
//         console.log(global);
//         start();
//     });
//     //
//     $("#menu .button").click(function() {
//         selectMenu(this)
//             .done(function(index) {
//                 selectJSON(index);
//             });
//     });
// })(['by-pioneer', 'traced-a-photo']);

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

// var json_data = (function() {
//     var data = [];
//     function loadJSON(files) {
//         if (files.length == 0) {
//             $("#loading").fadeToggle(250, function(){
//                 $("#menu").fadeToggle(250);
//             });
//         } else {
//             var file = files.pop();
//             $.getJSON("json/" + file + ".json", function(json) {
//                 data.push(new SingleData(json));
//                 loadJSON(files);
//             });
//         }
//         return data;
//     }
//     return loadJSON(['traced-a-photo', 'by-pioneer']);
// })();