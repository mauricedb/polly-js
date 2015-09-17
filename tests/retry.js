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
    })
});