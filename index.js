/**
 * Created by maurice on 9/17/2015.
 */

module.exports = (function () {

    function execute(config, cb) {
        var count = 0;

        while (true) {
            try {
                return cb();
            }
            catch (ex) {
                if (count < config.count) {
                    count++;
                } else {
                    throw ex;
                }
            }
        }
    }


    return {
        retry: function () {
            var config = {
                count: 1
            };

            return {
                execute: execute.bind(null, config)
            };
        }
    }
}());
