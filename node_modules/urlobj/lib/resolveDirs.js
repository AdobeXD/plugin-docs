"use strict";
var normalizeDirs = require("./normalizeDirs");



function resolveDirs(fromDirArray, fromLeadingSlash, toDirArray, toLeadingSlash)
{
	var output = { dir:null, leadingSlash:false };
	
	if (toLeadingSlash === true)
	{
		// Already resolved to a root
		// Return cloned input to avoid any future mutations
		output.dir = toDirArray.slice();
		
		output.leadingSlash = toLeadingSlash;
	}
	else
	{
		// Concat both together -- result is a clone, so there won't be mutation issues
		output.dir = fromDirArray.concat(toDirArray);
		
		output.leadingSlash = (fromLeadingSlash === true);
	}
	
	// Clean up dot segments
	output.dir = normalizeDirs(output.dir, output.leadingSlash).dir;
	
	return output;
}



module.exports = resolveDirs;
