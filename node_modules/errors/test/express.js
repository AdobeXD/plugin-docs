
var request = require('supertest')
    , express = require('express')
    , errors = require('..')
    , http = require('http')
    , assert = require('assert');

errors.create({name: 'DatabaseError'});

var app = express();

app.get('/errors/:error', function(req, res) {
    var err = isNaN(parseInt(req.params.error))
        ? req.params.error
        : parseInt(req.params.error);
    var TheError = errors.find(err) || errors.Http404Error;

    return res.send(new TheError());
});

function testError(code) {

    return function() {
        var Err = errors.find(parseInt(code))
            , uri = "/errors/" + code;

        function validateResponse(res, accept, err) {
            switch (accept) {
                case 'text/plain':
                    assert.equal(res.header['content-type'], 'text/plain');
                    assert.equal(res.text, err.toString());
                    break;
                case 'application/json':
                    assert.equal(res.header['content-type'], 'application/json');
                    assert.deepEqual(JSON.parse(res.text), {error: err.toJSON()});
                    break;
                case 'text/html':
                    assert.equal(res.header['content-type'], 'text/html; charset=utf-8');
                    for (var key in err.toJSON()) {
                        if (~res.body.toString().indexOf(err[key])) {
                            assert.fail(res.body.toString()
                                    , err[key]
                                    , "did not find", "\n");
                        }
                    }
                    break;
            }
        };

        ['text/plain', 'text/html', 'application/json'].forEach(function(accept) {
            it('respond with ' + accept, function(done) {
                request(app)
                    .get(uri)
                    .set('Accept', accept)
                    .expect(parseInt(code))
                    .end(function(err, res) {
                        if (err) {
                            done(err);
                        }
                        validateResponse(res, accept, new Err());
                        done();
                    });
            });
        });
    };
};

for (code in http.STATUS_CODES) {
    if (http.STATUS_CODES.hasOwnProperty(code) && code >= 400) {
        describe('GET /errors/' + code, testError(code));
    }
}

describe('Enabling stack traces', function() {

    it('toJSON() should contain stack trace', function() {
        errors.stacks(true);
        new errors.Http413Error().toJSON().should.have.property('stack');
    });

    errors.stacks(true);
    testError(413);
    errors.stacks(false);


    it('toJSON() should not contain stack trace', function() {
        errors.stacks(false);
        new errors.Http413Error().toJSON().should.not.have.property('stack');
    });
});

describe('Page title', function() {
    var orgTitle = errors.title();

    it('Should include specified title', function(done) {
        errors.title('My Error Title');
        request(app)
            .get('/errors/413')
            .set('Accept', 'text/html')
            .expect('Content-Type', /html/)
            .expect(413)
            .end(function(err, res) {
                if (err) {
                    done(err);
                }
                res.text.should.include('<h1>My Error Title</h1>');
                errors.title(orgTitle);
                done();
            });
    });
});

describe('Unsupported accept type', function() {

    var Http418Error = errors.find(418);

    it('should return text/plain', function(done) {
        request(app)
            .get("/errors/418")
            .set('Accept', 'text/csv')
            .expect('Content-Type', 'text/plain')
            .expect(418, new Http418Error().toString(), done);
    });
});

describe('Out of range error code handling', function() {

    var LDAPError = errors.create({name: 'LDAPError'})
        , DTLSError = errors.create({name: 'DTLSError'})
        , ldapError = new LDAPError()
        , dtlsError = new DTLSError();

    it(ldapError.code + ' should map to 500', function(done) {
        request(app)
            .get('/errors/' + ldapError.code)
            .set('Accept', 'text/plain')
            .expect('Content-Type', 'text/plain')
            .expect(500, ldapError.toString(), done);
    });

    it(dtlsError.code + ' should map to 500', function(done) {
        request(app)
            .get('/errors/' + dtlsError.code)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(500, {error: dtlsError.toJSON()}, done);
    });
});

var InvalidUsernameError = errors.create({
    defaultMessage: 'Invalid username provided'
    , name: 'InvalidUsernameError'
    , defaultExplanation: 'The username provided is invalid and cannot be authenticated'
    , defaultResponse: 'Specify the proper username in the credentials and retry'
});
var InvalidPasswordError = errors.create({
    defaultMessage: 'Invalid password provided'
    , name: 'InvalidPasswordError'
    , defaultExplanation: 'The password provided is invalid and cannot be authenticated'
    , defaultResponse: 'Specify the proper password in the credentials and retry'
});

var maskedCredentialsError = new errors.Http401Error("Invalid username or password provided"
        , "The username and/or password provided cannot be authenticated"
        , "Specify the proper credentials and retry the operation");

errors.mapper(['InvalidUsernameError', 'InvalidPasswordError'], function(err) {
    return maskedCredentialsError;
});

describe('Username and password error mappings', function() {
    it('should map username error to 401', function(done) {
        request(app)
            .get('/errors/InvalidUsernameError')
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json')
            .expect(401, {error: maskedCredentialsError.toJSON()}, done);
    });

    it('should map password error to 401', function(done) {
        request(app)
            .get('/errors/InvalidPasswordError')
            .set('Accept', 'text/html')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(401)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }
                for (var key in maskedCredentialsError.toJSON()) {
                    if (~res.body.toString().indexOf(maskedCredentialsError[key])) {
                        assert.fail(res.body.toString()
                                , maskedCredentialsError[key]
                                , "did not find", "\n");
                    }
                }
                done();
            });
    });
});