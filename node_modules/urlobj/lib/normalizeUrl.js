"use strict";
var isString = require("is-string");
var urllib = require("url");

var formatPath     = require("./formatPath");
var formatPathname = require("./formatPathname");
var normalizeDirs  = require("./normalizeDirs");
var parseUrl       = require("./parseUrl");



// TODO :: document options
function normalizeUrl(url, options)
{
	var portSuffix;
	url = parseUrl(url, options);
	
	// Remove default port
	if (url.extra.portIsDefault===true && url.port!==null)
	{
		if (isString(url.host) === true)
		{
			portSuffix = ":" + url.port;
			
			// Remove ":123" suffix from host
			if (url.host.substr(-portSuffix.length) === portSuffix)
			{
				url.host = url.host.slice(0, -portSuffix.length);
			}
		}
		
		url.port = null;
	}
	
	url.extra.directory = normalizeDirs(url.extra.directory, url.extra.directoryLeadingSlash).dir;
	
	url.pathname = formatPathname(url);
	
	// Remove empty query
	if (url.search === "?")
	{
		url.search = null;
		
		if (url.query==="?" || url.query==="") url.query = null;
	}
	
	// TODO :: remove empty hashes ("path#") ?
	
	url.path = formatPath(url);
	
	url.href = urllib.format(url);
	
	return url;
}



module.exports = normalizeUrl;
