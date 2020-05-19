"use strict";
var constants = require("./constants");



function blank()
{
	return {
		all: null,
		archive: null,
		cache: null,
		follow: null,
		imageindex: null,
		index: null,
		none: null,
		odp: null,
		snippet: null,
		translate: null,
		unavailable_after: null
	};
}



function initial()
{
	var result = blank();
	
	setToAll(result);
	
	result.unavailable_after = Infinity;
	
	return result;
}



function isAll(target)
{
	return target.archive===true && 
	       target.cache===true && 
	       target.follow===true && 
	       target.imageindex===true && 
	       target.index===true && 
	       target.none!==true && // TODO :: ===false should be fine now?
	       target.odp===true && 
	       target.snippet===true && 
	       target.translate===true;
}



function merge(target, source, options)
{
	var i,key,numKeys;
	var keys = Object.keys(source);
	numKeys = keys.length;
	
	for (i=0; i<numKeys; i++)
	{
		key = keys[i];
		
		switch ( source[key] )
		{
			// Ignores null values
			case true:
			{
				set(target, key, options);
				break;
			}
			case false:
			{
				// "noall", "nonone" and "nounavailable_after" will be ignored
				set(target, "no"+key, options);
				break;
			}
		}
	}
}



function set(target, directive, options)
{
	// https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives
	// http://www.webgnomes.org/blog/robots-meta-tag-definitive-guide/
	switch (directive)
	{
		case constants.ALL:
		{
			if (options.allIsReadonly===false && options.restrictive===false)
			{
				setToAll(target);
			}
			
			break;
		}
		
		case constants.ARCHIVE:
		case constants.CACHE:
		{
			if ((target.archive!==false && target.cache!==false && target.index!==false) || options.restrictive===false)
			{
				target.archive = true;
				target.cache = true;
				target.index = true;
				target.none = false;
				target.all = isAll(target);
			}
			
			break;
		}
		
		case constants.FOLLOW:
		{
			if (target.follow!==false || options.restrictive===false)
			{
				target.follow = true;
				target.none = false;
				target.all = isAll(target);
			}
			
			break;
		}
		
		case constants.IMAGEINDEX:
		case constants.ODP:
		case constants.SNIPPET:
		case constants.TRANSLATE:
		{
			if (target.index!==false || options.restrictive===false)
			{
				target.all = false;
				target.index = true;
				target[directive] = true;
			}
			
			break;
		}
		
		case constants.INDEX:
		{
			if (target.index!==false || options.restrictive===false)
			{
				target.index = true;
				target.none = false;
				target.all = isAll(target);
			}
			
			break;
		}
		
		case constants.NOARCHIVE:
		case constants.NOCACHE:
		{
			target.all = false;
			target.archive = false;
			target.cache = false;
			target.none = (target.follow===false && target.index===false);
			break;
		}
		
		case constants.NOIMAGEINDEX:
		case constants.NOODP:
		case constants.NOSNIPPET:
		case constants.NOTRANSLATE:
		{
			target.all = false;
			target[ directive.substr(2) ] = false;
			break;
		}
		
		case constants.NOFOLLOW:
		{
			target.all = false;
			target.follow = false;
			target.none = target.index===false;
			break;
		}
		
		case constants.NOINDEX:
		{
			target.all = false;
			target.archive = false;
			target.cache = false;
			target.imageindex = false;
			target.index = false;
			target.none = target.follow===false;
			target.odp = false;
			target.snippet = false;
			target.translate = false;
			break;
		}
		
		case constants.NONE:
		{
			target.all = false;
			target.archive = false;
			target.cache = false;
			target.follow = false;
			target.imageindex = false;
			target.index = false;
			target.none = true;
			target.odp = false;
			target.snippet = false;
			target.translate = false;
			break;
		}
	}
}



function setToAll(target)
{
	target.all = true;
	target.archive = true;
	target.cache = true;
	target.follow = true;
	target.imageindex = true;
	target.index = true;
	target.none = false;
	target.odp = true;
	target.snippet = true;
	target.translate = true;
}



module.exports = 
{
	blank:   blank,
	initial: initial,
	merge:   merge,
	set:     set
};
