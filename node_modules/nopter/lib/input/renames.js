"use strict";
var camelCase = require("camelcase");



function renames(result, config)
{
	// Avoid hitting same key twice when making changes
	var keys = Object.keys(result);
	
	for (var i=keys.length-1; i>=0; i--)
	{
		var key = keys[i];
		
		if (key != "argv")
		{
			// If not unknown option
			if (config.options[key])
			{
				var newName = config.options[key].rename;
				
				if (newName !== false)
				{
					if (newName===true || newName==undefined)
					{
						newName = camelCase(key);
					}
					
					if (newName != key)
					{
						if (result[newName] != undefined)
						{
							throw new Error('New name for "'+key+'" already exists');
						}
						
						result[newName] = result[key];
						delete result[key];
					}
				}
			}
		}
	}
}



module.exports = renames;
