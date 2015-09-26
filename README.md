# polly-js
Transient exception handling for JavaScript

[![NPM](https://nodei.co/npm/polly-js.png)](https://npmjs.org/package/polly-js)
[![Dependency Status](https://david-dm.org/mauricedb/polly-js.svg)](https://david-dm.org/mauricedb/polly-js)
[![Build Status](https://travis-ci.org/mauricedb/polly-js.svg?branch=master)](https://travis-ci.org/mauricedb/polly-js)

Polly-js is a library to help developers recover from transient errors using policies like retry or wait and retry.

![Polly-js](https://raw.github.com/mauricedb/polly-js/master/images/polly-js-120.png)


## Usage

Try to load the Google home page and rety twice if it fails

```JavaScript
polly
    .retry(2)
    .executeForPromise(function () {
        count++;
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
