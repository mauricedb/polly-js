/**
 * Created by maurice on 9/17/2015.
 */

var assert = require('assert');

var polly = require('..');

describe('The retry policy', function () {

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
                .retry().execute(function () {
                    throw new Error("Wrong value");
                });
        }, /Wrong value/);
    });

    it('should retry once after an error', function () {
        var count = 0;

        try {
            polly
                .retry().execute(function () {
                    count++;
                    throw new Error("Wrong value");
                });
        }
        catch (ex) {

        }
        assert.equal(count, 2);
    });

});
