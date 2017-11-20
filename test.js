'use strict';
const fs = require('fs');
const http = require('http');

const dir = "./worksheet/";

const pathUtil = "utility.js";
const pathWeb = "webserver.js";
const pathPkg = "package.json";


QUnit.module("Web Server");

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
 *
 * Use the `npm install underscore --save` command in the `worksheet` directory.
 */
QUnit.test(
  "Create a file `" + pathWeb + "` in `" + dir + "`",
  function () {
    try {
      // Try to access the file.  If it is there, we can continue to
      // the next line.  If it is NOT there, an error will be thrown.
      fs.accessSync(dir + pathWeb, fs.F_OK);
      ok(true, pathWeb + " created");
    } catch (e) {
      ok(false, pathWeb + " is missing - please create it");
    }
  });


QUnit.test(
  "Subtract two numbers for the path /subtract",
  function () {
    // this is the file you created in the Web Server task
    // when we 'require' it, it loads and runs.
    require(dir + pathWeb);

    // begin stalling (we use stop() and start() in QUnit
    // // to hand tests that feature callbacks.
    stop();

    // build an options object that can be used to make an HTTP request
    const options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/subtract?a=2&b=3.4',
    };

    //make the http request to the server.
    const req = http.request(options, function (response) {
      equal(response.statusCode, 200, 'A successful call to /subtract should return a status code of 200');
      let str = '';

      response.on('data', function (chunk) {
        // combine the parts of the response (if it happens to be sent in parts)
        str += chunk;
      });

      response.on('end', function () {
        // when the last part arrives we can quit stalling.
        equal(str.trim(), '-1.4', 'Test that calling /subtract?a=2&b=3.4 returns -1.4');
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


QUnit.test(
  "Return a 404 for all non-existent paths",
  function () {
    require(dir + pathWeb);
    const options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/nothere',
    };

    expect(1);
    stop();

    const req = http.request(options, function (response) {
      equal(response.statusCode, 404, 'The server should return 404 for /nothere');
      start();
    });
    req.on('error', function (e) {
      ok(false);
      start();
    });
    req.end();
  }
);





QUnit.module("Packages");
/**
 * Using `npm init`, create a `package.json` in the worksheet folder.
 * The name of the package should be worksheet and `main` should be `utility.js`.
 *
 * Create the file `utility.js` within the worksheet folder.
 * In that file export a function called `range` that takes one parameter,
 * an array of numbers.
 *
 * To implement the function, find the `underscore` package in npm and use
 * its `max` and `min` functions to return the range of the provided array,
 * i.e. its maximal value minus its minimal value;
 *
 * Use the `npm install underscore --save` command in the `worksheet` directory.
 */
QUnit.test(
  "Create a file `" + pathUtil + "`",
  function () {
    try {
      fs.accessSync(dir + pathUtil, fs.F_OK);
      ok(true, pathUtil + " created");
    } catch (e) {
      ok(false, pathUtil + " is missing - please create it");
    }
  });


QUnit.test(
  "Use `npm init` in `" + dir + "` to create a file `" + pathPkg + "`",
  function () {
    try {
      fs.accessSync(dir + pathPkg, fs.F_OK);
      ok(true, pathPkg + " created");
    } catch (e) {
      ok(false, pathPkg + " is missing - please create it");
    }
  });


QUnit.test(
  "Use the right name and main in " + pathPkg + ".",
  function () {
    const pkg = require('./worksheet/package.json');
    equal(pkg.name, 'worksheet', "`worksheet/package.json` should have the name 'worksheet'.");
    equal(pkg.main, 'utility.js', "`worksheet/package.json` should have 'main' set to 'utility.js'.");
  });


QUnit.test(
  "Use the express and underscore packages.",
  function () {
    const pkg = require('./worksheet/package.json');
    const deps = pkg.dependencies;
    ok(deps, "`worksheet/package.json` should have dependencies.");
    ok(deps && deps.express, "The express package should be a dependency in worksheet/package.json.");
    ok(deps && deps.underscore, "The underscore package should be a dependency in worksheet/package.json.");

    let express;
    try {
      express = require('./worksheet/node_modules/express');
    } catch (e) {}
    ok(express, 'express should be installed inside worksheet');

    let _;
    try {
      _ = require('./worksheet/node_modules/underscore');
    } catch (e) {}
    ok(_, 'underscore should be installed inside worksheet');
  });


QUnit.test(
  "Create a `range` function that accepts an array and returns the size of the range between the largest and smallest numbers.",
  function () {
    const util = require(dir + pathUtil);
    let _;
    try {
      _ = require('./worksheet/node_modules/underscore');
    } catch (e) {
      _ = require('underscore');
    }

    // instrument underscore min and max to count how often they are called
    const oldMin = _.min;
    const oldMax = _.max;
    let minCount = 0;
    let maxCount = 0;
    _.min = function (arr) {
      minCount++;
      return oldMin(arr);
    }
    _.max = function (arr) {
      maxCount++;
      return oldMax(arr);
    }

    equal(util.range([4, 3]), 1, "[4,3] has a range of 1");
    equal(minCount, 1, "use underscore.min in your range function");
    equal(maxCount, 1, "use underscore.max in your range function");
    equal(util.range([3]), 0, "[3] has a range of 0");
    equal(minCount, 2, "use underscore.min in your range function");
    equal(maxCount, 2, "use underscore.max in your range function");
    equal(util.range([3, -1, 5]), 6, "[3, -1, 5] has a range of 6");
    equal(minCount, 3, "use underscore.min in your range function");
    equal(maxCount, 3, "use underscore.max in your range function");
  });
