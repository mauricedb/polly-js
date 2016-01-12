# polly-js
Transient exception handling for JavaScript made easy.

[![npm version](https://img.shields.io/npm/v/polly-js.svg?style=flat-square)](https://www.npmjs.org/package/polly-js)
[![npm downloads](https://img.shields.io/npm/dm/polly-js.svg?style=flat-square)](http://npm-stat.com/charts.html?package=polly-js&from=2015-09-01)
[![Dependency Status](https://david-dm.org/mauricedb/polly-js.svg)](https://david-dm.org/mauricedb/polly-js)
[![Build Status](https://travis-ci.org/mauricedb/polly-js.svg?branch=master)](https://travis-ci.org/mauricedb/polly-js)
[![codecov.io](http://codecov.io/github/mauricedb/polly-js/coverage.svg?branch=master)](http://codecov.io/github/mauricedb/polly-js?branch=master)

Polly-js is a library to help developers recover from transient errors using policies like retry or wait and retry.

![Polly-js](https://raw.github.com/mauricedb/polly-js/master/images/polly-js-120.png)

The typical use case for polly-js are retrying actions after they fail. These actions often include some form of IO which can fail.
Examples of these IO actions are AJAX requests to other services, file operations on disk or interacting with a database.
All these actions share the characteristics that they can occasionally fail because of circumstances outside of the control of your application like the network connection might be briefly unavailable or the file might be in use by another process.
When any of these actions fail there is a change that just retrying the same action, possibly after a short delay, will work. Polly-js makes these retry actions easy to code.

## Detecting failures
Depending on the function being executed different ways of detecting failure are used.

When you call ```polly().execute(<your function>)``` the code assumes that your code failed and needs to be retried when your function throws an Error.

When you call ```polly().executeForPromise(<your function>)``` the code assumes that your code failed and needs to be retried when your function returns a Promise that is rejected.

When you call ```polly().executeForNode(<your function that accepts a callback>)``` the code assumes that your code failed and needs to be retried when your function calls the callback with a first non null parameter indicating an error.

## Deciding what to do on failure
Whenever a failure is detected Polly-js will try attempt to retry your action. 

You get to control how a failure is retried by calling either ```polly().retry()``` or ```polly().waitAndRetry()```. 
Both will retry the failing action but the ```polly().waitAndRetry()``` option adds a small delay before retrying. 


## Usage

Try to load the Google home page and retry twice if it fails.

```JavaScript
polly()
    .retry(2)
    .executeForPromise(function () {
        return requestPromise('http://www.google.com');
    })
    .then(function(result) {
        console.log(result)
    }, function(err) {
        console.error('Failed trying three times', err)
    });
```

Try to read a file from disk and retry twice if this fails.

```JavaScript
polly()
    .retry(2)
    .executeForNode(function (cb) {
        fs.readFile(path.join(__dirname, './hello.txt'), cb);
    }, function (err, data) {
        if (err) {
            console.error('Failed trying three times', err)
        } else {
            console.log(data)
        }
    });
```

Only retry 'no such file or directory' errors. Wait 100 ms before retrying.

```JavaScript
polly()
    .handle(function(err) {
        return err.code === 'ENOENT';
    })
    .waitAndRetry()
    .executeForNode(function (cb) {
        fs.readFile(path.join(__dirname, './not-there.txt'), cb);
    }, function (err, data) {
        if (err) {
            console.error('Failed trying twice with a 100ms delay', err)
        } else {
            console.log(data)
        }
    });
```

## Acknowledgements

The library is based on the [Polly NuGet package](https://www.nuget.org/packages/Polly/) by Michael Wolfenden
