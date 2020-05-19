"use strict";
var pattern = /^\s*(\d+)(?:\s*;(?:\s*url\s*=)?\s*(.+)?)?$/i;



function parseMetaRefresh(content)
{
	var firstChar,lastChar,url;
	var result = { timeout:null, url:null };
	content = pattern.exec(content);
	
	if (content !== null)
	{
		if (content[1] !== undefined)
		{
			result.timeout = ~~content[1];  // faster than `parseInt()`
		}
		
		if (content[2] !== undefined)
		{
			url = content[2].trim();
			
			firstChar = url[0];
			lastChar  = url[ url.length-1 ];
			
			// Remove a single level of encapsulating quotes
			if (firstChar==="'" && lastChar==="'" || firstChar==='"' && lastChar==='"')
			{
				if (url.length > 2)
				{
					url = url.substr(1, url.length-2).trim();
				}
				else
				{
					url = "";
				}
				
				if (url === "") url = null;
			}
			
			result.url = url;
		}
	}
	
	return result;
}



module.exports = parseMetaRefresh;
