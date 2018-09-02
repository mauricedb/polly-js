'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var fs = require('fs');
var path = require('path');

chai.use(chaiAsPromised);
var should = chai.should();

var polly = require('..');

describe('The wait and retry policy with a asynchronous node call', function () {
    beforeEach(function () {
        polly.defaults.delay = 1;
    });

    it('should return the result when no error', function (done) {

        polly()
            .waitAndRetry()
            .executeForNode(function (cb) {
                fs.readFile(path.join(__dirname, './hello.txt'), cb);
            }, function (err, data) {
                should.not.exist(err);
                data.toString().should.equal('Hello world');
                done();
            });
    });

    it('should reject after an error', function (done) {

        polly()
            .waitAndRetry()
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
        var actualRetryCount = 0;

        polly()
            .waitAndRetry()
            .executeForNode(function (cb, {count}) {
                actualRetryCount = count;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                actualRetryCount.should.equal(1);
                done();
            });
    });

    it('should retry five times after an error and still fail', function (done) {
        var actualRetryCount = 0;

        polly()
            .waitAndRetry([1, 1, 1, 1, 1])
            .executeForNode(function (cb, {count}) {
                actualRetryCount = count;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                actualRetryCount.should.equal(5);
                done();
            });
    });

    it('should retry five times after an error and still fail', function (done) {
        var actualRetryCount = 0;

        polly()
            .waitAndRetry(5)
            .executeForNode(function (cb, {count}) {
                actualRetryCount = count;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                actualRetryCount.should.equal(5);
                done();
            });
    });

    it('should retry once after an error and succeed', function (done) {
        var actualRetryCount = 0;

        polly()
            .waitAndRetry()
            .executeForNode(function (cb, {count}) {

                actualRetryCount = count;
                if (actualRetryCount < 1) {
                    cb(new Error("Wrong value"));
                } else {
                    cb(undefined, 42);
                }
            }, function (err, data) {
                should.not.exist(err);
                data.should.equal(42);
                actualRetryCount.should.equal(1);
                done();
            });
    });

    it('should retry four times after an error and succeed', function (done) {
        var actualRetryCount = 0;

        polly()
            .waitAndRetry(5)
            .executeForNode(function (cb, {count}) {
                actualRetryCount = count;
                if (actualRetryCount < 4) {
                    cb(new Error("Wrong value"));
                } else {
                    cb(undefined, 42);
                }
            }, function (err, data) {
                should.not.exist(err);
                data.should.equal(42);
                actualRetryCount.should.equal(4);
                done();
            });
    });

    it('should retry once because we are handling the no such file or directory error', function (done) {
        var actualRetryCount = 0;

        polly()
            .handle(function(err) {
                return err.code === 'ENOENT'
            })
            .waitAndRetry()
            .executeForNode(function (cb, {count}) {
                actualRetryCount = count;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                actualRetryCount.should.equal(1);
                done();
            });
    });

    it('should not retry because we are not handling the no such file or directory error', function (done) {
        var actualRetryCount = 0;

        polly()
            .handle(function(err) {
                return err.code !== 'ENOENT'
            })
            .waitAndRetry()
            .executeForNode(function (cb, {count}) {
                actualRetryCount = count;
                fs.readFile(path.join(__dirname, './not-there.txt'), cb);
            }, function (err, data) {
                should.exist(err);
                err.should.be.instanceof(Error);
                should.not.exist(data);
                actualRetryCount.should.equal(0);
                done();
            });
    });
});
