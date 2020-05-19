"use strict";



// TODO :: needs tests and documentation (?)
function formatPath(urlobj)
{
	var path = urlobj.pathname;
	
	if (urlobj.search !== null)
	{
		path += urlobj.search;
	}
	
	return path;
}



module.exports = formatPath;
