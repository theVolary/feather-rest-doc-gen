var fs = require("fs");

module.exports = {

  generateHtml: function(options, cb) {
    var restDocs = require("./lib/restDocs");
    restDocs.init(function(templates) {
      var jsdom = require("jsdom");
      jsdom.env({
        html: templates.docTemplate,
        scripts: [
          "./lib/jquery.js"
        ],
        done: function(errors, window) {
          require("./lib/jquery.tmpl").init(window);
          var document = window.document,
              $ = window.jQuery;
          $.tmpl(templates.restApi, options.schema).appendTo($('#doc-container'));
          console.log("writing file to " + options.destDir + "/" + options.schema.name + ".html");
          fs.writeFileSync(options.destDir + "/" + options.schema.name + ".html", document.innerHTML);
          cb(errors ? errors : null);
        }
      });
    });
  }
};