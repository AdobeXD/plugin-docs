[![Build Status](https://secure.travis-ci.org/bodenr/errors.png)](http://travis-ci.org/bodenr/errors)
# errors
    
Errors is a comprehensive and robust, yet lightweight, set of error utilities for 
[node.js](http://nodejs.org) enabling you to _do_ errors more effectively.

## Features

* Parameterized error factory allowing you do define how errors should behave 
based on your project needs.
* Support for enterprise level error attributes including more detailed error cause
and operator response messages.
* Predefined error constructors for all HTTP 4xx-5xx based errors allowing you to leverage
HTTP errors out of the box.
* [express.js](http://expressjs.com/) integration permitting your code to `send()` any
type of `Error` directly using Express's `response` object.
* [connect.js](http://www.senchalabs.org/connect/) support allowing you to use custom
errors with connect's `errorHandler` middleware or this libraries custom error handler
middleware.
* Error mapping via registered mapping function permitting you to map between 
errors when needed.

## Installation

Install using `npm`:

    $ npm install errors

## Running the tests

From the `errors` directory first install the dev dependencies:
```
npm install
```

Then run the tests:
```
npm test
```

## API Docs

The API docs are provided in html and md format and are located under
`errors/docs/`. If you want to rebuild them for any reason, you can
run the following from the `errors` directory:
```
make doc
```

## Defining error messages

The examples assume you've `require`d the errors module like so:
```js
require('errors');
```

Create a very barebones error -- you must specify at least the error name:

```js
// barebones
errors.create({name: 'RuntimeError'});
console.log(new errors.RuntimeError().toString());
```

produces:
```
RuntimeError: An unexpected RuntimeError occurred.
Code: 601
```

You can define a default message for the error:

```js
// default message
errors.create({
    name: 'RuntimeError',
    defaultMessage: 'A runtime error occurred during processing'
});
console.log(new errors.RuntimeError().toString());
```

which outputs:
```
RuntimeError: A runtime error occurred during processing
Code: 602

```

Define a default message, explanation and response:

```js
// default message, explanation and response
errors.create({
    name: 'FileNotFoundError',
    defaultMessage: 'The requested file could not be found',
    defaultExplanation: 'The file /home/boden/foo could not be found',
    defaultResponse: 'Verify the file exists and retry the operation'
});
console.log(new errors.FileNotFoundError().toString());
```

gives us:
```
FileNotFoundError: The requested file could not be found
Code: 603
Explanation: The file /home/boden/foo could not be found
Response: Verify the file exists and retry the operation

```

Override messages on instantiation:
```js
// override messages
console.log(new errors.FileNotFoundError(
        'Cannot read file'
        , 'You do not have access to read /root/foo'
        , 'Request a file you have permissions to access').toString());
```

outputs:
```
FileNotFoundError: Cannot read file
Code: 603
Explanation: You do not have access to read /root/foo
Response: Request a file you have permissions to access

```

Use the options style constructor to assign standard properties:
```js
console.log(new errors.Http401Error({
	message: "Expired Token",
	explanation: "Your token has expired"}).toString());
```

outputs:
```
Http401Error: Expired Token
Code: 401
Explanation: Your token has expired
Error: Expired Token
```

Using the options style constructor you can also assign
arbitrary non-standard properties:
```js
console.log(new errors.Http401Error({
	message: "Expired Token",
	explanation: "Your token has expired",
	expired: new Date()}).toString());
```

outputs:
```
Http401Error: Expired Token
Code: 401
Explanation: Your token has expired
expired: Fri Jun 20 2014 04:19:41 GMT-0400 (EDT)
```

Note however that you cannot assign values to the
`stack`, `name` or `code` standard property:
```js
console.log(new errors.Http401Error({
	name: "ExpiredToken"}).toString());
```

outputs:
```
/home/boden/workspace/errors/lib/errors.js:261
    			throw Error("Properties 'stack', 'name' or 'code' " +
    			      ^
Error: Properties 'stack', 'name' or 'code' cannot be overridden
    at Error (<anonymous>)
    at new scope.(anonymous function) (/home/boden/workspace/errors/lib/errors.js:261:14)
    at Object.<anonymous> (/home/boden/workspace/errors/examples/basic/usage.js:126:13)
    at Module._compile (module.js:456:26)
    at Object.Module._extensions..js (module.js:474:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Function.Module.runMain (module.js:497:10)
    at startup (node.js:119:16)
    at node.js:906:3
```

## Error codes

If you don't provide a `code` when defining the error, a unique code will
be assigned for you. Unique codes start at 600 and increase by 1 for each
error defined.

If you prefer to manage your own error codes, for example to group related
errors into blocks of codes, just specify a `code`:
```js
// define code
errors.create({
    name: 'SecurityError',
    code: 1100
});
console.log(new errors.SecurityError().toString());
```

which logs:
```
SecurityError: An unexpected SecurityError occurred.
Code: 1100

```

## Inheritance

You can build a hierarchy of errors by specifying the `parent` your
error should inherit from. If no `parent` is specified, the error
will inherit from `Error`.

For example:
```js
// inheritance
errors.create({
    name: 'FatalError',
    defaultMessage: 'A fatal error occurred',
});
errors.create({
    name: 'FatalSecurityError',
    defaultMessage: 'A security error occurred, the app must exit',
    parent: errors.FatalError
});
try {
    throw new errors.FatalSecurityError();
} catch (e) {
    if (e instanceof errors.FatalError) {
        // exit
        console.log("Application is shutting down...");
    }
}
```

will produce:
```
Application is shutting down...
```

## Namespacing

By default, newly defined errors are created on the `exports` of
the errors module, but you can specify where the error should
be defined.

For example to define an error on your module's `exports`:
```js
// namespace
errors.create({
    name: 'MalformedExpressionError',
    scope: exports
});
console.log(new exports.MalformedExpressionError().toString());
```

## Looking up errors

For convenience, errors keeps track of all the errors you've defined
via the errors module and allows you to look them up via `name` or
`code`.

So from our previous example:
```js
errors.find(1100);
errors.find('SecurityError')
```

Will both return the `SecutiryError` we defined.

## Stack traces

By default stack traces are disabled which means that error methods
like `toString()` and `toJSON()` return representation without stack 
traces. You can enable stack traces by leveraging the `errors.stacks()`
method.

For example:
```js
errors.stacks(true);
new errors.Http413Error().toString();
// => includes stack trace
new errors.Http413Error().toJSON();
// => includes a 'stack' property
```

You can also use the `errors.stacks()` method without arguments to 
retrieve the current value of stacks.

This allows you to write code like:
```js
if (errors.stacks()) {
    // => stack traces enabled
}
```

## Mappers

You can register and leverage mapper functions which allow you to
map from one (or more) error types into another.

For example if you wanted to mask invalid user and password errors into
a generic credentials error:
```js
// mappers
errors.create({name: 'InvalidUsernameError'});
errors.create({name: 'InvalidPasswordError'});
errors.mapper(['InvalidUsernameError', 'InvalidPasswordError'], function(err) {
    return new errors.SecurityError('Invalid credentials supplied');
});
console.log(errors.mapError(new errors.InvalidUsernameError()).toString());
console.log(errors.mapError(new errors.InvalidPasswordError()).toString());
```

outputs:
```
SecurityError: Invalid credentials supplied
Code: 1100
SecurityError: Invalid credentials supplied
Code: 1100

```

## Predefined HTTP 4xx-5xx errors

The errors module predefines a set of errors which represent HTTP
4xx-5xx responses. These errors are exported by the errors module and use the
naming convention `Http[code]Error`. For example `Http401Error` and 
`Http500Error` which have a code of `401` and `500` respectively.

For example to leverage the HTTP errors:
```js
throw new errors.Http401Error();
// ...
throw new errors.Http500Error('Something bad happened');
```

## Connect/Express middleware integration

**Compatibility**
Errors version 0.1.0 only works with Express < 4.0.0. 

You can use your custom errors with connect's or express's `errorHandler()`
middleware as you might expect:

```js
// ...
app.use(function(req, res, next) {
    // bubble up to errorHandler
    throw new errors.Http401Error();
});
app.use(express.errorHandler());
// ...
```
However due to the additional information captured in custom errors
such as the `response` and `explanation`, the default HTML formatting
of connect/express `errorHandler()` is not as pretty as you might like.

Therefore errors provides its own flavor of middleware.

In its simplest form just use `errors.errorHandler()` as you would do with
connect or express. This simple form of the middleware will include the 
additional datums stored in the custom error such as the `explanation`
and `response`. But the `errors.errorHandler()` middleware also accepts 
some optional arguments to customize its behavior.

Specifically you can set the title to use for HTML based responses, override
if the stack should be included and also specify if the middleware should 
use `connectCompat` mode. In `connectCompat` mode the HTML based responses
look exactly as they would with connect/express `errorHandler()` and do 
not include the additional datums from your error.

For example
```js
// ...
app.use(errors.errorHandler({title: 'Errors Middleware', includeStack: true}));
// ...
```
binds the errors `errorHandler` using a custom title and which will include 
stack traces. Note that using the `includeStack` property overrides the 
current value of `errors.stacks()`.

## Express send integration

When the errors module is first imported, it determines if `express` is
installed. If express is installed, errors automatically patches `express`'s 
`response.send()` method to support `send()`ing `Error` based objects.

So the following is valid:
```js
app.get('/users/:user', function(req, res) {
    users.get(req.params.user, function(err, user) {
        return res.send(err || user || new errors.Http404Error('User does not exist'));
    });
});
```

By default both vanilla errors (those provided by the JS runtime) and errors
which have a `code` which is not a valid HTTP status code are mapped to a `500`
response.

So:
```js
res.send(new Error('Vanilla JS error'));
```

and
```js
res.send(new errors.find('MyErrorName'));
```

both will result in a `500` response.

Mappers can also be used with `express`'s `send()` method.

For example:
```js
errors.mapper('RangeError', function(rangeError) {
    return new errors.Http412Error('Invalid range requested');
})
.mapper('ReferenceError', function(refError) {
    return new errors.Http424Error('Bad reference given');
})
.mapper('SyntaxError', function(syntaxError) {
    return new errors.Http400Error('Invalid syntax');
});

// ...

res.send(new RangeError());
// => 412 response as per mapper

res.send(new ReferenceError());
// => 424 response as per mapper

res.send(new SyntaxError());
// => 400 response as per mapper
```

The implementation provides direct support for `application/json`, 
`text/html` and `text/plain` content types. If the `request` specifies
a different `Accept` type, the response defaults to `text/plain`. Moreover
`application/json` responses provide a complete _JSONifed_ representation
of the error.

For example the following setup:
```js
errors.create({
    name: 'DatabaseConnectionError',
    defaultExplanation: 'Unable to connect to configured database.',
    defaultResponse: 'Verify the database is running and reachable.'
});

// ...
res.send(new errors.DatabaseConnectionError());
```

Will produce the JSON response below when `application/json`
is used as the accept type:
```
{
    "explanation": "Unable to connect to configured database.",
    "response": "Verify the database is running and reachable.",
    "code": 601,
    "status": 500,
    "name": "DatabaseConnectionError",
    "message": "An unexpected DatabaseConnectionError occurred."
}
```

For HTML based responses, `send()`ing an error will produce a HTML 
response that looks like express's or connect's `errorHandler()` middleware. 
That is, it's an HTML page with minimal styling. Moreover you can control 
the HTML response page title using the `errors.title('My Title')` method. 
You can also control if stack traces should be included in the `send()` by 
using the `errors.stacks()` method. 

## License

(The MIT License)

Copyright (c) 2012 Boden Russell &lt;bodensemail@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
