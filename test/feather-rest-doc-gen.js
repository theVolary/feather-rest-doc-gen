var frdg = require("../index"),
    fs = require("fs");

describe('FeatherRestDocGen', function() {

  var schema = {"name":"rest-test","endpoints":[{"nickname":"test","description":"rest test endpoint","notes":"These are some notes on the rest endpoint.","parameters":{"qs":[{"name":"fakeParam","type":"integer","description":"This isn't a real parameter."},{"name":"fakeParam2","description":"Neither is this one."}]},"uri":"/:wickedCoolEndpoint/","verb":"get","verbLabel":"info"},{"uri":"/:updateSomeStuff","verb":"post","verbLabel":"success"}]};

  describe('Schema Doc Gen', function() {
    it('should generate an HTML file', function(done) {
      frdg.generateHtml({ schema: schema, destDir: __dirname + "/dest" }, function(err) {

        if (err) throw err;
        
        fs.exists(__dirname + "/dest/rest-test.html", function(exists) {
          exists.should.equal(true);
        });
        done();
      });
    });
  });
});