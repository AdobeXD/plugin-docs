"use strict";
var constants       = require("./constants");
var group           = require("./group");
var _is             = require("./is");
var parseBotAgent   = require("./parseBotAgent");
var parseDirectives = require("./parseDirectives");
var splitDirectives = require("./splitDirectives");

var defaultOptions = 
{
	allIsReadonly: true,
	currentTime: function(){ return Date.now() },
	restrictive: true,
	userAgent: ""
};



function RobotDirectives(options)
{
	this.directives      = { robots: group.initial()        };
	this.directives_flat = { robots: this.directives.robots };
	
	this.options = Object.assign({}, defaultOptions, options);
	
	this.bot = parseBotAgent(this.options.userAgent);
	
	this.needsRefresh = false;
}



RobotDirectives.prototype.header = function(value)
{
	var bot,prefix;
	
	value = splitDirectives(value);
	
	bot = parseBotAgent(value.prefix);
	
	if (bot === "robots")
	{
		prefix = value.prefix;
	}
	
	if (parseDirectives(bot, prefix, value.values, this) === true)
	{
		this.needsRefresh = true;
	}
	
	return this;
};



RobotDirectives.prototype.is = function(directive, options)
{
	return is(this, directive, options, false, false);
};



RobotDirectives.prototype.isNot = function(directive, options)
{
	return is(this, directive, options, true, false);
};



RobotDirectives.prototype.meta = function(name, content)
{
	content = splitDirectives(content);
	
	// Compensate for any unfavorable HTML
	name = name.trim().toLowerCase();
	
	if (parseDirectives(name, content.prefix, content.values, this) === true)
	{
		this.needsRefresh = true;
	}
	
	return this;
};



RobotDirectives.prototype.oneIs = function(directive, options)
{
	return is(this, directive, options, false, true);
};



RobotDirectives.prototype.oneIsNot = function(directive, options)
{
	return is(this, directive, options, true, true);
};



RobotDirectives.isBot = function(botAgent)
{
	return parseBotAgent(botAgent) !== "robots";
};



for (var i in constants)
{
	RobotDirectives[i] = constants[i];
}



//::: PRIVATE FUNCTIONS



function is(instance, directive, options, inverted, any)
{
	var result;
	var bot = instance.bot;
	
	if (options == null)
	{
		options = instance.options;
	}
	else
	{
		options = Object.assign({}, instance.options, options);
		
		if (options.userAgent !== instance.options.userAgent)
		{
			bot = parseBotAgent(options.userAgent);
		}
	}
	
	if (instance.needsRefresh === true)
	{
		instance.needsRefresh = false;
		
		refresh(instance.directives_flat, instance.directives, options);
	}
	
	if (instance.directives_flat[bot] == null)
	{
		bot = "robots";
	}
	
	return _is(instance.directives_flat[bot], directive, options, inverted, any);
}



function refresh(target, source, options)
{
	var i,key,numKeys;
	var keys = Object.keys(source);
	numKeys = keys.length;
	
	for (i=0; i<numKeys; i++)
	{
		key = keys[i];
		
		// `target.robots` is a reference, so it needn't be cloned
		if (key !== "robots")
		{
			// If agent group not yet defined
			if (target[key] == null)
			{
				target[key] = group.blank();
			}
			
			// Set base as [a copy of] global
			Object.assign(target[key], target.robots);
			
			// Apply overrides
			group.merge(target[key], source[key], options);
		}
	}
}



module.exports = RobotDirectives;
