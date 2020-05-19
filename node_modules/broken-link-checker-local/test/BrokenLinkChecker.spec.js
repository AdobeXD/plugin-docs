import { createServer, Server } from 'http';
import { join } from 'path';
import expect from 'unexpected';
import { spy } from 'sinon';
import request from 'supertest';
import getPort from 'get-port';
import BrokenLinkChecker from '../src/BrokenLinkChecker';

/** @test {BrokenLinkChecker} */
describe('BrokenLinkChecker', function() {
  /** @test {BrokenLinkChecker#startServer} */
  describe('#startServer', function() {
    const checker = new BrokenLinkChecker();
    checker.path = __dirname;

    it('should fail with invalid port', function() {
      return expect(checker.startServer(-13), 'to be rejected with', /^Port should be/);
    });

    it('should create instance of express', function() {
      return getPort()
        .then(port => checker.startServer(port))
        .then(() => {
          expect(checker.app, 'to be a', 'function');
        });
    });

    it('should create instance of http.Server', function() {
      return getPort()
        .then(port => checker.startServer(port))
        .then(() => {
          expect(checker.server, 'to be a', Server);
        });
    });

    it('should serve on custom baseUrl if passed', async function() {
      checker.options = { baseUrl: '/test/' };

      const port = await getPort();
      await checker.startServer(port);

      const index = await request(checker.app).get('/');
      expect(index.status, 'to equal', 404);

      const customIndex = await request(checker.app).get('/test/BrokenLinkChecker.spec.js');
      expect(customIndex.status, 'to equal', 200);
    });

    it('should fail without path', function() {
      checker.path = false;
      return expect(checker.startServer(9000), 'to be rejected with', 'No path given');
    });
  });

  /** @test {BrokenLinkChecker#runChecker} */
  describe('#runChecker', function() {
    let checker;

    this.timeout(5000);

    beforeEach(() => (checker = new BrokenLinkChecker()));

    it('should fail without port and url', function() {
      return expect(checker.runChecker(), 'to be rejected with', 'No url given');
    });

    it('should fail with invalid url', function() {
      checker.url = 'http://localhost:80';
      return expect(checker.runChecker(), 'to be fulfilled with', 1);
    });

    it('should fail with path to invalid document', function() {
      checker.path = join(__dirname, 'fixtures', 'broken');

      return expect(
        getPort()
          .then(port => checker.startServer(port))
          .then(port => checker.runChecker(port)),
        'to be fulfilled with', 1
      );
    });

    it('should work with path to valid document', function() {
      checker.path = join(__dirname, 'fixtures', 'no-broken');

      return expect(
        getPort()
          .then(port => checker.startServer(port))
          .then(port => checker.runChecker(port)),
        'to be fulfilled with', 0
      );
    });
  });

  /** @test {BrokenLinkChecker#validateOptions} */
  describe('#validateOptions', function() {
    it('should fail without non-optional argument', function() {
      const checker = new BrokenLinkChecker();

      return expect(checker.validateOptions(), 'to be rejected with',
        'Neither directory nor url given'
      );
    });

    it('should fail with multiple non-optional arguments ', function() {
      const checker = new BrokenLinkChecker(['dir', 'another']);

      return expect(checker.validateOptions(), 'to be rejected with',
        'Too many non-option arguments: got 2, maximum of 1'
      );
    });

    it('should work with single non-optional argument', function() {
      const checker = new BrokenLinkChecker(['dir']);

      return expect(checker.validateOptions(), 'when fulfilled', 'to be a', 'object');
    });

    it('should add leading slash to base-url if needed', async function() {
      const checker = new BrokenLinkChecker(['dir', '--base-url', 'asdf']);

      await expect(checker.validateOptions(), 'when fulfilled', 'to be a', 'object');
      expect(checker.baseUrl, 'to equal', '/asdf');
    });
  });

  /** @test {BrokenLinkChecker#getPathOrUrl} */
  describe('#getPathOrUrl', function() {
    it('should set url if a url is passed', function() {
      const checker = new BrokenLinkChecker(['http://google.com']);

      return checker.validateOptions()
        .then(() => checker.getPathOrUrl())
        .then(() => expect(checker.url, 'to equal', 'http://google.com'));
    });

    it('should set path if a path is passed', function() {
      const checker = new BrokenLinkChecker(['./directory']);

      return checker.validateOptions()
        .then(() => checker.getPathOrUrl())
        .then(() => expect(checker.path, 'to equal', join(process.cwd(), 'directory')));
    });
  });

  /** @test {BrokenLinkChecker#exit} */
  describe('#exit', function() {
    let checker;
    let consoleError;

    before(function() {
      consoleError = spy(console, 'error');
    });

    beforeEach(function() {
      checker = new BrokenLinkChecker();
    });

    it('should set exitCode', function() {
      checker.exit(123);
      expect(process.exitCode, 'to equal', 123);
    });

    it('should report error', function() {
      const errorMessage = 'an error';

      checker.exit(1, new Error(errorMessage));
      expect(consoleError.calledOnce, 'to be', true);
      expect(consoleError.lastCall.args[0], 'to contain', errorMessage);
    });

    it('should close server', function(done) {
      checker.server = createServer();
      checker.server.on('close', done);

      checker.exit(1);
    });

    after(function() {
      console.error.restore(); // eslint-disable-line no-console
    });
  });

  /** @test {BrokenLinkChecker#launch} */
  describe('#launch', function() {
    this.timeout(5000);

    it('should fail with invalid directory', function() {
      const checker = new BrokenLinkChecker([join('test', 'fixtures', 'broken')]);

      return expect(checker.launch(), 'to be fulfilled with', 1);
    });

    it('should work with valid directory', function() {
      const checker = new BrokenLinkChecker([join('test', 'fixtures', 'no-broken')]);

      return expect(checker.launch(), 'to be fulfilled with', 0);
    });

    it('should fail with invalid url', function() {
      const checker = new BrokenLinkChecker(['htt://ls-age.com']);

      return expect(checker.launch(), 'to be fulfilled with', 1);
    });

    it('should work with valid url', function() {
      const checker = new BrokenLinkChecker([join('test', 'fixtures', 'no-broken')]);

      return expect(
        getPort()
          .then(() => checker.validateOptions())
          .then(() => checker.getPathOrUrl())
          .then(getPort)
          .then(port => checker.startServer(port))
          .then(port => (new BrokenLinkChecker([`http://localhost:${port}`])).launch()),
        'to be fulfilled with', 0
      );
    });
  });
});
