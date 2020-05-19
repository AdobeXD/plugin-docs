"use strict";
var error = require("./error");
var help  = require("./help");
var input = require("./input");
var util  = require("./util");

var objectAssign = require("object-assign");



var defaultConfig =
{
	title: "",
	name: "noname",
	description: "",
	version: "0.0.0",
	colors: ["red","green","magenta"],
	options: {},
	aliases: []
};



// NOTE ::  Couldn't be written with `prototype` because nested functions
// like `config.merge()` would have no access to `this`.
function nopter()
{
	var api = {};
	var config = {};
	
	
	
	api.config = function(newValue)
	{
		if (!newValue)
		{
			validate(config);
		}
		else if (newValue && !newValue.options)
		{
			validate(config, true);
		}
		else
		{
			config = objectAssign({}, defaultConfig, newValue);
		}
		
		return config;
	};
	
	
	
	api.config.merge = function(newValues)
	{
		if (newValues)
		{
			config = objectAssign(config, newValues);
		}
		
		return api.config();
	};
	
	
	
	api.error = error;
	
	
	
	api.help = function()
	{
		validate(config);
		
		return help(config);
	};
	
	
	
	api.help.indent = function()
	{
		return help.indent();
	};
	
	
	
	api.input = function(args, slice)
	{
		validate(config);
		
		switch (typeof args)
		{
			case "string":
			{
				args = util.splitargs(args);
				break;
			}
			case "undefined":
			{
				args = process.argv;
				break;
			}
			default:
			{
				// Unlikely, but possible
				if (args !== process.argv)
				{
					// Force array
					args = Array.prototype.slice.call(args);
				}
			}
		}
		
		// Convenience for custom args
		if (args!==process.argv && slice==undefined)
		{
			slice = 0;
		}
		
		return input(args, config, slice);
	};
	
	
	
	api.util = util;
	
	
	
	return api;
}



nopter.error = error;
nopter.util = util;



function validate(config, fail)
{
	if (!config.options || !Object.keys(config.options).length || fail)
	{
		throw new Error("options must be defined");
	}
}



module.exports = nopter;
