var request = require('supertest')
    , express = require('express')
    , http = require('http')
    , errors = require('..')
    , assert = require('assert');

var explanation = 'The X API Key provided is invalid or expired'
    , response = 'Specify a valid X-API-Key header and retry the request'
    , message = 'Invalid X API Key'
    , theError = new errors.Http401Error(message, explanation, response);

function createServer(port, errorHandler) {
    var app = exports.app = express();

    app.set('port', port);

    app.use(function(req, res, next) {
        if (req instanceof Error) {
            return next(err);
        }
        if (req.get('X-API-Key') == 'abc123') {
            return next();
        }
        throw theError;
    });
    app.use(errorHandler);
    app.use(app.router);

    app.get('/echo/:msg', function(req, res) {
        res.send(req.params.msg);
    });

    return app;
}

function validate(app, includeStack, connectCompat, title) {
    var stackStr = includeStack ? "stack " : "no stack";
    var testName = "html includes title, "
            + (connectCompat ? "fewer " : "more ")
            + "details "
            + "and " + stackStr;
    it(testName, function(done) {
        request(app)
            .get('/echo/hi')
            .set('Accept', 'text/html')
            .set('X-API-Key', 'abc1234')
            .expect('Content-Type', /html/)
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                res.text.should.include(title);
                if (includeStack) {
                    res.text.should.include('id=\"stacktrace\"');
                }
                if (!connectCompat) {
                    res.text.should.include(explanation);
                    res.text.should.include(response);
                }
                res.text.should.include(message);
                done();
            });
    });

    testName = "text should contain message and " + stackStr;
    it(testName, function(done) {
        request(app)
            .get('/echo/hi')
            .set('Accept', 'text/plain')
            .set('X-API-Key', 'abc1234')
            .expect('Content-Type', /text/)
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                res.text.should.include(message);
                if (includeStack) {
                    res.text.should.include('at ');
                }
                done();
            });
    });

    testName = "json should contain full values and " + stackStr;
    it(testName, function(done) {
        request(app)
            .get('/echo/hi')
            .set('Accept', 'application/json')
            .set('X-API-Key', 'abc1234')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                var json = {error: theError.toJSON()};
                if (includeStack) {
                    json.error.stack = theError.stack;
                }
                assert.deepEqual(JSON.parse(res.text), json);
                done();
            });
    });
};

//connect middleware - works fine, but not as pretty
//due to the nature of the custom toString() on our errors
express.errorHandler.title = 'Out Of The Box Connect';
var app = createServer(3942, express.errorHandler());
describe('Connect errorHandler()', function() {
    validate(app, true, false, express.errorHandler.title);
});

// errors middleware in connect compat mode
// looks just like a vanilla connect.errorHandler response
app = createServer(3943, errors.errorHandler({connectCompat: true, title: 'Connect Compat'}));
describe('Errors errorHandler() in compat mode', function() {
    validate(app, true, true, 'Connect Compat');
});

// errors flavor middleware - preferred
// contains complete custom error details
app = createServer(3944, errors.errorHandler({title: 'Errors Middleware'}));
describe('Errors errorHandler() in non compat mode', function() {
    validate(app, false, false, 'Errors Middleware');
});

//errors flavor middleware - preferred
//contains complete custom error details + stack
app = createServer(3944, errors.errorHandler({title: 'Errors Middleware', includeStack: true}));
describe('Errors errorHandler() in non compat mode + stack', function() {
    validate(app, true, false, 'Errors Middleware');
});
