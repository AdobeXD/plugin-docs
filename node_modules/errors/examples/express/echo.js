var express = require('express'),
    http = require('http'),
    errors = require('../..');

var app = exports.app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3942);
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
});

errors.create({
    name: 'DatabaseConnectionError',
    defaultExplanation: 'Unable to connect to configured database.',
    defaultResponse: 'Verify the database is running and reachable.'
});

errors.title('Echo Error');
errors.stacks(true);

app.get('/errors/:error', function(req, res) {
    var err = isNaN(parseInt(req.params.error))
        ? req.params.error
        : parseInt(req.params.error)
        , TheError = errors.find(err) || errors.JS_ERRORS[err] || errors.Http404Error;

    return res.send(new TheError());
});


http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

