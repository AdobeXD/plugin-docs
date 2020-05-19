"use strict";



function joinDirs(dirArray, leadingSlash)
{
	var i;
	var len = dirArray.length;
	var output = (leadingSlash===true) ? "/" : "";
	
	for (i=0; i<len; i++)
	{
		// This should never happen, though
		if (dirArray[i] !== "")
		{
			output += dirArray[i] + "/";
		}
	}
	
	return output;
}



module.exports = joinDirs;
