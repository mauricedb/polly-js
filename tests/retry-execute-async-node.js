'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
//var requestPromise = require('request-promise');
var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);
var should = chai.should();

var polly = require('..');

describe('The retry policy with a asynchronous node call', function () {
    it('should return the result when no error', function (done) {

polly
    .retry()
    .executeForNode(function (cb) {
        fs.readFile(path.join(__dirname, './hello.txt'), cb);
    }, function (err, data) {
        should.not.exist(err);
        data.toString().should.equal('Hello world');
        done();
    });
    });

    it('should reject after an error', function (done) {

        polly
            .retry()
            .executeForNode(function (cb) {
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                done();
            });
    });

    it('should retry once after an error and still fail', function (done) {
        var count = 0;

        polly
            .retry()
            .executeForNode(function (cb) {
                count++;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                count.should.equal(2);
                done();
            });
    });

    it('should retry five times after an error and still fail', function (done) {
        var count = 0;

        polly
            .retry(5)
            .executeForNode(function (cb) {
                count++;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                count.should.equal(6);
                done();
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
