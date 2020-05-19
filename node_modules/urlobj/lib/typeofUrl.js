"use strict";
var UrlType = require("./UrlType");



function typeofUrl(url)
{
	if (url.protocol !== null) return UrlType.ABSOLUTE;
	
	if (url.hostname !== null) return UrlType.PROTOCOL_RELATIVE;
	
	if (url.extra.directoryLeadingSlash === true)
	{
		return UrlType.ROOT_RELATIVE;
	}
	else if (url.extra.directory.length > 0)
	{
		return UrlType.DIRECTORY_RELATIVE;
	}
	
	if (url.extra.filename !== null) return UrlType.FILENAME_RELATIVE;
	
	if (url.search !== null) return UrlType.QUERY_RELATIVE;
	
	if (url.hash === null) return UrlType.EMPTY;
	
	return UrlType.HASH_RELATIVE;
}



module.exports = typeofUrl;
