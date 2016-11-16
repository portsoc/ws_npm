var fs = require('fs');
var http = require('http');

var dir = "./worksheet/";

var pathUtil = "utility.js";
var pathWeb = "webserver.js";

/**
 * Create a file `utility.js` within
 * the worksheet folder.
 */
test(
  "Create a file `" + pathUtil + "`",
  function () {
    try {
      fs.accessSync(dir+pathUtil, fs.F_OK);
      ok(true, pathUtil + " created");
    } catch (e) {
      ok(false, pathUtil + " is missing - please create it");
    }
});




/**
 * todo comment
 */ 
test(
  "Use the underscore package.",
  function () {
    var _ = require('underscore');
    ok(_, "The underscore package should be installed.");
    var package = require('./package.json');
    ok(package.dependencies.underscore, "The underscore package should be a dependency of ws_npm.");
});




/**
 * todo comment
 */
test(
  "Create a range function.",
  function () {
    var util = require(dir+pathUtil);
    equal(util.range([4,3]), 1, "[4,3] has a range of 1");
    equal(util.range([3]), 0, "[3] has a range of 0");
    equal(util.range([3, -1, 5]), 6, "[3, -1, 5] has a range of 6");
    // todo check that underscore.max and underscore.min are in use
});



/**
 * Create a file `webserver.js` within the worksheet folder.
 *
 * Reuse the code from the `http-express.js` example to implement
 * a web server that can listen on port 8080.
 *
 * The server should respond to requests on `/subtract`, accepting
 * two  parameters, `a` and `b`, and returning the difference
 * between them as a plain text response.
 * e.g. '/subtract?a=2&b=3.4' should return -1.4
 * e.g. '/subtract?a=100&b=9' should return 91
 * e.g. '/subtract?b=300&a=200' should return -100
 *
 * If a path other than /subtract is requested a 404 error should be returned.
 *
 * Running the tests starts your web server, but if you want to try it in
 * your browser, you need to start the webserver explicitly, with the command
 * `node worksheet/webserver`
 */
test(
  "Create a file `" + pathWeb + "`",
  function () {
    try {
      fs.accessSync(dir+pathWeb, fs.F_OK);
      ok(true, pathWeb + " created");
    } catch (e) {
      ok(false, pathWeb + " is missing - please create it");
    }
});


// todo adapt the tests to /subtract
// todo also check that express is being used (can we check that?)
test(
  "Add two numbers for the path /add",
  function () {
    require(dir+pathWeb);
    var options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/add?a=2&b=3.4',
    };

    stop();

    var req = http.request(options, function(response) {
      equal(response.statusCode, 200, 'successful /add should return status code 200');
      var str = '';
      response.on('data', function(chunk) { str += chunk; });
      response.on('end', function() {
        equal(str.trim(), '5.4', 'calling /add?a=2&b=3.4 returns 5.4');
        start();
      });
    });
    req.on('error', function (e) {
      ok(false);
      start();
    });
    req.end();
  }
);



test(
  "Return a 404 for all non-existent paths",
  function () {
    require(dir+pathWeb);
    var options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/nothere',
    };

    expect(1);
    stop();

    var req = http.request(options, function(response) {
      equal(response.statusCode, 404, 'server should return 404 for /nothere');
      start();
    });
    req.on('error', function (e) {
      ok(false);
      start();
    });
    req.end();
  }
);