'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
//var requestPromise = require('request-promise');
var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);
chai.should();

var polly = require('..');

describe('The retry policy with a asynchronous node call', function () {
    it('should return the result when no error', function () {

        return polly
            .retry()
            .executeForNode(function (cb) {
                fs.readFile(path.join(__dirname, './hello.txt'), cb);
            }, function(err, data){
                err.should.be.null();
                data.toString().should.be('Hello world');
            });
    });

    it.skip('should reject after an error', function () {

        return polly
            .retry()
            .executeForPromise(function () {
                return Promise.reject(new Error("Wrong value"));
            })
            .should.eventually
            .be.rejectedWith(Error, 'Wrong value');
    });

    it.skip('should retry once after an error and still fail', function () {
        var count = 0;

        return polly
            .retry()
            .executeForPromise(function () {
                return new Promise(function (resolve, reject) {
                    count++;
                    reject(new Error("Wrong value"));
                });
            })
            .should.eventually
            .be.rejected
            .then(function () {
                count.should.equal(2);
            });
    });

    it.skip('should retry five times after an error and still fail', function () {
        var count = 0;

        return polly
            .retry(5)
            .executeForPromise(function () {
                return new Promise(function (resolve, reject) {
                    count++;
                    reject(new Error("Wrong value"));
                });
            })
            .should.eventually
            .be.rejected
            .then(function () {
                count.should.equal(6);
            });
    });

    it.skip('should retry once after an error and succeed', function () {
        var count = 0;

        return polly
            .retry()
            .executeForPromise(function () {
                return new Promise(function (resolve, reject) {
                    count++;
                    if (count === 1) {
                        reject(new Error("Wrong value"));
                    } else {
                        resolve(42);
                    }
                });
            })
            .should.eventually.equal(42)
            .then(function () {
                count.should.equal(2);
            });
    });

    it.skip('should retry four times after an error and succeed', function () {
        var count = 0;

        return polly
            .retry(5)
            .executeForPromise(function () {
                return new Promise(function (resolve, reject) {
                    count++;
                    if (count < 5) {
                        reject(new Error("Wrong value"));
                    } else {
                        resolve(42);
                    }
                });
            })
            .should.eventually.equal(42)
            .then(function () {
                count.should.equal(5);
            });
    });

    it.skip('we can load html from Google', function () {
        var count = 0;

        return polly
            .retry()
            .executeForPromise(function () {
                count++;
                return requestPromise('http://www.google.com');
            })
            .should.eventually.be.fulfilled
            .then(function () {
                count.should.equal(1);
            })
    });

    it.skip('we can\'t load html from an invalid URL', function () {
        var count = 0;

        return polly
            .retry()
            .executeForPromise(function () {
                count++;
                return requestPromise('http://www.this-is-no-site.com');
            })
            .should.eventually.be.rejected
            .then(function () {
                count.should.equal(2);
            })
    });
});
