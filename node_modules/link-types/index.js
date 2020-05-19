"use strict";



function isNotEmpty(value)
{
	return value !== "";
}



function linkTypes(attrValue)
{
	return split(attrValue).filter(isNotEmpty);
}



function map(attrValue)
{
	var i,numValues,value,result;
	
	attrValue = split(attrValue);
	numValues = attrValue.length;
	
	result = {};
	
	for (i=0; i<numValues; i++)
	{
		value = attrValue[i];
		
		if (value !== "")
		{
			result[value] = true;
		}
	}
	
	return result;
}



function split(attrValue)
{
	return attrValue.trim().toLowerCase().split(" ");
}



linkTypes.map = map;

module.exports = linkTypes;
