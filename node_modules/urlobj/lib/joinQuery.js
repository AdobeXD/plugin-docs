"use strict";



// TODO :: use "querystring" package (that node uses) -- create PR for `skipEmpties`?
function joinQuery(queryObj, skipEmpties)
{
	var i,len,value,varname;
	var count = { i:0 };  // literals do not persist across functions
	var output = "";
	
	for (varname in queryObj)
	{
		if (queryObj.hasOwnProperty(varname)===true)
		{
			value = queryObj[varname];
			
			// "?var1=a&var1=b" would've been parsed to { var1: ["a","b"] }
			if (Array.isArray(value) === false)
			{
				output += joinValue(varname, value, count, skipEmpties);
			}
			else
			{
				len = value.length;
				
				for (i=0; i<len; i++)
				{
					output += joinValue(varname, value[i], count, skipEmpties);
				}
			}
		}
	}
	
	return output;
}



/*
	Creates "?var=value" or "&var=value".
*/
function joinValue(varname, value, count, skipEmpties)
{
	var output = "";
	
	// If accept or ignore "?=" and "?query="
	if ((varname!=="" && value!=="") || skipEmpties!==true)
	{
		output += (++count.i>1) ? "&" : "?";
		
		varname = encodeURIComponent(varname);
		
		if (value !== "")
		{
			// "?query=this+is+a+value"
			output += varname +"="+ encodeURIComponent(value).replace(/%20/g,"+");
		}
		else
		{
			// "?query="
			output += varname+"=";
		}
	}
	
	return output;
}



module.exports = joinQuery;
