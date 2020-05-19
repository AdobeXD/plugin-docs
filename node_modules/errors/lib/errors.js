
/*!
 * Module dependencies.
 */

var util = require('util')
    , http = require('http')
    , fs = require('fs')
    , env = process.env.NODE_ENV || 'development';

/**
 * JavaScript Error constructors indexed by name
 * for convenience.
 *
 * Examples:
 *
 *  new errors.JS_ERRORS.URIError('Malformed URI');
 *
 */

exports.JS_ERRORS = {
    Error: Error
    , EvalError: EvalError
    , RangeError: RangeError
    , ReferenceError: ReferenceError
    , SyntaxError: SyntaxError
    , TypeError: TypeError
    , URIError: URIError
};

/*!
 * error constructors indexed by code
 */

var codes = {};

/*!
 * error constructors indexed by name
 */

var names = {};

/**
 * Cache the given error constructor indexed by the
 * given name and code.
 *
 * @param name {String} name
 * @param code {Number} code
 * @param err {Function} err
 * @api private
 */

function cache(name, code, err) {
    names[name] = err;
    codes[code] = err;
};

/*!
 * next free error code
 */

var freeCode = 600;

/**
 * Return the next free error code.
 *
 * @returns {Number}
 * @api private
 */

function nextCode() {
    while(codes[freeCode]) {
        freeCode += 1;
    }
    return freeCode;
};

/**
 * Returns the error constructor by the given code or
 * name.
 *
 * Examples:
 *
 *  errors.find(404);
 *  // => Http404Error
 *
 *  errors.find(500);
 *  // => Http500Error
 *
 *  errors.find('Http401Error');
 *  // => http401Error
 *
 *
 * @param {String|Number} err
 * @returns {Function}
 * @api public
 */

exports.find = function(err) {
    return (typeof err == 'number') ? codes[err] : names[err];
};

/**
 * Determines if the given `Error` object was created using
 * the errors framework.
 *
 * @param {Object} err The error to check
 * @returns {Boolean}
 * @api private
 */

function isError(err) {
    return err && err.hasOwnProperty('explanation') && err.hasOwnProperty('code');
};

/**
 * Create a new constructor instance based
 * on the given options.
 *
 * This factory method allows consumers to build
 * parameterized error constructor function instances
 * which can then be used to instantiate new concrete
 * instances of the given error.
 *
 * This method accepts jQuery style `options` argument
 * with the following properties (note that `name` is
 * the only required property, all others are optional).
 *
 * The `scope` option can be used to change the default
 * namespace to create the constructor in. If unspecified
 * it defaults to the `exports` object of this module
 * (i.e. `errors.exports`).
 *
 * The `parent` option specifies the parent to inherit
 * from. If unspecified it defaults to `Error`.
 *
 * The `defaultMessage`, `defaultExplanation` and
 * `defaultResponse` define the default text to use
 * for the new errors `message`, `explanation` and
 * `response` respectively. These values can be
 * overridden at construction time.
 *
 * The `code` specifies the error code for the new
 * error. If unspecified it defaults to a generated
 * error number which is greater than or equal to
 * 600.
 *
 * Examples:
 *
 *  // use all defaults
 *  errors.create({name: 'FileNotFoundError'});
 *  throw new errors.FileNotFoundError("Could not find file x");
 *
 *  // inheritance
 *  errors.create({
 *      name: 'FatalError',
 *      code: 900
 *  });
 *  errors.create({
 *      name: 'DatabaseError',
 *      parent: errors.FatalError
 *      code: 901
 *  });
 *  var dbe = new errors.DatabaseError("Internal database error");
 *  dbe instanceof errors.FatalError;
 *  // => true
 *
 *  // scoping to current module exports
 *  var MalformedEncodingError = errors.create({
 *      name: 'MalformedEncodingError',
 *      scope: exports
 *  });
 *  throw new MalformedEncodingError("Encoding not supported");
 *
 *  // default message
 *  errors.create({
 *      name: 'SocketReadError',
 *      code: 4000,
 *      defaultMessage: 'Could not read from socket'
 *  });
 *  var sre = new errors.SocketReadError();
 *  sre.message;
 *  // => 'Could not read from socket'
 *  sre.code;
 *  // => 4000
 *  sre instanceof Error;
 *  // => true
 *
 *  // explanation and response
 *  errors.create({
 *      name: 'SocketReadError',
 *      code: 4000,
 *      defaultMessage: 'Could not read from socket',
 *      defaultExplanation: 'Unable to obtain a reference to the socket',
 *      defaultResponse: 'Specify a different port or socket and retry the operation'
 *  });
 *  var sre = new errors.SocketReadError();
 *  sre.explanation;
 *  // => 'Unable to obtain a reference to the socket'
 *  sre.response;
 *  // => 'Specify a different port or socket and retry the operation'
 *
 * @param {String} name The constructor name.
 * @param {Object} scope The scope (i.e. namespace).
 * @param {Function} parent The parent to inherit from.
 * @param {String} defaultMessage The default message.
 * @param {Number} code The error code.
 * @param {Number} status The status code.
 * @param {String} defaultExplanation The default explanation.
 * @param {String} defaultResponse The default operator response.
 * @return {Function} the newly created constructor
 * @api public
 */

var create = exports.create = function(options) {
    var options = options || {}
        , scope = options.scope || exports
        , parent = options.parent || Error
        , defaultMessage = options.defaultMessage
            || 'An unexpected ' + options.name + ' occurred.'
        , className = options.name
        , errorCode = options.code || nextCode()
        , statusCode = options.status
        , defaultExplanation = options.defaultExplanation
        , defaultResponse = options.defaultResponse
        , formattedStack
        , stack = {};


/**
 * Create a new instance of the exception which accepts
 * 2 forms of parameters.
 *
 * (a) Passing the message, explanation and response
 * as individual argument strings:
 * Create a new instance of the exception optionally
 * specifying a message, explanation and response
 * for the new instance. If any of the arguments are
 * null, their value will default to their respective
 * default value use on the `create` call, or will
 * be null if no default was specified.
 *
 * (b) Passing an options style object which contains
 * key / value pairs. In this form keys map to the
 * attributes of the error object. Note that the properties
 * 'stack', 'name' and 'code' cannot be set via the options
 * style object in this form.
 *
 * @param {String|Object} msg The message to use for the error.
 * @param {String} expl The explanation to use for the error.
 * @param {String} fix The response to use for the error.
 * @return {Object} The newly created error.
 */

    scope[className] = function(msg, expl, fix) {
    	var attrs = {};
    	if (typeof msg !== null && typeof msg === 'object') {
    		attrs = msg;
    		msg = attrs['message'] || defaultMessage;
    		if (attrs.hasOwnProperty('stack')
    				|| attrs.hasOwnProperty('name')
    				|| attrs.hasOwnProperty('code')) {
    			throw Error("Properties 'stack', 'name' or 'code' " +
    					"cannot be overridden");
    		}
    	}
    	attrs['status'] = attrs['status'] || statusCode;
        msg = msg || defaultMessage;
        expl = expl || defaultExplanation;
        fix = fix || defaultResponse;

        parent.call(this, msg);

        // hack around the defineProperty for stack so
        // we can delay stack formatting until access
        // for performance reasons
        Error.captureStackTrace(stack, scope[className]);

/**
 * Return the stack tracks for the error.
 *
 * @return {String}
 * @api public
 */
        Object.defineProperty(this, 'stack', {
            configurable: true,
            enumerable: false,
            get: function() {
                if (!formattedStack) {
                    formattedStack = stack.stack.replace('[object Object]', 'Error: ' + this.message);
                }
                return formattedStack;
            }
        });

/**
 * Return the explanation for this error.
 *
 * @return {String}
 * @api public
*/

        Object.defineProperty(this, 'explanation', {
            value: attrs['explanation'] || expl,
            configurable: true,
            enumerable: true
        });

/**
 * Return the operator response for this error.
 *
 * @return {String}
 * @api public
 */

        Object.defineProperty(this, 'response', {
            value: attrs['response'] || fix,
            configurable: true,
            enumerable: true
        });

/**
 * Return the error code.
 *
 * @return {Number}
 * @api public
 */

        Object.defineProperty(this, 'code', {
            value: attrs['code'] || errorCode,
            configurable: true,
            enumerable: true
        });

/**
 * HTTP status code of this error.
 *
 * If the instance's `code` is not a valid
 * HTTP status code it's normalized to 500.s
 *
 * @return {Number}
 * @api public
 */

        Object.defineProperty(this, 'status', {
            value: attrs['status'] || (http.STATUS_CODES[errorCode] ? errorCode : 500),
            configurable: true,
            // normalize for http status code and connect compat
            enumerable: true
        });

/**
 * Name of this error.
 *
 * @return {String}
 * @api public
 */

        Object.defineProperty(this, 'name', {
            value: className,
            configurable: true,
            enumerable: true
        });

/**
 * Message for this error.
 *
 * @return {String}
 * @api public
 */

        Object.defineProperty(this, 'message', {
            value: attrs['message'] || msg,
            configurable: true,
            enumerable: true
        });

        // expose extra conf attrs as properties
        for (var key in attrs) {
    		if (!this.hasOwnProperty(key)) {
    			Object.defineProperty(this, key, {
    	            value: attrs[key],
    	            configurable: true,
    	            enumerable: true
    	        });
    		}
    	}

    };

    util.inherits(scope[className], parent);

/**
 * Return the name of the prototype.
 *
 * @return {String}
 * @api public
 */

    Object.defineProperty(scope[className].prototype, 'name', {
        value: className,
        enumerable: true
    });

/**
 * Return a formatted string for this error which
 * includes the error's `name`, `message` and `code`.
 * The string will also include the `explanation` and
 * `response` if they are set for this instance.
 *
 * Can be redefined by consumers to change formatting.
 *
 * @return {String}
 * @api public
 */

    scope[className].prototype.toString = function() {

        /*!

        The snippet below would allow us to provide connect errorHandler()
        middleware compatible errors, but is too costly. In a 1000 executions
        of toString() it adds ~25% overhead.

        var e = Error();
        Error.captureStackTrace(e);
        if (~e.stack.indexOf("connect/lib/middleware/errorHandler.js")) {
            return this.message;
        }
        */

        // TODO externalization
        var msg = util.format("%s: %s\nCode: %s", this.name, this.message, this.code);
        if (this.explanation) {
            msg += "\nExplanation: " + this.explanation;
        }
        if (this.response) {
            msg += "\nResponse: " + this.response;
        }

        function isExtra(key) {
        	return ['name', 'message', 'status', 'code',
        	        'response', 'explanation', 'stack'].indexOf(key) < 0;
        }

        // extra properties
        Object.keys(this).filter(isExtra).forEach(function(key) {
        	msg += util.format("\n%s: %s", key, this[key]);
        }, this);

        if (useStack) {
            msg += "\n" + this.stack;
        }
        return msg;
    };

/**
 * Return the JSON representation of this error
 * which includes it's `name`, `code`, `message`
 * and `status`. The JSON object returned will
 * also include the `explanation` and `response`
 * if defined for this instance.
 *
 * This method can be redefined for customized
 * behavior of `JSON.stringify()`.
 *
 * @return {Object}
 * @api public
 */

    scope[className].prototype.toJSON = function() {
        // TODO externalization
        return useStack
                ? mixin(this, {stack: this.stack}, true)
                : mixin(this, {}, true);
    };

    cache(className, errorCode, scope[className]);

    return scope[className];
};

/*!
 * Module global to track if we should use stack traces.
 */

var useStack = false;

/**
 * Get/set the module default behavior in terms of if
 * stack traces should be included in `toString()`,
 * `send()`ing errors, etc.
 *
 * When called with no parameters this method will return
 * if the errors module is set to use stacks or not.
 *
 * When called with a single boolean parameter this
 * method will interally set if stack traces should be used.
 *
 * @param {Boolean} useStacks
 * @api public
 */

exports.stacks = function(useStacks) {
    if (useStacks == null || useStacks == undefined) {
        return useStack;
    }
    useStack = useStacks;
};

/*!
 * Default page title for HTML responses.
 */

var pageTitle = 'Error';

/**
 * Gets/sets the module's default page title to use for
 * html based responses.
 *
 * If called with no arguments, returns the current title
 * set. Otherwise when called with a single `String` argument
 * sets the title to use for html based responses.
 *
 * The default title is 'Error'.
 *
 * @param {String} title The title to use.
 * @api public
 */

exports.title = function(title) {
    if (title == null || title == undefined) {
        return pageTitle;
    }
    pageTitle = title;
};

/**
 * Perform a top level mixing between and source
 * and destination object optionally skipping
 * undefined/null properties.
 *
 * Examples:
 *
 *  mixin({a: 'A'}, {b: 'B});
 *  // => {a: 'A', b: 'B'}
 *
 *  mixin({'a': null}, {b: 'B}, true);
 *  // => {b: 'B'}
 *
 * @param {Object} src
 * @param {Object} dest
 * @param {Boolean} skipEmpty
 * @returns {Object}
 * @api private
 */

function mixin(src, dest, skipEmpty) {
    // TODO: refactor into common module
    dest = dest || {}, src = src || {};
    Object.keys(src).forEach(function(key) {
        if (!dest[key] && (skipEmpty && src[key] != null && src[key] != undefined)) {
            dest[key] = src[key];
        }
    });
    return dest;
};

/**
 * Base `Error` for web app HTTP based
 * exceptions -- all 4xx and 5xx wrappered
 * errors are instances of `HttpError`.
 */

create({name: 'HttpError'});

/**
 * `HttpError`s for all 4xx-5xx HTTP based status codes
 * defined as `Http[code]Error` for convenience.
 *
 * Examples:
 *
 *  // Accept: text/html
 *  res.send(new errors.Http404Error('Resource not found'));
 *  // => text/html
 *  // => "Resource not found"
 *
 *  // Accept: application/json
 *  res.send(new errors.Http423Error('Resource is currently locked'));
 *  // => application/json
 *  // {
 *  //      "name": "Http423Error",
 *  //      "code": 423,
 *  //      "status": 423,
 *  //      "message": "Resource is currently locked"
 *  // }
 *
 *  // Accept: text/plain
 *  // res.send(new errors.Http401Error('You do not have access'));
 *  // => text/plain
 *  // "You do not have access"
 */

for (code in http.STATUS_CODES) {
    // TODO: provide default explanation & response
    if (http.STATUS_CODES.hasOwnProperty(code) && code >= 400) {
        create({
            name: 'Http' + code + 'Error',
            code: code,
            parent: exports.HttpError,
            defaultMessage: http.STATUS_CODES[code]
        });
    }
}

/*!
 * express response prototype
 */

var response;

/*!
 * determine if express is available
 */

try {
    response = require('express').response;
} catch (e) {
    // express not installed
}

/*!
 * express or connect errorHanlder middleware
 */

var errHandler;

/*!
 * Determine if express or connect errorHanlder middleware
 * are installed
 */

try {
    // check for express
    errHandler = require('express').errorHandler;
} catch (e) {
    try {
        // check for connect
        errHandler = require('connect').errorHandler;
    } catch (x) {
        // not installed
    }
}

if (errHandler) {

/**
 * Custom error handler middleware based on connect's
 * `errorHandler()` middleware. Althought out of the box
 * connect or express errorHandler() works just fine,
 * its not as pretty as you might like due to the additional
 * details in custom error's `toString()`.
 *
 * Therefore `errors` exports its own `errorHandler()`
 * middleware which supports an `options` object to configure
 * it.
 *
 * The `options` JSON object accepts the following properties:
 *
 * @param {String} title The title to use for html based responses which overrides module `title()`.
 * @param {Boolean} connectCompat True to create connect compat html responses.
 * @param {Boolean} includeStack True if the custom error handler should include the stack.
 * @api public
 */

    exports.errorHandler = function(options) {
        var opts = mixin({connectCompat: false, title: pageTitle, includeStack: useStack}
                , options, true);
        if (opts.connectCompat) {
            return function(err, req, res, next) {
                if (isError(err)) {
                    // connect errorHandler() compat
                    err.toString = function() {
                        return err.message;
                    };
                }
                errHandler.title = opts.title;
                // connect middleware error handler
                return errHandler()(err, req, res, next);
            };
        } else {
            return defaultFormatter(opts.title, opts.includeStack);
        }
    };
}


/**
 * If Express is installed, patch `response` to
 * permit `send`ing `Error` based objects. If
 * vanilla `Error` objects are used with `send`,
 * they are mapped by default to the `Http500Error`.
 *
 * Prior to `send`ing an error based response, any
 * mapper setup for the `Error` is invoked allowing
 * customization or transformation of the error.
 *
 * The current implementation provides direct support
 * for `text/html`, `text/plain` and `application/json`
 * based accept types, otherwise it defaults to `plain/text`.
 *
 * Examples:
 *
 *  // Accept: text/html
 *  res.send(new errors.Http404Error('Resource not found'));
 *  // => html
 *  // => html structured response
 *
 *  // Accept: application/json
 *  res.send(new errors.Http423Error('Resource is currently locked'));
 *  // => application/json
 *  // => {
 *  // =>   'name': 'Http423Error',
 *  // =>   'code': 423,
 *  // =>   'status': 423,
 *  // =>   'message': 'Resource is currently locked'
 *  // => }
 *
 *  // Accept: text/plain
 *  // res.send(new errors.Http401Error('You do not have access'));
 *  // => text/plain
 *  // => "You do not have access"
 *
 *  // Accept: text/xml
 *  // res.send(new errors.Http500Error('Something bad happened'));
 *  // => 500
 *  // => text/plain
 */

if (response) {
    var _send = response.send;
    response.send = function(err) {
        if (arguments.length == 1 && err instanceof Error) {
            err = mapError(err);
            if (!isError(err)) {
                // map vanilla errors into 500s
                err = new exports.Http500Error(err.message ||
                        http.STATUS_CODES[500] + ' - ' + err.name);
            }
            defaultFormatter(pageTitle, useStack)(err, this.req, this.req.res, null);
            return this;
        }
        return _send.apply(this, arguments);
    };
}

/*!
 * buffers for the error css and html
 */

var errorCss, errorHtml;

/*!
 * preload and buffer error css and html
 */

errorCss = fs.readFileSync(__dirname + '/static/error.css', 'utf8');
errorHtml = fs.readFileSync(__dirname + '/static/error.html', 'utf8');

/**
 * Returns the default formatter which handles
 * responses for the middleware and `send()` method.
 * This code is based on `connect`'s `errorHandler`.
 *
 * @param {String} title The title to use for html response.
 * @param {Boolean} includeStack If we should include the stack trace.
 * @returns {Function} The default formatter function.
 * @api private
 */

function defaultFormatter(title, includeStack) {

    return function(err, req, res, next) {
        if ('test' != env) {
            console.log(err);
        }

        function toHtml(elem, tag) {
            return elem ? util.format("<%s>%s</%s>", tag, elem, tag) : "";
        }

        function buildStack() {
            var stack = (err.stack || '').split('\n').slice(1).map(function(trace) {
                return '<li>' + trace + '</li>';
            }).join('');
            return stack;
        }

        res.statusCode = err.status;

        var accept = req.headers.accept || ''
            , html;
        if (~accept.indexOf('html')) {

            html = errorHtml
              .replace('{style}', errorCss)
              .replace('{stack}', includeStack ? buildStack() : "")
              .replace('{title}', title || 'Error')
              .replace('{statusCode}', err.status)
              .replace('{explanation}', toHtml(err.explanation, 'h4'))
              .replace('{response}', toHtml(err.response, 'h4'))
              .replace(/\{error\}/g, err.message);

            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(html);
        } else if (~accept.indexOf('json')) {
            res.setHeader('Content-Type', 'application/json');
            var json = {error: err.toJSON()};
            if (includeStack) {
                json['error']['stack'] = err.stack;
            }
            res.end(JSON.stringify(json));
        } else {
            res.writeHead(res.statusCode, { 'Content-Type': 'text/plain' });
            res.end(err.toString() + (includeStack ? "\n" + err.stack : ""));
        }
    };
};


/**
 * Returns the argument as an `Array`. If
 * the argument is already an `Array`, it's
 * returned unchanged. Otherwise the given
 * argument is returned in a new `Array`.
 *
 * Examples:
 *
 *  asArray('a');
 *  // => ['a']
 *
 *  asArray(null);
 *  // => []
 *
 *  asArray(['a', 'b']);
 *  // => ['a', 'b']
 *
 * @param {Object|Array} obj The object to wrap in an array.
 * @returns {Array}
 * @api private
 */

function asArray(obj) {
    // TODO: refator into common module
    return obj instanceof Array ? obj : [obj];
};

/*!
 * cache of error mapper functions indexed by error name
 */

var mappers = {};

/**
 * Adds or retrieves an error mappers.
 *
 * When called with 2 arguments, this method is used to
 * add error mappers for the given error names.
 *
 * When called with a single argument it's used to
 * retrieve the registered mapper for the given
 * error name.
 *
 * Any bound mappers will be invoked
 * for `express.send()` integration and hence you
 * can define mappers used when sending error responses
 * with Express.
 *
 * Examples:
 *
 *  // adding mappers
 *  errors.mapper('RangeError', function(rangeError) {
 *      return new errors.Http412Error('Invalid range requested');
 *  })
 *  .addmapper('ReferenceError', function(refError) {
 *      return new errors.Http424Error('Bad reference given');
 *  });
 *
 *  errors.mapper(['RangeError', 'ReferenceError'], function(err) {
 *      return new errors.Http500Error(err.message);
 *  });
 *
 *  // retrieve error mapper
 *  var rangeError = errors.mapper('RangeError');
 *
 * @param {String|Array} errName The error name(s) to attach the mapper to.
 * @param {Function} fn The function to call for the mapping.
 * @returns {Object} The exports of errors for chaining or the
 * retrieved error.
 * @api public
 */

var mapper = exports.mapper = function(errName, fn) {
    if (arguments.length == 2) {
        asArray(errName).forEach(function(name) {
            mappers[name] = fn;
        });
        return exports;
    }
    return mappers[errName];
};

/**
 * Maps the given error using the bound error mapper
 * and returns the mapped error as per the mappers
 * return value. If no mapper is bound to the given
 * errors name, the argument error is returned unchanged.
 *
 * Examples:
 *
 *  errors.mapError(new RangeError());
 *
 * @param {Object} err The error instance to map.
 * @returns {Object} The mapped error.
 * @api public
 */

var mapError = exports.mapError = function(err) {
    return mapper(err.name) ? mapper(err.name)(err) : err;
};
