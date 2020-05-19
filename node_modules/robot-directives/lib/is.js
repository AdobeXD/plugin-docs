"use strict";
var constants = require("./constants");



function is(target, directive, options, inverted, one)
{
	var expected = inverted!==true;
	
	if (Array.isArray(directive) === true)
	{
		for (var i=0, numDirectives=directive.length; i<numDirectives; i++)
		{
			if (is_single(target, directive[i], options) !== expected)
			{
				if (one !== true)
				{
					return false;
				}
			}
			else if (one === true)
			{
				return true;
			}
		}
		
		return one!==true;
	}
	else
	{
		return is_single(target, directive, options) === expected;
	}
}



function is_single(target, directive, options)
{
	switch (directive)
	{
		case constants.ALL:
		{
			return target.all===true && isAvailable(target,options)===true;
		}
		
		case constants.ARCHIVE:
		case constants.CACHE:
		{
			return target.archive===true && target.cache===true && target.index!==false && isAvailable(target,options)===true;
		}
		
		case constants.FOLLOW:
		case constants.NONE:
		{
			return target[directive] === true;
		}
		
		case constants.IMAGEINDEX:
		case constants.ODP:
		case constants.SNIPPET:
		case constants.TRANSLATE:
		{
			return target[directive]===true && target.index!==false && isAvailable(target,options)===true;
		}
		
		case constants.INDEX:
		{
			return target.index===true && isAvailable(target,options)===true;
		}
		
		case constants.NOARCHIVE:
		case constants.NOCACHE:
		{
			return target.archive===false || target.cache===false || isAvailable(target,options)===false;
		}
		
		case constants.NOFOLLOW:
		{
			return target.follow === false;
		}
		
		case constants.NOIMAGEINDEX:
		case constants.NOODP:
		case constants.NOSNIPPET:
		case constants.NOTRANSLATE:
		{
			return target[ directive.substr(2) ]===false || target.index===false || isAvailable(target,options)===false;
		}
		
		case constants.NOINDEX:
		{
			return target.index===false || isAvailable(target,options)===false;
		}
		
		default:
		{
			return false;
		}
	}
}



function isAvailable(target, options)
{
	return target.unavailable_after > options.currentTime();
}



module.exports = is;
