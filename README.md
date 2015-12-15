# polly-js
Transient exception handling for JavaScript made easy.

[![npm version](https://img.shields.io/npm/v/polly-js.svg?style=flat-square)](https://www.npmjs.org/package/polly-js)
[![npm downloads](https://img.shields.io/npm/dm/polly-js.svg?style=flat-square)](http://npm-stat.com/charts.html?package=polly-js&from=2015-09-01)
[![Dependency Status](https://david-dm.org/mauricedb/polly-js.svg)](https://david-dm.org/mauricedb/polly-js)
[![Build Status](https://travis-ci.org/mauricedb/polly-js.svg?branch=master)](https://travis-ci.org/mauricedb/polly-js)
[![codecov.io](http://codecov.io/github/mauricedb/polly-js/coverage.svg?branch=master)](http://codecov.io/github/mauricedb/polly-js?branch=master)

Polly-js is a library to help developers recover from transient errors using policies like retry or wait and retry.

![Polly-js](https://raw.github.com/mauricedb/polly-js/master/images/polly-js-120.png)


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
