
var errors = require('../..');

// barebones
errors.create({name: 'RuntimeError'});
console.log(new errors.RuntimeError().toString());

console.log("-------------");

// default message
errors.create({
    name: 'RuntimeError',
    defaultMessage: 'A runtime error occured during processing'
});
console.log(new errors.RuntimeError().toString());

console.log("-------------");

// default message, explanation and response
errors.create({
    name: 'FileNotFoundError',
    defaultMessage: 'The requested file could not be found',
    defaultExplanation: 'The file /home/boden/foo could not be found',
    defaultResponse: 'Verify the file exists and retry the operation'
});
console.log(new errors.FileNotFoundError().toString());

console.log("-------------");

// override messages
console.log(new errors.FileNotFoundError(
        'Cannot read file'
        , 'You do not have access to read /root/foo'
        , 'Request a file you have permissions to access').toString());

console.log("-------------");

// define code
errors.create({
    name: 'SecurityError',
    code: 1100
});
console.log(new errors.SecurityError().toString());

console.log("-------------");

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

console.log("-------------");

// namespace
errors.create({
    name: 'MalformedExpressionError',
    scope: exports
});
console.log(new exports.MalformedExpressionError().toString());

console.log("-------------");

// lookup
if (errors.find(1100) === errors.find('SecurityError')) {
    console.log("Found em");
}

console.log("-------------");

// mappers
errors.create({name: 'InvalidUsernameError'});
errors.create({name: 'InvalidPasswordError'});
errors.mapper(['InvalidUsernameError', 'InvalidPasswordError'], function(err) {
    return new errors.SecurityError('Invalid credentials supplied');
});
console.log(errors.mapError(new errors.InvalidUsernameError()).toString());
console.log(errors.mapError(new errors.InvalidPasswordError()).toString());

console.log("-------------");

// stacks
errors.stacks(true);
console.log(new errors.Http413Error().toString());
console.log(new errors.Http413Error().toJSON());


console.log("---------------");

// options style constructor
errors.create({name:'IdentifiableError'});
console.log(new errors.IdentifiableError({
	message: "Unexpected error",
	refID: "a1b2c3",
	status: 500}).toString());
console.log(new errors.IdentifiableError({
	message: "Unexpected error",
	refID: "a1b2c3",
	status: 500}).toJSON());


console.log("---------------");

// override status in proto
errors.create({name: 'CustomHttpError', status: 488});
console.log(new errors.CustomHttpError().toString());
console.log(new errors.CustomHttpError().toJSON());
