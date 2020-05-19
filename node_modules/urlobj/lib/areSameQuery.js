"use strict";

var hasOwnProperty = Object.prototype.hasOwnProperty;


// TODO :: add a skipEmpties ?
function areSameQuery(queryObj1, queryObj2)
{
	var i,j,len,value1,value1clone,value2,value2clone;
	var queryObj1_length = 0;
	
	for (i in queryObj1)
	{
		value1 = hasOwnProperty.call(queryObj1, i);
		value2 = hasOwnProperty.call(queryObj2, i);
		if (value1===false || value2===false || value1!==value2) return false;
		
		value1 = queryObj1[i];
		value2 = queryObj2[i];
		
		// If strings don't match
		if (value1 !== value2)
		{
			// Don't proceed unless both are arrays
			// "?var1=a&var1=b" would've been parsed to { var1: ["a","b"] }
			if (Array.isArray(value1)===false || Array.isArray(value2)===false) return false;
			
			len = value1.length;
			
			if (len !== value2.length) return false;
			
			// Clone so that sort does not mutate input
			// Sort so that values can possibly match at same indexes
			value1clone = value1.slice().sort();
			value2clone = value2.slice().sort();
			
			for (j=0; j<len; j++)
			{
				if (value1clone[j] !== value2clone[j]) return false;
			}
		}
		
		queryObj1_length++;
	}
	
	if (queryObj1_length !== Object.keys(queryObj2).length) return false;
	
	return true;
}



module.exports = areSameQuery;
