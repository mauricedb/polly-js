'use strict';

var chai = require('chai');
var polly = require('..');

describe('The retry policy with a synchronous call', function () {
    it('should return the result when no error', function () {

        var result = polly()
            .retry()
            .execute(function ({count}) {
                count.should.equal(1);
                return 42;
            });

        result.should.equal(42);
    });

    it('should throw after an error', function () {

        (function () {
            polly()
                .retry()
                .execute(function () {
                    throw new Error("Wrong value");
                });
        }).should.Throw(Error, 'Wrong value');
    });

    it('should retry once after an error and still fail', function () {
        var actualRetryCount = 0;

        try {
            polly()
                .retry()
                .execute(function ({count}) {
                    actualRetryCount = count;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        actualRetryCount.should.equal(1);
    });

    it('should retry five times after an error and still fail', function () {
        var actualRetryCount = 0;

        try {
            polly()
                .retry(5)
                .execute(function ({count}) {
                    actualRetryCount = count;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        actualRetryCount.should.equal(5);
    });

    it('should retry once after an error and succeed', function () {
        var actualRetryCount = 0;

        var result = polly()
            .retry()
            .execute(function ({count}) {
                actualRetryCount = count;
                if (count < 1) {
                    throw new Error("Wrong value");
                }

                return 42;
            });

        result.should.equal(42);
        actualRetryCount.should.equal(1);
    });

    it('should retry four after an error and succeed', function () {
        var actualRetryCount = 0;

        var result = polly()
            .retry(5)
            .execute(function ({count}) {
                actualRetryCount = count;
                if (count < 5) {
                    throw new Error("Wrong value");
                }

                return 42;
            });

        result.should.equal(42);
        actualRetryCount.should.equal(5);
    });

    it('should retry five times after an error and still fail when all should be handled', function () {
        var actualRetryCount = 0;

        try {
            polly()
                .handle(function() {
                    return true;
                })
                .retry(5)
                .execute(function ({count}) {
                    actualRetryCount = count;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        actualRetryCount.should.equal(5);
    });

    it('should not retry times after an error and still fail when none should be handled', function () {
        var actualRetryCount = 0;

        try {
            polly()
                .handle(function() {
                    return false;
                })
                .retry(5)
                .execute(function ({count}) {
                    actualRetryCount = count;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        actualRetryCount.should.equal(0);
    });

    it('should retry 2 times after an error and still fail when all should be handled', function () {
        var actualRetryCount = 0;

        try {
            polly()
                .handle(function() {
                    return actualRetryCount < 2;
                })
                .retry(5)
                .execute(function ({count}) {
                    actualRetryCount = count;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        actualRetryCount.should.equal(2);
    });

    it('ignore the handle call if it isnt parameter a function', function () {
        var actualRetryCount = 0;

        try {
            polly()
                .handle()
                .retry(5)
                .execute(function ({count}) {
                    actualRetryCount = count;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {
        }

        actualRetryCount.should.equal(5);
    });
});

