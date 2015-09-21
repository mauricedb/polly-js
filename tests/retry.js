/**
 * Created by maurice on 9/17/2015.
 */

var assert = require('assert');

var polly = require('..');

describe('The retry policy', function () {

    describe('with a synchronous call', function () {
        it('should return the result when no error', function () {

            var result = polly
                .retry()
                .execute(function () {
                    return 42;
                });

            assert.equal(result, 42);
        });

        it('should throw after an error', function () {

            assert.throws(function () {
                polly
                    .retry()
                    .execute(function () {
                        throw new Error("Wrong value");
                    });
            }, /Wrong value/);
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
            assert.equal(count, 2);
        });

        it('should retry once after an error and succeed', function () {
            var count = 0;

            var result = polly
                .retry().execute(function () {
                    count++;
                    if (count === 1) {
                        throw new Error("Wrong value");
                    }

                    return 42;
                });

            assert.equal(result, 42);
            assert.equal(count, 2);
        });
    });

    describe('with a asynchronous call', function () {
        it('should return the result when no error', function (done) {

            polly
                .retry()
                .executeAsync(function () {
                    return new Promise(function (resolve, reject) {
                        resolve(42);
                    });
                }).then(function (result) {
                    assert.equal(result, 42);
                    done();
                });
        });

        it('should throw after an error', function (done) {

            polly
                .retry()
                .executeAsync(function () {
                    return new Promise(function (resolve, reject) {
                        reject(new Error("Wrong value"));
                    });
                }).then(function () {
                }, function (err) {
                    assert.ok(err instanceof Error);
                    assert.equal(err.message, "Wrong value");
                    done();
                });
        });

        it('should retry once after an error and still fail', function (done) {
            var count = 0;

            polly
                .retry()
                .executeAsync(function () {
                    return new Promise(function (resolve, reject) {
                        count++;
                        reject(new Error("Wrong value"));
                    });
                }).then(function () {
                }, function (err) {
                    assert.equal(count, 2);
                    done();
                });
        });

        it('should retry once after an error and succeed', function (done) {
            var count = 0;

            polly
                .retry()
                .executeAsync(function () {
                    return new Promise(function (resolve, reject) {
                        count++;
                        if (count === 1) {
                            reject(new Error("Wrong value"));
                        } else {
                            resolve(42);
                        }
                    });
                }).then(function (result) {
                    assert.equal(result, 42);
                    assert.equal(count, 2);
                    done();
                });
        });
    });
});
