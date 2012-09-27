#!/usr/bin/env node

var fs = require("fs"),
    path = require("path"),
    //color = require("colorize"),
    cli = require("cli").enable('status'),
    _ = require("underscore")._,
    util = require("util"),
    schemaGen = require("feather-rest-descriptor"),
    docGen = require("../index.js");

var cliOptions = {
  input: ['i', 'Input path.  REQUIRED.  Can be a directory, .js file, or .json file.', 'path', null],
  output: ['o', 'Output path.  If omitted, output will be sent to stdout.', 'path', null],
  consolidate: ['c', 'Consolidate output into one HTML document.  This only makes sense if input is a directory.', 'boolean', false]
};

cli.parse(cliOptions);

var handleDirectoryInput = function(dir, interface, outputLocation, consolidate) {
  schemaGen.generateSchemas({
    restFolder: dir,
    interface: interface
  }, function(err, schemas) {
    if (err) {
      cli.error(err);
    } else {
      docGen.generateHtml({
        schemas: schemas,
        destFile: outputLocation,
        consolidate: consolidate
      }, function(err, document) {
        if (err) {
          cli.error(err);
        } else if (document) {
          console.log(document);
        }
        cli.ok("Generation complete.");
      });
    }
  });
};

var handleSchemaInput = function(file, outputLocation) {
  var data = JSON.parse(fs.readFileSync(file, 'utf8'));
  docGen.generateHtml({
    schema: data,
    destFile: outputLocation
  }, function(err, document) {
    if (err) {
      cli.error(err);
    } else if (document) {
      console.log(document);
    }
    cli.ok("Generation complete.");
  });
};

cli.main(function(args, options) {
  cli.debug("Parsed options are: " + util.inspect(options));

    if (!fs.existsSync(options.input)) {
      cli.error("Input path '" + options.input + "' does not exist");
      cli.getUsage();
    } else {

      // check out the input path.  If it is a json file, treat it as a schema.  
      // If it is a js file, treat it as a REST file.  If it is a folder, treat it 
      // as a folder of REST files.

      var stat = fs.statSync(options.input);
      
      if (stat.isDirectory()) {
        cli.ok("Generating documents for all interfaces in " + options.input);
        handleDirectoryInput(options.input, 'all', options.output, options.consolidate);

      } else if (path.extname(options.input) === '.js') {
        cli.ok("Generating documents for " + options.input);
        handleDirectoryInput(options.input, path.basename(options.input), options.output, false);

      } else if (path.extname(options.input) === '.json') {
        handleSchemaInput(options.input, options.output);

      } else {
        cli.error("Unrecognized input format.  Expecting a directory, .js, or .json file.");
      }
    }
});