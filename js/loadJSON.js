var json_data = (function() {
    var data = [];
    function loadJSON(fileObj) {
        if (fileObj.length == 0) {
            $("#loading").fadeToggle(250, function(){
                $("#menu").fadeToggle(250);
            });
        } else {
            var obj = fileObj.pop();
            $.getJSON("json/" + obj.file + ".json", function(json) {
                data.push({
                    dir: obj.dir,
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
                loadJSON(fileObj);
            });
        }
        return data;
    }
    return loadJSON([
        {
            file: 'traced-a-photo',
            dir: 'photo'
        },
        {
            file: 'by-pioneer',
            dir: 'pioneer'
        }
    ]);
})();