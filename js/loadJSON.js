var json_data = (function() {
    var data = [];
    function loadJSON(fileList) {
        if (fileList.length == 0) {
            $("#loading").fadeToggle(250, function(){
                $("#menu").fadeToggle(250);
            });
        } else {
            $.getJSON("json/" + fileList.pop() + ".json", function(json) {
                data.push({
                    json: json,
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
                loadJSON(fileList);
            });
        }
        return data;
    }
    return loadJSON(['traced-a-photo', 'by-pioneer']);
})();