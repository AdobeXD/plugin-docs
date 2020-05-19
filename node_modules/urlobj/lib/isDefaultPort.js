"use strict";
var isObject = require("is-object");

var _defaultPorts = { ftp:21, gopher:70, http:80, https:443 };



// TODO :: documentation and tests
function isDefaultPort(protocol, port, defaultPorts)
{
	if (protocol !== null)
	{
		if (port === null) return true;
		
		if (isObject(defaultPorts) === false)
		{
			defaultPorts = _defaultPorts;
		}
		
		return defaultPorts[protocol] === parseInt(port);
	}
	
	// Uncertain
	return null;
}



module.exports = isDefaultPort;
