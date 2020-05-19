
var errors = require('..')
    , http = require('http');

describe('errors export structure', function() {
    it('should contain find() method', function() {
        errors.should.be.a('object').and.have.property('find');
        errors.find.should.be.a('function');
    });

    it('should contain a create method', function() {
        errors.create.should.be.a('function');
        errors.create.should.have.length(1);
    });

    it('should contain HttpError', function() {
        errors.HttpError.should.be.a('function');
        var httpError = new errors.HttpError();
        httpError.should.an.instanceOf(Error);
        httpError.code.should.be.above(599);
    });

    for (code in http.STATUS_CODES) {
        it('should contain ' + http.STATUS_CODES[code] + ' Error', function() {
            var errorName = 'Http' + code + 'Error'
                , errorInstance = new errors[errorName]();
            errors[errorName].should.be.a('function');
            errorInstance.should.be.an.instanceOf(errors.HttpError);
            errorInstance.code.should.equal(code);
            errorInstance.message.should.equal(http.STATUS_CODES[code]);
            errorInstance.status.should.equal(code);
        });
    }
});

var FatalError = errors.create({
    name: 'FatalError',
    defaultMessage: 'A Fatal Error Occurred.'
});
var FatalDBError = errors.create({
    name: 'FatalDBError',
    parent: FatalError,
    defaultMessage: 'A Fatal Database Error Occurred.'
});
var FatalDBTransactionError = errors.create({
    name: 'FatalDBTransactionError',
    parent: FatalDBError,
    defaultMessage: 'A Fatal Database Transaction Error Occurred.'
});

var fatalError = new FatalError()
    , fatalDBError = new FatalDBError()
    , fatalDBTransError = new FatalDBTransactionError();

describe('errors inheritance', function() {

    it('FatalError extends Error', function() {
        errors.FatalError.should.equal(FatalError);
        FatalError.should.be.a('function');
        fatalError.should.be.an.instanceOf(Error);
        fatalError.code.should.be.above(599);
        fatalError.message.should.equal('A Fatal Error Occurred.');
        fatalError.status.should.equal(500);
    });

    it('FatalDBError extends FatalError', function() {
        errors.FatalDBError.should.equal(FatalDBError);
        FatalDBError.should.be.a('function');
        fatalDBError.should.be.an.instanceOf(FatalError);
        fatalDBError.should.not.be.an.instanceOf(FatalDBTransactionError);
        fatalDBError.code.should.be.above(599);
        fatalDBError.code.should.not.equal(new FatalError().code);
        fatalDBError.message.should.equal('A Fatal Database Error Occurred.');
        fatalDBError.status.should.equal(500);
    });

    it('FatalDBTransactionError extends FatalDBError', function() {
        errors.FatalDBTransactionError.should.equal(FatalDBTransactionError);
        FatalDBTransactionError.should.be.a('function');
        fatalDBTransError.should.be.an.instanceOf(FatalDBError);
        fatalDBTransError.code.should.be.above(599);
        fatalDBTransError.code.should.not.equal(new FatalDBError().code);
        fatalDBTransError.message.should.equal('A Fatal Database Transaction Error Occurred.');
        fatalDBTransError.status.should.equal(500);
    });
});

describe('errors.find()', function() {

    it('should find existing error by code', function() {
        errors.find(fatalDBError.code).should.equal(FatalDBError);
    });

    it('should find existing error by name', function() {
        errors.find(fatalDBError.name).should.equal(FatalDBError);
    });

    it('should not find error for non-existing code', function() {
        require('should').not.exist(errors.find(9999));
    });

    it('should not find error for non-existing name', function() {
        require('should').not.exist(errors.find('FatalDDBError'));
    });
});

describe('errors unique error code generation', function() {

    it('should create unique error codes', function() {
        (fatalError.code).should.not.equal(fatalDBError.code);
        (fatalDBError.code).should.not.equal(fatalDBTransError.code);
    });

    it('should not hammer existing error code', function() {
        var FileNotFoundError = errors.create({
            name: 'FileNotFoundError',
            code: fatalDBTransError.code + 1
        });
        var IOError = errors.create({
            name: 'IOError'
        });

        var fnfError = new FileNotFoundError()
            , ioError = new IOError();

        (fnfError.code).should.not.equal(ioError.code);
        ioError.code.should.be.above(fatalDBTransError.code);
    });
});

describe('default error message handling', function() {

    var FileEncodingError = errors.create({
        name: 'FileEncodingError',
        defaultMessage: 'File encoding is invalid and cannot be read.'
    });
    var feError = new FileEncodingError();

    it('should use default message when none specified', function() {
        feError.message.should.eql('File encoding is invalid and cannot be read.');
    });

    it('should allow default message overriding', function() {
        var err = new FileEncodingError('dude, the encoding is bad');
        err.message.should.eql('dude, the encoding is bad');
    });
});

describe('scoped creation', function() {
    var MalformedInputError = errors.create({
        name: 'MalformedInputError',
        scope: exports
    });

    it('should exist in exports', function() {
        require('should').exist(exports.MalformedInputError);
        exports.MalformedInputError.should.equal(MalformedInputError);
    });

    it('should find error in exports', function() {
        errors.find('MalformedInputError').should.equal(MalformedInputError);
        var err = new MalformedInputError();
        errors.find(err.code).should.equal(MalformedInputError);
    });
});

describe('errors.stacks()', function() {
    var err = new errors.Http413Error();

    it('should enable stack traces', function() {
        errors.stacks(true);
        err.toString().should.include(err.stack);
    });

    it('should return current value of stacks', function() {
        errors.stacks().should.equal(true);
    });

    it('should disable stack traces', function() {
        errors.stacks(false);
        err.toString().should.not.include(err.stack);
    });

    it('should return current value of stacks', function() {
        errors.stacks().should.equal(false);
    });
});

describe('errors.title()', function() {

    it('should allow title to be settable', function() {
        errors.title('My Title');
        errors.title().should.equal('My Title');
    });
});

describe('options style constructor', function() {
	var IdentifiableError = errors.create('IdentifiableError'),
		err = new IdentifiableError({message: 'Error with ref ID',
			status: 501, refID: 'a1b2c3'});

	it('should contain refID property', function() {
		err.refID.should.equal('a1b2c3');
	});

	it('should have overridden status', function() {
		err.status.should.equal(501);
	});

	it('toString() should output refID', function() {
		err.toString().should.include('refID: a1b2c3');
	});

	it('toJSON() should include refID', function() {
		err.toJSON().should.include({refID: 'a1b2c3'});
	});

	it('should have overriden message', function() {
		err.toString().should.include(': Error with ref ID');
	});

	it('should not allow overriding of stack', function() {
		(function() {new IdentifiableError({stack: 'fail'});}).should.throw();
	});

	it('should not allow overriding of name', function() {
		(function() {new IdentifiableError({name: 'fail'});}).should.throw();
	});

	it('should not allow overriding of code', function() {
		(function() {new IdentifiableError({code: 601});}).should.throw();
	});
});

describe('status code override', function() {
	var CustomHttpError = errors.create({name: 'CustomHttpError', status: 409}),
		err = new CustomHttpError();

	it('should have status of 409', function() {
		err.status.should.equal(409);
	});

	it('should include 409 status in toJSON()', function() {
		err.toJSON().should.include({status: 409});
	});

	it('should allow overriding in constructor', function() {
		new CustomHttpError({status:411}).status.should.equal(411);
	});
});