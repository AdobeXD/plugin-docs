"use strict";
var inputType     = require("./inputType");
var InputTypes    = require("./InputTypes");
var isDefaultPort = require("./isDefaultPort");
var parsePath     = require("./parsePath");
var typeofUrl     = require("./typeofUrl");
var UrlType       = require("./UrlType");

var isObject = require("is-object");
var isString = require("is-string");
var urllib   = require("url");

var _directoryIndexes = ["index.html"];



function isDirectoryIndex(filename, directoryIndexes)
{
	// TODO :: not necessarily -- what if it's a query- or more relative url?
	if (filename === null) return true;
	
	if (Array.isArray(directoryIndexes) === false)
	{
		directoryIndexes = _directoryIndexes;
	}
	
	return directoryIndexes.indexOf(filename) > -1;
}



function parseOptions(parseQueryString, slashesDenoteHost)
{
	var options = {};
	
	// parseUrl(url, options)
	if (isObject(parseQueryString) === true)
	{
		options = parseQueryString;
	}
	// parseUrl(url, parseQueryString, slashesDenoteHost)
	else
	{
		options = 
		{
			parseQueryString: parseQueryString,
			slashesDenoteHost: slashesDenoteHost
		};
	}
	
	return options;
}



function parseUrl(url, parseQueryString, slashesDenoteHost)
{
	var parsedPath;
	var options = parseOptions(parseQueryString, slashesDenoteHost);
	var type = inputType(url);
	
	// TODO :: support url objects not from core? (see urllib.format)
	switch (type)
	{
		case InputTypes.STRING:
		{
			var temp = url;
			url = urllib.parse(url, true, options.slashesDenoteHost);
			
			break;
		}
		case InputTypes.CORE_URL_OBJECT:
		{
			// If was parsed with parseQueryString=false
			if (
			    ( url.search==null && url.query==null ) ||
			    ( isString(url.search)===true && isString(url.query)===true )
			   )
			{
				// Reparse
				// TODO :: use "querystring" package (that node uses) ?
				url = urllib.parse(url.href, true, options.slashesDenoteHost);
			}
			
			break;
		}
		case InputTypes.URLOBJ:
		{
			return url;
		}
		default:
		{
			throw new Error("invalid input type");
		}
	}

	// Make older versions of Node.js consistent with breaking changes in v9
	if (url.search === "") {
		url.search = null;
	}
	
	parsedPath = parsePath(url.pathname);
	
	url.extra = {};
	
	if (isString(url.protocol) === true)
	{
		if (url.protocol[url.protocol.length-1] === ":")
		{
			url.extra.protocolTruncated = url.protocol.substr(0, url.protocol.length-1);
		}
	}
	else
	{
		url.extra.protocolTruncated = null;
	}
	
	url.extra.portIsDefault         = isDefaultPort(url.extra.protocolTruncated, url.port, options.defaultPorts);
	url.extra.directory             = parsedPath.dir;
	url.extra.directoryLeadingSlash = parsedPath.leadingSlash;
	url.extra.filename              = parsedPath.filename;
	url.extra.filenameIsIndex       = isDirectoryIndex(parsedPath.filename, options.directoryIndexes);
	url.extra.query                 = url.query;
	
	// Preserve backwards compatibility with core url package
	if (options.parseQueryString !== true)
	{
		if (url.search !== null)
		{
			if (url.search[0] === "?")
			{
				// Remove prefixed "?"
				url.query = url.search.substr(1);
			}
			else
			{
				// TODO :: add test for this
				url.query = url.search;
			}
		}
		else
		{
			url.search = null;
			url.query = null;
		}
	}
	
	url.extra.type = typeofUrl(url);
	
	return url;
}



module.exports = parseUrl;
