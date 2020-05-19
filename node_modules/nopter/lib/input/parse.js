"use strict";
var nopt     = require("nopt");
var utils    = require("../utils");
var validate = require("./validate");



function parse(result, args, config, slice)
{
	var noptOptions = {};
	var noptShortHands = {};
	
	utils.eachOption( config, function(optionData, option)
	{
		// Default type is String
		noptOptions[option] = optionData.type || String;
		
		utils.eachShorthand( config, option, function(short)
		{
			noptShortHands[short] = "--" + option;
		});
	});
	
	// Shallow copy to preserve result object
	utils.shallowCopy(result, nopt(noptOptions, noptShortHands, args, slice) );
	
	return result;
}



module.exports = parse;
