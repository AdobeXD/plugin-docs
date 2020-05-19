"use strict";
var group = require("./group");



function parseDirectives(bot, prefix, values, instance)
{
	var i,numDirectives,target;
	
	if (bot==null || values==null || values.length<1) return false;
	
	if (instance.directives[bot] == null)
	{
		instance.directives[bot] = group.blank();
	}
	
	target = instance.directives[bot];
	
	if (prefix != null)
	{
		if (prefix === "unavailable_after")
		{
			target.unavailable_after = new Date( values[0] ).getTime();
		}
	}
	else
	{
		numDirectives = values.length;
		
		for (i=0; i<numDirectives; i++)
		{
			group.set(target, values[i].trim(), instance.options);
		}
	}
	
	return true;
}



module.exports = parseDirectives;
