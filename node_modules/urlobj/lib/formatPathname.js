"use strict";
var joinDirs = require("./joinDirs");



// TODO :: needs tests and documentation (?)
function formatPathname(urlobj)
{
	var pathname = joinDirs(urlobj.extra.directory, urlobj.extra.directoryLeadingSlash);
	
	if (urlobj.extra.filename !== null)
	{
		pathname += urlobj.extra.filename;
	}
	
	return pathname;
}



module.exports = formatPathname;
