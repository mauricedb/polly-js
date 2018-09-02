'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var requestPromise = require('request-promise');

chai.use(chaiAsPromised);
chai.should();

var polly = require('..');

describe('The wait and retry policy with a asynchronous promise call', function () {

    beforeEach(function () {
        polly.defaults.delay = 1;
    });

    it('should return the result when no error', function () {

        return polly()
            .waitAndRetry()
            .executeForPromise(function ({count}) {
                return Promise.resolve(42);
            })
            .should.eventually.equal(42);
    });

    it('should reject after an error', function () {

        return polly()
            .waitAndRetry()
            .executeForPromise(function () {
                return Promise.reject(new Error("Wrong value"));
            })
            .should.eventually
            .be.rejectedWith(Error, 'Wrong value');
    });

    it('should retry once after an error and still fail', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry()
            .executeForPromise(function ({count}) {
                return new Promise(function (resolve, reject) {
                    actualRetryCount = count;
                    reject(new Error("Wrong value"));
                });
            })
            .should.eventually
            .be.rejected
            .then(function () {
                actualRetryCount.should.equal(1);
            });
    });

    it('should retry five times after an error and still fail', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry([1, 1, 1, 1, 1])
            .executeForPromise(function ({count}) {
                return new Promise(function (resolve, reject) {
                    actualRetryCount = count;
                    reject(new Error("Wrong value"));
                });
            })
            .should.eventually
            .be.rejected
            .then(function () {
                actualRetryCount.should.equal(5);
            });
    });

    it('should retry once after an error and succeed', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry()
            .executeForPromise(function ({count}) {
                return new Promise(function (resolve, reject) {
                    actualRetryCount = count;
                    if (actualRetryCount < 1) {
                        reject(new Error("Wrong value"));
                    } else {
                        resolve(42);
                    }
                });
            })
            .should.eventually.equal(42)
            .then(function () {
                actualRetryCount.should.equal(1);
            });
    });

    it('should retry four times specifying delays after an error and succeed', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry([1, 1, 1, 1, 1])
            .executeForPromise(function ({count}) {
                return new Promise(function (resolve, reject) {
                    actualRetryCount = count;
                    if (actualRetryCount < 4) {
                        reject(new Error("Wrong value"));
                    } else {
                        resolve(42);
                    }
                });
            })
            .should.eventually.equal(42)
            .then(function () {
                actualRetryCount.should.equal(4);
            });
    });

    it('should retry four times specifying the number after an error and succeed', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry(5)
            .executeForPromise(function ({count}) {
                return new Promise(function (resolve, reject) {
                    actualRetryCount = count;
                    if (actualRetryCount < 4) {
                        reject(new Error("Wrong value"));
                    } else {
                        resolve(42);
                    }
                });
            })
            .should.eventually.equal(42)
            .then(function () {
                actualRetryCount.should.equal(4);
            });
    });

    it('we can load html from Google', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry()
            .executeForPromise(function ({count}) {
                actualRetryCount = count;
                return requestPromise('http://www.google.com');
            })
            .should.eventually.be.fulfilled
            .then(function () {
                actualRetryCount.should.equal(0);
            })
    });

    it('we can\'t load html from an invalid URL', function () {
        var actualRetryCount = 0;

        return polly()
            .waitAndRetry()
            .executeForPromise(function ({count}) {
                actualRetryCount = count;
                return requestPromise('http://www.this-is-no-site.com');
            })
            .should.eventually.be.rejected
            .then(function () {
                actualRetryCount.should.equal(1);
            })
    });
});
