var CRLF, FormData, Promise, combinedStream2, debug, mime, ofTypes, path, stream, uuid, _;

path = require("path");

stream = require("stream");

uuid = require("uuid");

mime = require("mime");

combinedStream2 = require("combined-stream2");

Promise = require("bluebird");

_ = require("lodash");

debug = require("debug")("form-data2");

CRLF = "\r\n";

ofTypes = function(obj, types) {
  var match, type, _i, _len;
  match = false;
  for (_i = 0, _len = types.length; _i < _len; _i++) {
    type = types[_i];
    match = match || obj instanceof type;
  }
  return match;
};

module.exports = FormData = (function() {
  function FormData() {
    this._firstHeader = false;
    this._closingHeaderAppended = false;
    this._boundary = "----" + uuid.v4();
    this._headers = {
      "content-type": "multipart/form-data; boundary=" + this._boundary
    };
    this._stream = combinedStream2.create();
  }

  FormData.prototype._getStreamMetadata = function(source, options) {
    var contentLength, contentType, filename, fullPath, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    debug("obtaining metadata for source: %s", source.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r"));
    fullPath = (_ref = (_ref1 = options.filename) != null ? _ref1 : (_ref2 = source.client) != null ? (_ref3 = _ref2._httpMessage) != null ? _ref3.path : void 0 : void 0) != null ? _ref : source.path;
    if (fullPath != null) {
      filename = path.basename(fullPath);
      contentType = (_ref4 = (_ref5 = options.contentType) != null ? _ref5 : (_ref6 = source.headers) != null ? _ref6["content-type"] : void 0) != null ? _ref4 : mime.lookup(filename);
      contentLength = (_ref7 = (_ref8 = options.knownLength) != null ? _ref8 : options.contentLength) != null ? _ref7 : (_ref9 = source.headers) != null ? _ref9["content-length"] : void 0;
    } else {
      contentType = (_ref10 = options.contentType) != null ? _ref10 : (_ref11 = source.headers) != null ? _ref11["content-type"] : void 0;
      contentLength = (_ref12 = (_ref13 = options.knownLength) != null ? _ref13 : options.contentLength) != null ? _ref12 : (_ref14 = source.headers) != null ? _ref14["content-length"] : void 0;
    }
    return {
      filename: filename,
      contentType: contentType,
      contentLength: contentLength
    };
  };

  FormData.prototype._generateHeaderFields = function(name, metadata) {
    var escapedFilename, headerFields;
    debug("generating headers for: %s", metadata);
    headerFields = [];
    if (metadata.filename != null) {
      escapedFilename = metadata.filename.replace('"', '\\"');
      headerFields.push("Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + escapedFilename + "\"");
    } else {
      headerFields.push("Content-Disposition: form-data; name=\"" + name + "\"");
    }
    if (metadata.contentType != null) {
      headerFields.push("Content-Type: " + metadata.contentType);
    }
    debug("generated headers: %s", headerFields);
    return headerFields.join(CRLF);
  };

  FormData.prototype._appendHeader = function(name, metadata) {
    var headerFields, leadingCRLF;
    if (this._firstHeader === false) {
      debug("appending header");
      leadingCRLF = "";
      this._firstHeader = true;
    } else {
      debug("appending first header");
      leadingCRLF = CRLF;
    }
    headerFields = this._generateHeaderFields(name, metadata);
    return this._stream.append(new Buffer(leadingCRLF + ("--" + this._boundary) + CRLF + headerFields + CRLF + CRLF));
  };

  FormData.prototype._appendClosingHeader = function() {
    debug("appending closing header");
    return this._stream.append(new Buffer(CRLF + ("--" + this._boundary + "--")));
  };

  FormData.prototype.append = function(name, source, options) {
    var metadata;
    if (options == null) {
      options = {};
    }
    debug("appending source");
    if (this._closingHeaderAppended) {
      throw new Error("The stream has already been prepared for usage; you either piped it or generated the HTTP headers. No new sources can be appended anymore.");
    }
    if (!ofTypes(source, [stream.Readable, stream.Duplex, stream.Transform, Buffer, Function]) && typeof source !== "string") {
      throw new Error("The provided value must be either a readable stream, a Buffer, a callback providing either of those, or a string.");
    }
    if (typeof source === "string") {
      source = new Buffer(source);
      if (options.contentType == null) {
        options.contentType = "text/plain";
      }
    }
    metadata = this._getStreamMetadata(source, options);
    this._appendHeader(name, metadata);
    return this._stream.append(source, options);
  };

  FormData.prototype.done = function() {
    debug("called 'done'");
    if (!this._closingHeaderAppended) {
      this._closingHeaderAppended = true;
      return this._appendClosingHeader();
    }
  };

  FormData.prototype.getBoundary = function() {
    return this._boundary;
  };

  FormData.prototype.getHeaders = function(callback) {
    this.done();
    return Promise["try"]((function(_this) {
      return function() {
        return _this._stream.getCombinedStreamLength();
      };
    })(this)).then(function(length) {
      debug("total combined stream length: %s", length);
      return Promise.resolve({
        "content-length": length
      });
    })["catch"](function(err) {
      debug("WARN: could not get total combined stream length");
      return Promise.resolve({
        "transfer-encoding": "chunked"
      });
    }).then((function(_this) {
      return function(sizeHeaders) {
        return Promise.resolve(_.extend(sizeHeaders, _this._headers));
      };
    })(this)).nodeify(callback);
  };

  FormData.prototype.getLength = function(callback) {
    return this._stream.getCombinedStreamLength(callback);
  };

  FormData.prototype.pipe = function(target) {
    this.done();
    debug("piping underlying combined-stream2 to target writable");
    return this._stream.pipe(target);
  };

  return FormData;

})();
