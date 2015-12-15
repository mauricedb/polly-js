/**
 * Created by maurice on 9/17/2015.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.polly = factory();
    }
}(this, function () {
    'use strict';

    var defaults = {
        delay: 100
    };

    function execute(config, cb) {
        var count = 0;

        while (true) {
            try {
                return cb();
            }
            catch (ex) {
                if (count < config.count && config.handleFn(ex)) {
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
                    if (count < config.count && config.handleFn(e)) {
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

    function executeForPromiseWithDelay(config, cb) {

        return new Promise(function (resolve, reject) {
            function execute() {
                var original = cb();

                original.then(function (e) {
                    resolve(e);
                }, function (e) {
                    var delay = config.delays.shift();

                    if (delay && config.handleFn(e)) {
                        setTimeout(execute, delay);
                    } else {
                        reject(e);
                    }
                })
            }

            execute();
        });
    }


    function executeForNode(config, fn, callback) {
        var count = 0;

        function internalCallback(err, data) {
            if (err && count < config.count && config.handleFn(err)) {
                count++;
                fn(internalCallback);
            } else {
                callback(err, data);

            }
        }

        fn(internalCallback);
    }

    function executeForNodeWithDelay(config, fn, callback) {

        function internalCallback(err, data) {
            var delay = config.delays.shift();
            if (err && delay && config.handleFn(err)) {
                setTimeout(function () {
                    fn(internalCallback);
                }, delay);
            } else {
                callback(err, data);
            }
        }

        fn(internalCallback);
    }

    function delayCountToDelays(count) {
        var delays = [], delay = defaults.delay;

        for (var i = 0; i < count; i++) {
            delays.push(delay);
            delay = 2 * delay;
        }

        return delays;
    }

    var pollyFn = function () {
        var config = {
            count: 1,
            delays: [defaults.delay],
            handleFn: function () {
                return true;
            }
        };

        return {
            handle: function (handleFn) {
                if (typeof handleFn === 'function') {
                    config.handleFn = handleFn;
                }

                return this;
            },
            retry: function (count) {
                if (typeof count === 'number') {
                    config.count = count;
                }

                return {
                    execute: execute.bind(null, config),
                    executeForPromise: executeForPromise.bind(null, config),
                    executeForNode: executeForNode.bind(null, config)
                };
            },
            waitAndRetry: function (delays) {
                if (typeof delays === 'number') {
                    delays = delayCountToDelays(delays);
                }

                if (Array.isArray(delays)) {
                    config.delays = delays;
                }

                return {
                    executeForPromise: executeForPromiseWithDelay.bind(null, config),
                    executeForNode: executeForNodeWithDelay.bind(null, config)
                };
            }
        };
    };
    pollyFn.defaults = defaults;

    return pollyFn;
}));
