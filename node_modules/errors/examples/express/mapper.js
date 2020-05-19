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

app.configure('development', function() {
    app.use(express.errorHandler());
});


app.get('/errors/:error', function(req, res) {
    var err = isNaN(parseInt(req.params.error))
        ? req.params.error
        : parseInt(req.params.error)
        , TheError = errors.find(err) || errors.JS_ERRORS[err] || errors.Http404Error;

    return res.send(new TheError());
});

errors.mapper('RangeError', function(rangeError) {
    return new errors.Http412Error('Invalid range requested');
})
.mapper('ReferenceError', function(refError) {
    return new errors.Http424Error('Bad reference given');
})
.mapper('SyntaxError', function(syntaxError) {
    return new errors.Http400Error('Invalid syntax');
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

