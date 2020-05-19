var express = require('express'),
    http = require('http'),
    errors = require('../..');

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
        throw new errors.Http401Error(
                'Invalid X API Key'
                , 'The X API Key provided is invalid or expired'
                , 'Specify a valid X-API-Key header and retry the request');
    });
    app.use(errorHandler);
    app.use(app.router);

    app.get('/echo/:msg', function(req, res) {
        res.send(req.params.msg);
    });

    http.createServer(app).listen(app.get('port'), function() {
        var port = app.get('port');
        console.log("Express server listening on port " + port);
        console.log("API available on http://localhost:" + port + "/echo/:msg");
    });
}

// connect middleware - works fine, but not as pretty
// due to the nature of the custom toString() on our errors
createServer(3942, express.errorHandler());
//express.errorHandler.title = 'Out Of The Box Connect';

// errors middleware in connect compat mode
// looks just like a vanilla connect.errorHandler response
createServer(3943, errors.errorHandler({connectCompat: true, title: 'Connect Compat'}));

// errors flavor middleware - preferred
// contains complete custom error details
createServer(3944, errors.errorHandler({title: 'Errors Middleware', includeStack: true}));
