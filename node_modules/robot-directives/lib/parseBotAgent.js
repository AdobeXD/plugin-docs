"use strict";
var isBot = require("isbot");
var userAgentLib = require("useragent");



function parseBotAgent(userAgent)
{
	if (userAgent != null)
	{
		userAgent = userAgentLib.parse(userAgent).family.toLowerCase();
		
		if (userAgent!=="other" && isBot(userAgent)===true)
		{
			return userAgent;
		}
	}
	
	return "robots";
}



module.exports = parseBotAgent;
