/**
 * Created by maurice on 9/17/2015.
 */

module.exports = (function () {

    function execute(config, cb) {
        return cb();
    }

    return {
        retry: function () {
            var config = {};

            return {
                execute: execute.bind(null, config)
            };
        }
    }
}());
