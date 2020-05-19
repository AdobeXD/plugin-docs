var CombinedStream, Promise, debug, isStream, makeStreams2, ofTypes, stream, streamLength,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

stream = require("stream");

Promise = require("bluebird");

streamLength = require("stream-length");

debug = require("debug")("combined-stream2");

ofTypes = function(obj, types) {
  var match, type, _i, _len;
  match = false;
  for (_i = 0, _len = types.length; _i < _len; _i++) {
    type = types[_i];
    match = match || obj instanceof type;
  }
  return match;
};

isStream = function(obj) {
  return ofTypes(obj, [stream.Readable, stream.Duplex, stream.Transform, stream.Stream]);
};

makeStreams2 = function(sourceStream) {
  var wrapper;
  if (!sourceStream || typeof sourceStream === "function" || sourceStream instanceof Buffer || (sourceStream._readableState != null)) {
    debug("already streams2 or otherwise compatible");
    return sourceStream;
  }
  if (sourceStream.httpModule != null) {
    debug("found `request` stream, using PassThrough stream...");
    return sourceStream.pipe(new stream.PassThrough());
  }
  debug("wrapping stream...");
  wrapper = new stream.Readable().wrap(sourceStream);
  if (sourceStream.destroy != null) {
    wrapper.destroy = sourceStream.destroy.bind(sourceStream);
  }
  debug("returning streams2-wrapped stream");
  return wrapper;
};

CombinedStream = (function(_super) {
  __extends(CombinedStream, _super);

  function CombinedStream() {
    this._doStreamRead = __bind(this._doStreamRead, this);
    this._doActualRead = __bind(this._doActualRead, this);
    CombinedStream.__super__.constructor.apply(this, arguments);
    this._reading = false;
    this._sources = [];
    this._currentSource = null;
    this._sourceDataAvailable = false;
    this._wantData = false;
  }

  CombinedStream.prototype.append = function(source, options) {
    if (options == null) {
      options = {};
    }
    if (!ofTypes(source, [stream.Readable, stream.Duplex, stream.Transform, stream.Stream, Buffer, Function])) {
      throw new Error("The provided source must be either a readable stream or a Buffer, or a callback providing either of those. If it is currently a string, you need to convert it to a Buffer yourself and ensure that the encoding is correct.");
    }
    debug("appending source: %s", source.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
    return this._sources.push([makeStreams2(source), options]);
  };

  CombinedStream.prototype.getStreamLengths = function() {
    debug("getting stream lengths");
    if (this._reading) {
      return Promise.reject(new Error("You can't obtain the stream lengths anymore once you've started reading!"));
    } else {
      return Promise["try"]((function(_this) {
        return function() {
          return _this._resolveAllSources();
        };
      })(this)).then((function(_this) {
        return function(actualSources) {
          _this._sources = actualSources;
          return Promise.resolve(actualSources);
        };
      })(this)).map(function(source) {
        var _ref, _ref1, _ref2, _ref3, _ref4;
        if ((((_ref = source[1]) != null ? _ref.knownLength : void 0) != null) || (((_ref1 = source[1]) != null ? _ref1.contentLength : void 0) != null)) {
          return Promise.resolve((_ref2 = (_ref3 = source[1]) != null ? _ref3.knownLength : void 0) != null ? _ref2 : (_ref4 = source[1]) != null ? _ref4.contentLength : void 0);
        } else {
          return streamLength(source[0]);
        }
      });
    }
  };

  CombinedStream.prototype.getCombinedStreamLength = function(callback) {
    debug("getting combined stream length");
    return Promise["try"]((function(_this) {
      return function() {
        return _this.getStreamLengths();
      };
    })(this)).reduce((function(total, current) {
      return total + current;
    }), 0).nodeify(callback);
  };

  CombinedStream.prototype._resolveAllSources = function() {
    var source;
    debug("resolving all sources");
    return Promise.all((function() {
      var _i, _len, _ref, _results;
      _ref = this._sources;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        source = _ref[_i];
        _results.push(this._resolveSource(source));
      }
      return _results;
    }).call(this));
  };

  CombinedStream.prototype._resolveSource = function(source) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        if (source[0] instanceof Function) {
          debug("resolving %s", source[0].toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
          return source[0](function(realSource) {
            return resolve([realSource, source[1]]);
          });
        } else {
          debug("source %s is already resolved", source[0].toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
          return resolve(source);
        }
      };
    })(this));
  };

  CombinedStream.prototype._initiateRead = function() {
    return Promise["try"]((function(_this) {
      return function() {
        _this._reading = true;
        return _this._resolveAllSources();
      };
    })(this)).then((function(_this) {
      return function(actualSources) {
        _this._sources = actualSources;
        return Promise.resolve();
      };
    })(this));
  };

  CombinedStream.prototype._read = function(size) {
    return Promise["try"]((function(_this) {
      return function() {
        if (_this._reading === false) {
          return _this._initiateRead();
        } else {
          return Promise.resolve();
        }
      };
    })(this)).then((function(_this) {
      return function() {
        return _this._doRead(size);
      };
    })(this));
  };

  CombinedStream.prototype._doRead = function(size) {
    return Promise["try"]((function(_this) {
      return function() {
        if (_this._currentSource === null) {
          return _this._nextSource(size);
        } else {
          return Promise.resolve();
        }
      };
    })(this)).then((function(_this) {
      return function() {
        return _this._doActualRead(size);
      };
    })(this));
  };

  CombinedStream.prototype._nextSource = function(readSize) {
    if (this._sources.length === 0) {
      debug("ran out of streams; pushing EOF");
      this.push(null);
      return;
    }
    this._currentSource = this._sources.shift()[0];
    this._currentIsStream = isStream(this._currentSource);
    debug("switching to new source (stream = %s): %s", this._currentIsStream, this._currentSource.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
    if (this._currentIsStream) {
      this._currentSource.once("end", (function(_this) {
        return function() {
          _this._currentSource = null;
          return _this._doRead(readSize);
        };
      })(this));
      this._currentSource.on("readable", (function(_this) {
        return function() {
          debug("received readable event, setting sourceDataAvailable to true");
          _this._sourceDataAvailable = true;
          if (_this._wantData) {
            debug("wantData queued, reading");
            return _this._doStreamRead();
          }
        };
      })(this));
    }
    return Promise.resolve();
  };

  CombinedStream.prototype._doActualRead = function(size) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        var chunk;
        if (_this._currentIsStream) {
          if (_this._sourceDataAvailable) {
            _this._doStreamRead();
            return resolve();
          } else {
            debug("want data, but no readable event fired yet, setting wantData to true");
            _this._wantData = true;
            return resolve();
          }
        } else {
          chunk = _this._currentSource;
          _this._currentSource = null;
          if (chunk !== null) {
            debug("pushing buffer %s", chunk.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
            _this.push(chunk);
          } else {
            debug("WARN: current source was null, pushing empty buffer");
            _this.push(new Buffer(""));
          }
          return resolve();
        }
      };
    })(this));
  };

  CombinedStream.prototype._doStreamRead = function() {
    return Promise["try"]((function(_this) {
      return function() {
        var chunk;
        _this._sourceDataAvailable = false;
        _this._wantData = false;
        chunk = _this._currentSource.read();
        if (chunk != null) {
          _this.push(chunk);
        }
        return Promise.resolve();
      };
    })(this));
  };

  return CombinedStream;

})(stream.Readable);

module.exports = {
  create: function(options) {
    return new CombinedStream(options);
  }
};
