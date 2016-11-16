var fs = require('fs');
var http = require('http');

var dir = "./worksheet/";

var pathUtil = "utility.js";
var pathWeb = "webserver.js";
var pathPkg = "package.json";




/**
 * Create a file `webserver.js` within the worksheet folder.
 *
 * Reuse the code from the `http-add.js` example to implement
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


test(
  "Subtract two numbers for the path /subtract",
  function () {
    require(dir+pathWeb);
    var options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/subtract?a=2&b=3.4',
    };

    stop();

    var req = http.request(options, function(response) {
      equal(response.statusCode, 200, 'successful /subtract should return status code 200');
      var str = '';
      response.on('data', function(chunk) { str += chunk; });
      response.on('end', function() {
        equal(str.trim(), '-1.4', 'calling /subtract?a=2&b=3.4 returns -1.4');
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
 * Using `npm init`, create a `package.json` in
 * the worksheet folder. The name of the package should be worksheet
 * and `main` should be utility.js.
 */
test(
  "Use `npm init` in `worksheet` to create a file `" + pathPkg + "`",
  function () {
    try {
      fs.accessSync(dir+pathPkg, fs.F_OK);
      ok(true, pathPkg + " created");
    } catch (e) {
      ok(false, pathPkg + " is missing - please create it");
    }
});

test(
  "Use the right name and main in package.json.",
  function () {
    var package = require('./worksheet/package.json');
    equal(package.name, 'worksheet', "`worksheet/package.json` should have the name 'worksheet'.");
    equal(package.main, 'utility.js', "`worksheet/package.json` should have 'main' set to 'utility.js'.");
});



/**
 * Use the `npm install express --save` command in the `worksheet` directory
 * to install express. Do a similar thing to install the underscore package.
 */
test(
  "Use the express and underscore packages.",
  function () {
    var package = require('./worksheet/package.json');
    ok(package.dependencies, "`worksheet/package.json` should have dependencies.");
    ok(package.dependencies.express, "The express package should be a dependency in worksheet/package.json.");
    ok(package.dependencies.underscore, "The underscore package should be a dependency in worksheet/package.json.");
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
