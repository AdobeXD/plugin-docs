

<!-- Start /home/boden/git/errors/lib/errors.js -->

## JS_ERRORS

JavaScript Error constructors indexed by name
for convenience.

Examples:

 new errors.JS_ERRORS.URIError('Malformed URI');

## cache({String}, {Number}, {Function})

Cache the given error constructor indexed by the
given name and code.

### Params: 

* **name** *{String}* name

* **code** *{Number}* code

* **err** *{Function}* err

## nextCode()

Return the next free error code.

## find(err)

Returns the error constructor by the given code or
name.

Examples:

 errors.find(404);
 // =&gt; Http404Error

 errors.find(500);
 // =&gt; Http500Error

 errors.find('Http401Error');
 // =&gt; http401Error

### Params: 

* **String|Number** *err* 

## isError(err)

Determines if the given `Error` object was created using
the errors framework.

### Params: 

* **Object** *err* The error to check

## create

Create a new constructor instance based
on the given options.

This factory method allows consumers to build
parameterized error constructor function instances
which can then be used to instantiate new concrete
instances of the given error.

This method accepts jQuery style `options` argument
with the following properties (note that `name` is
the only required property, all others are optional).

The `scope` option can be used to change the default
namespace to create the constructor in. If unspecified
it defaults to the `exports` object of this module
(i.e. `errors.exports`).

The `parent` option specifies the parent to inherit
from. If unspecified it defaults to `Error`.

The `defaultMessage`, `defaultExplanation` and
`defaultResponse` define the default text to use
for the new errors `message`, `explanation` and
`response` respectively. These values can be
overridden at construction time.

The `code` specifies the error code for the new
error. If unspecified it defaults to a generated
error number which is greater than or equal to
600.

Examples:

 // use all defaults
 errors.create({name: 'FileNotFoundError'});
 throw new errors.FileNotFoundError(&quot;Could not find file x&quot;);

 // inheritance
 errors.create({
     name: 'FatalError',
     code: 900
 });
 errors.create({
     name: 'DatabaseError',
     parent: errors.FatalError
     code: 901
 });
 var dbe = new errors.DatabaseError(&quot;Internal database error&quot;);
 dbe instanceof errors.FatalError;
 // =&gt; true

 // scoping to current module exports
 var MalformedEncodingError = errors.create({
     name: 'MalformedEncodingError',
     scope: exports
 });
 throw new MalformedEncodingError(&quot;Encoding not supported&quot;);

 // default message
 errors.create({
     name: 'SocketReadError',
     code: 4000,
     defaultMessage: 'Could not read from socket'
 });
 var sre = new errors.SocketReadError();
 sre.message;
 // =&gt; 'Could not read from socket'
 sre.code;
 // =&gt; 4000
 sre instanceof Error;
 // =&gt; true

 // explanation and response
 errors.create({
     name: 'SocketReadError',
     code: 4000,
     defaultMessage: 'Could not read from socket',
     defaultExplanation: 'Unable to obtain a reference to the socket',
     defaultResponse: 'Specify a different port or socket and retry the operation'
 });
 var sre = new errors.SocketReadError();
 sre.explanation;
 // =&gt; 'Unable to obtain a reference to the socket'
 sre.response;
 // =&gt; 'Specify a different port or socket and retry the operation'

### Params: 

* **String** *name* The constructor name.

* **Object** *scope* The scope (i.e. namespace).

* **Function** *parent* The parent to inherit from.

* **String** *defaultMessage* The default message.

* **Number** *code* The error code.

* **String** *defaultExplanation* The default explanation.

* **String** *defaultResponse* The default operator response.

### Return:

* **Function** the newly created constructor

Create a new instance of the exception optionally
specifying a message, explanation and response
for the new instance. If any of the arguments are
null, their value will default to their respective
default value use on the `create` call, or will
be null if no default was specified.

### Params: 

* **String** *msg* The message to use for the error.

* **String** *expl* The explanation to use for the error.

* **String** *fix* The response to use for the error.

### Return:

* **Object** The newly created error.

Return the stack tracks for the error.

### Return:

* **String** 

Return the explanation for this error.

### Return:

* **String** 

Return the operator response for this error.

### Return:

* **String** 

Return the error code.

### Return:

* **Number** 

HTTP status code of this error.

If the instance's `code` is not a valid
HTTP status code it's normalized to 500.s

### Return:

* **Number** 

Name of this error.

### Return:

* **String** 

Message for this error.

### Return:

* **String** 

Return the name of the prototype.

### Return:

* **String** 

Return a formatted string for this error which
includes the error's `name`, `message` and `code`.
The string will also include the `explanation` and
`response` if they are set for this instance.

Can be redefined by consumers to change formatting.

### Return:

* **String** 

Return the JSON representation of this error
which includes it's `name`, `code`, `message`
and `status`. The JSON object returned will
also include the `explanation` and `response`
if defined for this instance.

This method can be redefined for customized
behavior of `JSON.stringify()`.

### Return:

* **Object** 

## stacks(useStacks)

Get/set the module default behavior in terms of if
stack traces should be included in `toString()`,
`send()`ing errors, etc.

When called with no parameters this method will return
if the errors module is set to use stacks or not.

When called with a single boolean parameter this
method will interally set if stack traces should be used.

### Params: 

* **Boolean** *useStacks* 

## title(title)

Gets/sets the module's default page title to use for
html based responses.

If called with no arguments, returns the current title
set. Otherwise when called with a single `String` argument
sets the title to use for html based responses.

The default title is 'Error'.

### Params: 

* **String** *title* The title to use.

## mixin(src, dest, skipEmpty)

Perform a top level mixing between and source
and destination object optionally skipping
undefined/null properties.

Examples:

 mixin({a: 'A'}, {b: 'B});
 // =&gt; {a: 'A', b: 'B'}

 mixin({'a': null}, {b: 'B}, true);
 // =&gt; {b: 'B'}

### Params: 

* **Object** *src* 

* **Object** *dest* 

* **Boolean** *skipEmpty* 

Base `Error` for web app HTTP based
exceptions -- all 4xx and 5xx wrappered
errors are instances of `HttpError`.

`HttpError`s for all 4xx-5xx HTTP based status codes
defined as `Http[code]Error` for convenience.

Examples:

 // Accept: text/html
 res.send(new errors.Http404Error('Resource not found'));
 // =&gt; text/html
 // =&gt; &quot;Resource not found&quot;

 // Accept: application/json
 res.send(new errors.Http423Error('Resource is currently locked'));
 // =&gt; application/json
 // {
 //      &quot;name&quot;: &quot;Http423Error&quot;,
 //      &quot;code&quot;: 423,
 //      &quot;status&quot;: 423,
 //      &quot;message&quot;: &quot;Resource is currently locked&quot;
 // }

 // Accept: text/plain
 // res.send(new errors.Http401Error('You do not have access'));
 // =&gt; text/plain
 // &quot;You do not have access&quot;

## errorHandler(title, connectCompat, includeStack)

Custom error handler middleware based on connect's
`errorHandler()` middleware. Althought out of the box
connect or express errorHandler() works just fine,
its not as pretty as you might like due to the additional
details in custom error's `toString()`.

Therefore `errors` exports its own `errorHandler()`
middleware which supports an `options` object to configure
it.

The `options` JSON object accepts the following properties:

### Params: 

* **String** *title* The title to use for html based responses which overrides module `title()`.

* **Boolean** *connectCompat* True to create connect compat html responses.

* **Boolean** *includeStack* True if the custom error handler should include the stack.

If Express is installed, patch `response` to
permit `send`ing `Error` based objects. If
vanilla `Error` objects are used with `send`,
they are mapped by default to the `Http500Error`.

Prior to `send`ing an error based response, any
mapper setup for the `Error` is invoked allowing
customization or transformation of the error.

The current implementation provides direct support
for `text/html`, `text/plain` and `application/json`
based accept types, otherwise it defaults to `plain/text`.

Examples:

 // Accept: text/html
 res.send(new errors.Http404Error('Resource not found'));
 // =&gt; html
 // =&gt; html structured response

 // Accept: application/json
 res.send(new errors.Http423Error('Resource is currently locked'));
 // =&gt; application/json
 // =&gt; {
 // =&gt;   'name': 'Http423Error',
 // =&gt;   'code': 423,
 // =&gt;   'status': 423,
 // =&gt;   'message': 'Resource is currently locked'
 // =&gt; }

 // Accept: text/plain
 // res.send(new errors.Http401Error('You do not have access'));
 // =&gt; text/plain
 // =&gt; &quot;You do not have access&quot;

 // Accept: text/xml
 // res.send(new errors.Http500Error('Something bad happened'));
 // =&gt; 500
 // =&gt; text/plain

## defaultFormatter(title, includeStack)

Returns the default formatter which handles
responses for the middleware and `send()` method.
This code is based on `connect`'s `errorHandler`.

### Params: 

* **String** *title* The title to use for html response.

* **Boolean** *includeStack* If we should include the stack trace.

## asArray(obj)

Returns the argument as an `Array`. If
the argument is already an `Array`, it's
returned unchanged. Otherwise the given
argument is returned in a new `Array`.

Examples:

 asArray('a');
 // =&gt; ['a']

 asArray(null);
 // =&gt; []

 asArray(['a', 'b']);
 // =&gt; ['a', 'b']

### Params: 

* **Object|Array** *obj* The object to wrap in an array.

## mapper

Adds or retrieves an error mappers.

When called with 2 arguments, this method is used to
add error mappers for the given error names.

When called with a single argument it's used to
retrieve the registered mapper for the given
error name.

Any bound mappers will be invoked
for `express.send()` integration and hence you
can define mappers used when sending error responses
with Express.

Examples:

 // adding mappers
 errors.mapper('RangeError', function(rangeError) {
     return new errors.Http412Error('Invalid range requested');
 })
 .addmapper('ReferenceError', function(refError) {
     return new errors.Http424Error('Bad reference given');
 });

 errors.mapper(['RangeError', 'ReferenceError'], function(err) {
     return new errors.Http500Error(err.message);
 });

 // retrieve error mapper
 var rangeError = errors.mapper('RangeError');

### Params: 

* **String|Array** *errName* The error name(s) to attach the mapper to.

* **Function** *fn* The function to call for the mapping.

## mapError

Maps the given error using the bound error mapper
and returns the mapped error as per the mappers
return value. If no mapper is bound to the given
errors name, the argument error is returned unchanged.

Examples:

 errors.mapError(new RangeError());

### Params: 

* **Object** *err* The error instance to map.

<!-- End /home/boden/git/errors/lib/errors.js -->

