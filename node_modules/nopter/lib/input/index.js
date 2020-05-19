"use strict";
var aliases  = require("./aliases");
var defaults = require("./defaults");
var parse    = require("./parse");
var renames  = require("./renames");



function input(args, config, slice)
{
	var result = {};
	
	parse(result, args, config, slice);
	defaults(result, config);
	aliases(result, config);
	renames(result, config);
	
	// Doesn't reflect alias or rename changes
	delete result.argv;
	
	return result;
}



module.exports = input;
