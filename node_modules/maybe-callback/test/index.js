var test = require('cached-tape');
var maybeCallback = require('../index');
var maybeCallbackOnce = require('../index').once;

test('with callback should callback with any arguments', function t(assert) {
    var args = [null, 'one', 2, {'three': true}];

    function callback() {
        var i = 0;
        for (var i = 0; i < args.length; i++) {
            assert.equal(arguments[i], args[i]);
        }
        assert.end();
    }

    maybeCallback(callback).apply(null, args);
});

test('with callback should return any returned value', function t(assert) {
    var callback = maybeCallback( function() {
      return 'yes';
    });
    assert.equal(callback(), 'yes');
    assert.end();
});

test('without callback should not throw', function t(assert) {
    assert.doesNotThrow(function() {
        maybeCallback(undefined)(null, 1, 2);
    });
    assert.end();
});

test('with once callback should callback with any arguments just once', function t(assert) {
    var args = [null, 'one', 2, {'three': true}];
    var called = 0;

    function callback() {
        called++;
        for (var i = 0; i < args.length; i++) {
            assert.equal(arguments[i], args[i]);
        }
    }

    var callbackOnce = maybeCallbackOnce(callback);

    for (var i = 0; i < 10; i++) {
        callbackOnce.apply(null, args);
    }
    
    assert.equal(called, 10);
    assert.end();
});

test('with once callback should return any returned value', function t(assert) {
    var callback = maybeCallback.once( function() {
      return 'yes';
    });
    assert.equal(callback(), 'yes');
    assert.end();
});

test('without once callback should not throw', function t(assert) {
    assert.doesNotThrow(function() {
        maybeCallbackOnce(undefined)(null, 1, 2);
    });
    assert.end();
});
