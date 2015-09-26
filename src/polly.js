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

    function executeForPromise(config, cb) {
        var count = 0;

        return new Promise(function (resolve, reject) {
            function execute() {
                var original = cb();

                original.then(function (e) {
                    resolve(e);
                }, function (e) {
                    if (count < config.count) {
                        count++;
                        execute();
                    } else {
                        reject(e);
                    }
                })
            }

            execute();
        });
    }

    return {
        retry: function (count) {
            var config = {
                count: count || 1
            };

            return {
                execute: execute.bind(null, config),
                executeForPromise: executeForPromise.bind(null, config)
            };
        }
    }
}());
