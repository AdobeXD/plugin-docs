"use strict";
var areSameDir     = require("./areSameDir");
var formatPath     = require("./formatPath");
var formatPathname = require("./formatPathname");
var isDefaultPort  = require("./isDefaultPort");
var normalizeDirs  = require("./normalizeDirs");
var parseUrl       = require("./parseUrl");
var resolveDirs    = require("./resolveDirs");
var typeofUrl      = require("./typeofUrl");
var UrlComponent   = require("./UrlComponent");
var urlRelation    = require("./urlRelation");
var UrlType        = require("./UrlType");

var isObject     = require("is-object");
var objectAssign = require("object-assign");
var urllib       = require("url");

var defaultOptions = 
{
	slashesDenoteHost: true // consistent with core `url.resolve()`
};



function maybeCopyDirectory(from, to)
{
	if (to.extra.type >= UrlType.FILENAME_RELATIVE)
	{
		to.extra.directory = from.extra.directory.slice();  // clone
		to.extra.directoryLeadingSlash = from.extra.directoryLeadingSlash;
		
		return true;
	}
	
	return false;
}



function maybeCopyFilename(from, to)
{
	if (to.extra.type >= UrlType.QUERY_RELATIVE)
	{
		to.extra.filename = from.extra.filename;
		to.extra.filenameIsIndex = from.extra.filenameIsIndex;
		
		return true;
	}
	
	return false;
}



function maybeCopyHostAuth(from, to)
{
	if (to.extra.type >= UrlType.ROOT_RELATIVE)
	{
		to.auth = from.auth;
		to.host = from.host;
		to.port = from.port;
		to.hostname = from.hostname;
		to.extra.portIsDefault = from.extra.portIsDefault;
		
		return true;
	}
	
	return false;
}



function maybeCopyProtocol(from, to)
{
	if (to.extra.type >= UrlType.PROTOCOL_RELATIVE)
	{
		to.protocol = from.protocol;
		to.slashes = from.slashes;
		to.extra.protocolTruncated = from.extra.protocolTruncated;
		
		return true;
	}
	
	return false;
}



function maybeCopyQuery(from, to)
{
	if (to.extra.type >= UrlType.EMPTY)
	{
		to.search = from.search;
		
		if (isObject(from.query) === true)
		{
			to.query = objectAssign({}, from.query);  // enumerable clone
			to.extra.query = to.query;  // reuse object, like `parseUrl`
		}
		else
		{
			to.query = from.query;
			to.extra.query = objectAssign({}, from.extra.query);  // enumerable clone
		}
		
		return true;
	}
	
	return false;
}



function resolveDirectory(from, to/*, options*/)
{
	var resolvedDir;
	
	//if (options.normalize !== false)
	//{
		from.extra.directory = normalizeDirs(from.extra.directory, from.extra.directoryLeadingSlash).dir;
		to.extra.directory   = normalizeDirs(to.extra.directory,   to.extra.directoryLeadingSlash).dir;
	//}
	
	resolvedDir = resolveDirs
	(
		from.extra.directory, from.extra.directoryLeadingSlash,
		to.extra.directory,   to.extra.directoryLeadingSlash
	);
	
	to.extra.directory = resolvedDir.dir;
	to.extra.directoryLeadingSlash = resolvedDir.leadingSlash;
	
	return true;
}



function resolveUrl(from, to, options)
{
	var bothAreSameDir,relation;
	var changedDirectory = false;
	var changedFilename = false;
	var changedHostAuth = false;
	var changedProtocol = false;
	var changedQuery = false;
	
	options = objectAssign({}, defaultOptions, options);
	
	from = parseUrl(from, options);
	to   = parseUrl(to,   options);
	
	relation = urlRelation(from, to/*, options*/);
	
	// If not at all related
	if (relation < UrlComponent.AUTH) return to;
	
	changedProtocol = maybeCopyProtocol(from, to);
	
	if (changedProtocol === true)
	{
		changedHostAuth = maybeCopyHostAuth(from, to);
	}
	
	if (relation<UrlComponent.DIRECTORY || to.extra.type<UrlType.FILENAME_RELATIVE)
	{
		changedDirectory = resolveDirectory(from, to);
		
		bothAreSameDir = areSameDir
		(
			from.extra.directory,
			from.extra.directoryLeadingSlash,
			
			to.extra.directory,
			to.extra.directoryLeadingSlash
		);
	}
	else
	{
		changedDirectory = maybeCopyDirectory(from, to);
		
		bothAreSameDir = changedDirectory;
	}
	
	if (relation>=UrlComponent.DIRECTORY || bothAreSameDir===true)
	{
		changedFilename = maybeCopyFilename(from, to);
		
		changedQuery = maybeCopyQuery(from, to);
	}
	
	if (changedDirectory===true || changedFilename===true)
	{
		to.pathname = formatPathname(to);
	}
	
	if (changedDirectory===true || changedFilename===true || changedQuery===true)
	{
		to.path = formatPath(to);
	}
	
	// If was protocol-relative
	if (changedProtocol===true && changedHostAuth===false)
	{
		to.extra.portIsDefault = isDefaultPort(to.protocol, to.port, options.defaultPorts);
	}
	
	if (changedProtocol===true || changedHostAuth===true || changedDirectory===true || changedFilename===true || changedQuery===true)
	{
		to.href = urllib.format(to);
		to.extra.type = typeofUrl(to);
	}
	
	return to;
}



module.exports = resolveUrl;
