"use strict";



function areSameDir(dirArray1, leadingSlash1, dirArray2, leadingSlash2)
{
	var i;
	var len1 = dirArray1.length;
	var len2 = dirArray2.length;
	
	// Empty array with no leading slash is an empty path (relative)
	if (len1<1 && leadingSlash1===false) return true;
	if (len2<1 && leadingSlash2===false) return true;
	
	// One is absolute, one is relative -- impossible to tell if they are the same
	if (leadingSlash1 !== leadingSlash2) return false;
	
	if (len1 !== len2) return false;
	
	for (i=0; i<len1; i++)
	{
		if (dirArray1[i] !== dirArray2[i])
		{
			return false;
		}
	}
	
	return true;
}



module.exports = areSameDir;
