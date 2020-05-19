"use strict";
var isString = require("is-string");



function parsePath(pathString)
{
	var filename,lastSlash;
	var output = { dir:[], filename:null, leadingSlash:false };
	
	// Length check is a speed optimization
	if (isString(pathString)===true && pathString.length>0)
	{
		lastSlash = pathString.lastIndexOf("/");
		
		if (lastSlash > -1)
		{
			// If slash is not last char
			if (++lastSlash < pathString.length)
			{
				filename = pathString.substr(lastSlash);
				
				// "/dir/to/filename.html", "/filename.html"
				// "dir/to/filename.html", "filename.html"
				if (filename!=="." && filename!=="..")
				{
					output.filename = filename;
					pathString = pathString.substr(0, lastSlash);
				}
				// "/dir/to/..", "/dir/to/.", "/..", "/."
				// "dir/to/..", "dir/to/.", "..", "."
				else
				{
					pathString += "/";
				}
			}
			
			output.dir = splitDirs(pathString);
		}
		// "..?var", "..#anchor", "..", "."
		else if (pathString==="." || pathString==="..")
		{
			pathString += "/";
			
			output.dir = splitDirs(pathString);
		}
		// "filename.html", "..filename.html", ".filename.html"
		else
		{
			output.filename = pathString;
		}
		
		// For relative URLs -- clarifies if dir-relative or root-dir-relative
		output.leadingSlash = (pathString[0] === "/");
	}
	
	return output;
}



/*
	Splits a dir string into a dir Array and cleans up common issues.
*/
function splitDirs(dirString)
{
	var dirs,i,len;
	var output = [];
	
	// Speed optimization
	if (dirString !== "/")
	{
		dirs = dirString.split("/");
		len = dirs.length;
		
		for (i=0; i<len; i++)
		{
			// Cleanup -- splitting "/dir/" becomes ["","dir",""]
			if (dirs[i] !== "")
			{
				output.push( dirs[i] );
			}
		}
	}
	
	return output;
}



module.exports = parsePath;
