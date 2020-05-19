"use strict";
var urllib = require("url");
var urlobj = require("urlobj");

var defaultOptions = 
{
	defaultPorts: null,  // will use urlobj default value
	expiryTime: Infinity,
	normalizeUrls: true,
	stripUrlHashes: true
};



function UrlCache(options)
{
	this.options = Object.assign({}, defaultOptions, options);
	
	this.clear();
}



UrlCache.prototype.clear = function(url)
{
	if (url != null)
	{
		url = parseUrl(url, this.options);
		url = stringifyUrl(url);
		
		if (this.values[url] !== undefined)
		{
			delete this.expiries[url];
			delete this.values[url];
			
			this.count--;
		}
	}
	else
	{
		this.count = 0;
		this.expiries = {};
		this.values = {};
	}
};



UrlCache.prototype.get = function(url)
{
	url = formatUrl(url, this.options);
	
	removeExpired(url, this.expiries, this.values);
	
	return this.values[url];
};



UrlCache.prototype.length = function()
{
	return this.count;
};



UrlCache.prototype.set = function(url, value, expiryTime)
{
	// Avoid filling cache with values that will only cause rejection
	if (value === undefined) return;
	
	url = formatUrl(url, this.options);
	
	if (expiryTime == null) expiryTime = this.options.expiryTime;
	
	this.expiries[url] = Date.now() + expiryTime;
	this.values[url] = value;
	
	this.count++;
};



//::: PRIVATE FUNCTIONS



function formatUrl(url, options)
{
	url = parseUrl(url, options);
	url = stringifyUrl(url);
	
	return url;
}



function parseUrl(url, options)
{
	if (options.defaultPorts != null)
	{
		url = urlobj.parse(url, {defaultPorts:options.defaultPorts});
	}
	else
	{
		// Avoid overriding the default value of `defaultPorts` with null/undefined
		url = urlobj.parse(url);
	}
	
	if (options.normalizeUrls === true)
	{
		// TODO :: this mutates input
		urlobj.normalize(url);
	}
	
	if (options.stripUrlHashes===true && url.hash!=null)
	{
		// TODO :: this mutates input
		url.hash = null;
		url.href = stringifyUrl(url);
	}
	
	return url;
}



function removeExpired(url, expiries, values)
{
	if (values[url] !== undefined)
	{
		if ( expiries[url] < Date.now() )
		{
			delete expiries[url];
			delete values[url];
		}
	}
}



function stringifyUrl(url)
{
	if (url!==null && typeof url==="object" && url instanceof String===false)
	{
		return urllib.format(url);  // TODO :: use urlobj.format() when available
	}
}



module.exports = UrlCache;
