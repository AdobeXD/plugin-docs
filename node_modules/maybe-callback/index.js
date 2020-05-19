
module.exports = maybeCallback;
module.exports.once = maybeCallbackOnce;

function maybeCallback(callback) {
    return function maybeCallbackCaller() {
        if (typeof callback === 'function') {
            return callback.apply(null, arguments);
        }
    };
}

function maybeCallbackOnce(callback) {
    return function maybeCallbackOnceCaller() {
        if (typeof callback === 'function') {
            return callback.apply(null, arguments);
        }
        callback = null;
    };
}
