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
              $ = window.jQuery, 
              i = 0,
              output = {},
              destStat = null;
          
          if (options.destFile) {
            destStat = fs.statSync(options.destFile);
          }

          if (options.schemas) {
            var currFile;
            for (i = 0; i < options.schemas.length; i++) {
              $.tmpl(templates.restApi, options.schemas[i]).appendTo($('#doc-container'));
              if (! options.consolidate) {
                if (destStat && destStat.isDirectory()) {
                  currFile = options.destFile + "/" + options.schemas[i].name + ".html", document.innerHTML;
                  console.log("writing file to " + currFile);
                  fs.writeFileSync(currFile, document.innerHTML);
                } else {
                  output[options.schemas[i].name] = document.innerHTML;
                }
                $('#doc-container').empty();
              }
            }
          } else {
            $.tmpl(templates.restApi, options.schema).appendTo($('#doc-container'));
          }
          if (options.consolidate && options.destFile) {
            var df = options.destFile;
            if (destStat && destStat.isDirectory()) {
              df = df + "/rest-docs.html";
            }
            console.log("writing file to " + df);
            fs.writeFileSync(df, document.innerHTML);
          }
          if (!options.consolidate && ! options.destFile) {
            cb(errors ? errors : null, output);
          } else {
            cb(errors ? errors : null, (options.destFile ? null : document.innerHTML));
          }
        }
      });
    });
  }
};