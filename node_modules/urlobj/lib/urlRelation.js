"use strict";
var areSameDir    = require("./areSameDir");
var areSameQuery  = require("./areSameQuery");
var normalizeDirs = require("./normalizeDirs");
var parseUrl      = require("./parseUrl");
var UrlComponent  = require("./UrlComponent");
var UrlType       = require("./UrlType");



function urlRelation(url1, url2/*, options*/)
{
	var bothAreSameDir;
	
	url1 = parseUrl(url1/*, true, options.slashesDenoteHost1*/);
	url2 = parseUrl(url2/*, true, options.slashesDenoteHost2*/);
	
	if (url1.extra.type<UrlType.EMPTY && url2.extra.type<UrlType.EMPTY)
	{
		if (url1.extra.type===UrlType.ABSOLUTE && url2.extra.type===UrlType.ABSOLUTE)
		{
			if (url1.protocol !== url2.protocol) return UrlComponent.NOTHING;
			
			if (url1.hostname !== url2.hostname)
			{
				// TODO :: implement domain parts?
				
				return UrlComponent.PROTOCOL;
			}
			
			// TODO :: check portIsDefault -- may not have been normalized
			if (url1.port !== url2.port) return UrlComponent.HOSTNAME;
			
			if (url1.auth !== url2.auth) return UrlComponent.HOST;
		}
		
		// TODO :: make normalize optional (speed optimization)
		//if (options.normalize !== false)
		//{
			// This is immutable
			bothAreSameDir = areSameDir
			(
				normalizeDirs(url1.extra.directory, url1.extra.directoryLeadingSlash).dir,
				url1.extra.directoryLeadingSlash,
				
				normalizeDirs(url2.extra.directory, url2.extra.directoryLeadingSlash).dir,
				url2.extra.directoryLeadingSlash
			);
		/*}
		else
		{
			bothAreSameDir = areSameDir
			(
				url1.extra.directory,
				url1.extra.directoryLeadingSlash,
				url2.extra.directory,
				url2.extra.directoryLeadingSlash
			);
		}*/
		
		if (bothAreSameDir === false) return UrlComponent.AUTH;
		
		if (url1.extra.filename !== url2.extra.filename)
		{
			if (url1.extra.filenameIsIndex===false || url2.extra.filenameIsIndex===false)
			{
				return UrlComponent.DIRECTORY;
			}
		}
		
		if (areSameQuery(url1.extra.query, url2.extra.query) === false)
		{
			return UrlComponent.FILENAME;
		}
	}
	
	if (url1.hash !== url2.hash) return UrlComponent.PATH;
	
	return UrlComponent.HASH;
}



module.exports = urlRelation;
