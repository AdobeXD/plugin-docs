"use strict";



function normalizeDirs(dirArray, leadingSlash)
{
	var dir,i,lastOutputDir;
	var len = dirArray.length;
	var output = { dir:[], leadingSlash:(leadingSlash===true) };
	
	for (i=0; i<len; i++)
	{
		dir = dirArray[i];
		
		if (dir !== "..")
		{
			// "/dir/", "dir/"
			if (dir !== ".")
			{
				output.dir.push(dir);
			}
		}
		else
		{
			lastOutputDir = (output.dir.length>0) ? output.dir[output.dir.length-1] : null;
			
			// "/dir/../", "/dir/dir/../"
			if (lastOutputDir!==null && (output.leadingSlash===true || (lastOutputDir!==".." && lastOutputDir!==".")))
			{
				// Remove parent
				output.dir.splice(output.dir.length-1, 1);
			}
			// "../../dir/", "./../dir/"
			else if (output.leadingSlash === false)
			{
				output.dir.push(dir);
			}
			// Else: "/../dir/" not pushed because parent to root is root
		}
	}
	
	return output;
}



module.exports = normalizeDirs;
