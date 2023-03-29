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
 *
 * Make sure to export the result of http.createServer,
 * e.g. if you have `const app = express();` and `app.listen(...);`
 * then use `module.exports = app.listen(...);`
 */
QUnit.test(
  "Create a file `" + pathWeb + "` in `" + dir + "`",
  function (assert) {
    try {
      // Try to access the file.  If it is there, we can continue to
      // the next line.  If it is NOT there, an error will be thrown.
      fs.accessSync(dir + pathWeb, fs.F_OK);
      assert.ok(true, pathWeb + " created");
    } catch (e) {
      assert.ok(false, pathWeb + " is missing - please create it");
    }
  });


QUnit.test(
  "Subtract two numbers for the path /subtract",
  function (assert) {
    // this is the file you created in the Web Server task
    // when we 'require' it, it loads and runs.
    require(dir + pathWeb);

    const done = assert.async();

    // build an options object that can be used to make an HTTP request
    const options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/subtract?a=2&b=3.4',
    };

    //make the http request to the server.
    const req = http.request(options, function (response) {
      assert.equal(response.statusCode, 200, 'A successful call to /subtract should return a status code of 200');
      let str = '';

      response.on('data', function (chunk) {
        // combine the parts of the response (if it happens to be sent in parts)
        str += chunk;
      });

      response.on('end', function () {
        // when the last part arrives we can quit stalling.
        assert.equal(str.trim(), '-1.4', 'Test that calling /subtract?a=2&b=3.4 returns -1.4');
        done();
      });

    });
    req.on('error', function (e) {
      assert.ok(false);
      done();
    });
    req.end();
  }
);


QUnit.test(
  "Return a 404 for all non-existent paths",
  function (assert) {
    const server = require(dir + pathWeb);
    const options = {
      host: 'localhost',
      port: '8080',
      method: 'GET',
      path: '/nothere',
    };

    const done = assert.async();

    const req = http.request(options, function (response) {
      assert.equal(response.statusCode, 404, 'The server should return 404 for /nothere');
      done();
      if (server.close) {
        server.close();
      } else {
        console.log(`If this does not quit, ${pathWeb} probably needs to export the server.\nPress ctrl-c to end the test.`);
      }
    });
    req.on('error', function (e) {
      assert.ok(false);
      done();
      if (server.close) {
        server.close();
      } else {
        console.log(`If this does not quit, ${pathWeb} probably needs to export the server.\nPress ctrl-c to end the test.`);
      }
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
  function (assert) {
    try {
      fs.accessSync(dir + pathUtil, fs.F_OK);
      assert.ok(true, pathUtil + " created");
    } catch (e) {
      assert.ok(false, pathUtil + " is missing - please create it");
    }
  });


QUnit.test(
  "Use `npm init` in `" + dir + "` to create a file `" + pathPkg + "`",
  function (assert) {
    try {
      fs.accessSync(dir + pathPkg, fs.F_OK);
      assert.ok(true, pathPkg + " created");
    } catch (e) {
      assert.ok(false, pathPkg + " is missing - please create it");
    }
  });


QUnit.test(
  "Use the right name and main in " + pathPkg + ".",
  function (assert) {
    const pkg = require('./worksheet/package.json');
    assert.equal(pkg.name, 'worksheet', "`worksheet/package.json` should have the name 'worksheet'.");
    assert.equal(pkg.main, 'utility.js', "`worksheet/package.json` should have 'main' set to 'utility.js'.");
  });


QUnit.test(
  "Use the express and underscore packages.",
  function (assert) {
    const pkg = require('./worksheet/package.json');
    const deps = pkg.dependencies;
    assert.ok(deps, "`worksheet/package.json` should have dependencies.");
    assert.ok(deps && deps.express, "The express package should be a dependency in worksheet/package.json.");
    assert.ok(deps && deps.underscore, "The underscore package should be a dependency in worksheet/package.json.");

    let express;
    try {
      express = require('./worksheet/node_modules/express');
    } catch (e) {}
    assert.ok(express, 'express should be installed inside worksheet');

    let _;
    try {
      _ = require('./worksheet/node_modules/underscore');
    } catch (e) {}
    assert.ok(_, 'underscore should be installed inside worksheet');
  });


QUnit.test(
  "Create a `range` function that accepts an array and returns the size of the range between the largest and smallest numbers.",
  function (assert) {
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

    assert.equal(util.range([4, 3]), 1, "[4,3] has a range of 1");
    assert.equal(minCount, 1, "use underscore.min in your range function");
    assert.equal(maxCount, 1, "use underscore.max in your range function");
    assert.equal(util.range([3]), 0, "[3] has a range of 0");
    assert.equal(minCount, 2, "use underscore.min in your range function");
    assert.equal(maxCount, 2, "use underscore.max in your range function");
    assert.equal(util.range([3, -1, 5]), 6, "[3, -1, 5] has a range of 6");
    assert.equal(minCount, 3, "use underscore.min in your range function");
    assert.equal(maxCount, 3, "use underscore.max in your range function");
  });

  /**
   * In the file `utility.js`, export a function called `multiplyArray` that takes two parameters,
   * an array of numbers and a number. This function returns a new array which values are multiply by the number.
   *
   * The server should respond to requests on /multiplyArray, accepting
   * two  parameters `a` and `b`, and returning the array `a` multiplied by the number `b` as a plain text response.
   *
   * e.g. '/multiplyArray?a=2&a9' should return [-9]
   * e.g. '/multiplyArray?b=0&a=2&a=3' should return [0,0]
   *
   * Running the tests starts your web server, but if you want to try it in
   * your browser, you need to start the webserver explicitly, with the command
   * node worksheet/webserver
   */

  QUnit.test(
    "Create a `multiplyArray` function that accepts two parameters, an array and a number, and returns a new array whose values are multiplied by the number.",
    function () {
      const util = require(dir + pathUtil);

      deepEqual(util.multiplyArray([4, 3], 1), [4, 3], "Result must be : [4,3]");
      deepEqual(util.multiplyArray([3, 6], -3), [-9, -18], "Result must be : [-9,-18]");
      deepEqual(util.multiplyArray([3], 0), [0], "Result must be : [0]");
      deepEqual(util.multiplyArray([3, -1, 5], 6), [18, -6, 30], "Result must be : [18, -6, 35]");
    });

    QUnit.test(
    "For the path /multiplyArray, create a server using the created function to multiply each element of an array(a) with another number(b).",
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
        path: '/multiplyArray?a=1&a=2&a=-1&a=9&b=2',
      };

      //make the http request to the server.
      const req = http.request(options, function (response) {
        let str = '';

        response.on('data', function (chunk) {
          // combine the parts of the response (if it happens to be sent in parts)
          str += chunk;
        });

        response.on('end', function () {
          // when the last part arrives we can quit stalling.
          deepEqual(JSON.parse(str), [2,4,-2,18], "Test that calling /multiplyArray?a=1&a=2&a=-1&a=9&b=2 returns [2, 4, -2, 18]");
          start();
        });

      });
      req.on('error', function (e) {
        ok(false);
        start();
      });
      req.end();
    });
