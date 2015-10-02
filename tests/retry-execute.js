'use strict';

var chai = require('chai');
var polly = require('..');

describe('The retry policy with a synchronous call', function () {
    it('should return the result when no error', function () {

        var result = polly
            .retry()
            .execute(function () {
                return 42;
            });

        result.should.equal(42);
    });

    it('should throw after an error', function () {

        (function () {
            polly
                .retry()
                .execute(function () {
                    throw new Error("Wrong value");
                });
        }).should.Throw(Error, 'Wrong value');
    });

    it('should retry once after an error and still fail', function () {
        var count = 0;

        try {
            polly
                .retry()
                .execute(function () {
                    count++;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        count.should.equal(2);
    });

    it('should retry five times after an error and still fail', function () {
        var count = 0;

        try {
            polly
                .retry(5)
                .execute(function () {
                    count++;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        count.should.equal(6);
    });

    it('should retry once after an error and succeed', function () {
        var count = 0;

        var result = polly
            .retry()
            .execute(function () {
                count++;
                if (count === 1) {
                    throw new Error("Wrong value");
                }

                return 42;
            });

        result.should.equal(42);
        count.should.equal(2);
    });

    it('should retry four after an error and succeed', function () {
        var count = 0;

        var result = polly
            .retry(5)
            .execute(function () {
                count++;
                if (count < 5) {
                    throw new Error("Wrong value");
                }

                return 42;
            });

        result.should.equal(42);
        count.should.equal(5);
    });
});

