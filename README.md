# polly-js
Transient exception handling for JavaScript

[![npm version](https://img.shields.io/npm/v/polly-js.svg?style=flat-square)](https://www.npmjs.org/package/polly-js)
[![npm downloads](https://img.shields.io/npm/dm/polly-jst.svg?style=flat-square)](http://npm-stat.com/charts.html?package=polly-js&from=2015-09-01)
[![Dependency Status](https://david-dm.org/mauricedb/polly-js.svg)](https://david-dm.org/mauricedb/polly-js)
[![Build Status](https://travis-ci.org/mauricedb/polly-js.svg?branch=master)](https://travis-ci.org/mauricedb/polly-js)
[![codecov.io](http://codecov.io/github/mauricedb/polly-js/coverage.svg?branch=master)](http://codecov.io/github/mauricedb/polly-js?branch=master)

Polly-js is a library to help developers recover from transient errors using policies like retry or wait and retry.

![Polly-js](https://raw.github.com/mauricedb/polly-js/master/images/polly-js-120.png)


## Usage

Try to load the Google home page and rety twice if it fails

```JavaScript
polly
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


## Acknowledgements

The library is based on the [Polly NuGet package](https://www.nuget.org/packages/Polly/) by Michael Wolfenden
