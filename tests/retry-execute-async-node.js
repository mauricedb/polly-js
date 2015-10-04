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

    it('should retry once after an error and succeed', function (done) {
        var count = 0;

        polly
            .retry()
            .executeForNode(function (cb) {

                count++;
                if (count === 1) {
                    cb(new Error("Wrong value"));
                } else {
                    cb(undefined, 42);
                }
            }, function (err, data) {
                should.not.exist(err);
                data.should.equal(42);
                count.should.equal(2);
                done();
            });
    });

    it('should retry four times after an error and succeed', function(done ) {
        var count = 0;

        polly
            .retry(5)
            .executeForNode(function (cb) {
                count++;
                if (count < 5) {
                    cb(new Error("Wrong value"));
                } else {
                    cb(undefined, 42);
                }
            }, function(err, data)  {
                should.not.exist(err);
                data.should.equal(42);
                count.should.equal(5);
                done();
            });
    });
});
