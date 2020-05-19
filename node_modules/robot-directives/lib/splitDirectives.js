"use strict";

// It's currently unknown if `"googlebot: unavailable_after: …"` is possible, so it's not supported
var prefixPattern = /^(?:\s*([^:,]+):)?\s*(.+)?$/;



function splitDirectives(directives)
{
	var result = { prefix:null, values:null };
	
	directives = prefixPattern.exec(directives);
	
	if (directives[1] !== undefined)
	{
		result.prefix = directives[1].toLowerCase();
	}
	
	if (directives[2] !== undefined)
	{
		if (result.prefix === "unavailable_after")
		{
			result.values = [ directives[2].toLowerCase() ];
		}
		else
		{
			result.values = directives[2].toLowerCase().split(",");
		}
	}
	else
	{
		result.values = [];
	}
	
	return result;
}



module.exports = splitDirectives;
