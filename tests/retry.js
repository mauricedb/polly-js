/**
 * Created by maurice on 9/17/2015.
 */

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var requestPromise = require('request-promise');

chai.use(chaiAsPromised);
chai.should();

var polly = require('..');

describe('The retry policy', function () {

    describe('with a synchronous call', function () {
        it('should return the result when no error', function () {

            var result = polly
                .retry()
                .execute(function () {
                    return 42;
                });

            result.should.equal(42);
        });

        it('should throw after an error', function () {

            (function() {
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

            result.should.equal(42);
            count.should.equal(2);
        });
    });

    describe('with a asynchronous call', function () {
        it('should return the result when no error', function () {

            return polly
                .retry()
                .executeForPromise(function () {
                    return Promise.resolve(42);
                })
                .should.eventually.equal(42);
        });

        it('should reject after an error', function () {

            return polly
                .retry()
                .executeForPromise(function () {
                    return Promise.reject(new Error("Wrong value"));
                })
                .should.eventually
                .be.rejectedWith(Error, 'Wrong value');
        });

        it('should retry once after an error and still fail', function () {
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

        it('should retry once after an error and succeed', function () {
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

        it('we can load html from Google', function () {
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

        it('we can\'t load html from an invalid URL', function () {
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
});
