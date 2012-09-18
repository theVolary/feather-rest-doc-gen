var fs = require("fs");

module.exports = {

  init: function(cb) {
    var templates = {},
    sem = {
      i: 2,
      execute: function() {
        this.i -= 1;
        if (this.i === 0) cb(templates);
      }
    };
    fs.readFile(__dirname + "/docTemplates/rest.html", function(err, data) {
      templates.docTemplate = err ? err.toString() : data.toString();
      sem.execute();
    });

    fs.readFile(__dirname + "/docTemplates/restApi.html", function(err, data) {
      templates.restApi = err ? err.toString() : data.toString();
      sem.execute();
    });
  }

};