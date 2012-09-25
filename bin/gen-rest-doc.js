#!/usr/bin/env node

var docGen = require("../index.js"),
    fs = require('fs');

var readline = function (encoding, callback) {
    if (typeof encoding === 'function') {
        callback = encoding;
        encoding = 'utf8';
    }
    var stream = process.openStdin(), 
      data = '';
    stream.setEncoding(encoding);
    var listener = function (chunk) {
        data += chunk;
        if (data.indexOf('\n') >= 0) {
          var endIndex = data.indexOf('\n');
          var output = data.substr(0, endIndex).replace(/(\r)+$/, '');
          // Cleanup the stream.
          stream.removeListener('data', listener);
          stream.pause();
          // Return the output.
          callback(output);
        }
    };
    stream.on('data', listener);
};


if (process.argv.length <= 2) {
  console.log('Usage: gen-rest-doc /input/path.json /output/path.html');
  process.exit();
}

var inFile = process.argv[2];
var outFile = process.argv[3] || 'out.html';
var data = JSON.parse(fs.readFileSync(inFile, 'utf8'));

docGen.generateHtml({ schema: data, destFile: outFile }, function(errs) {
  if (errs) {
    var i = 0;
    for (i = 0; i < errs.length; i++) {
      console.error(errs[i]);
    }
  } else {
    console.log('Generation complete!');
  }
});