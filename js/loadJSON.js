var json_data = (function() {
    var data = [];
    function loadJSON(fileObj) {
        if (fileObj.length == 0) {
            $("#loading").fadeToggle(250, function(){
                $("#menu").fadeToggle(250);
            });
        } else {
            var file = fileObj.pop();
            $.getJSON("json/" + file + ".json", function(json) {
                data.push({
                    dir: json.dir,
                    json: json.json,
                    index: 0,
                    getJSON: function() {
                        if (this.check()) {
                            var tmp = this.json[this.index];
                            this.index ++;
                        } else {
                            var tmp = false;
                        }
                        return tmp;
                    },
                    resetIndex: function() {
                        this.index = 0;
                    },
                    check: function() {
                        return (this.index < this.json.length);
                    }
                });
                loadJSON(fileObj);
            });
        }
        return data;
    }
    return loadJSON(['traced-a-photo', 'by-pioneer']);
})();