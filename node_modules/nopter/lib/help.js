"use strict";
var chalk,cliTable;
var utils = require("./utils");



function color(str, config, num)
{
	if ( config.colors && config.colors[num] )
	{
		return chalk[ config.colors[num] ](str);
	}
	else
	{
		return str;
	}
}



function help(config)
{
	lazyRequire("chalk");
	lazyRequire("cli-table");
	
	var table = new cliTable(
	{
		chars:
		{
			"top":"", "top-mid":"", "top-left":"", "top-right":"",
			"bottom":"", "bottom-mid":"", "bottom-left":"", "bottom-right":"",
			"left":"", "left-mid":"", "mid":"", "mid-mid":"",
			"right":"", "right-mid":"", "middle":" "
		},
		style:
		{
			border: [],
			"padding-left": 0,
			"padding-right": 1
		}
	});
	
	// OPTIONS
	
	var defaultInfo = "(no description)";
	var options = sortedOptions(config);
	
	table.push([ "\n"+ chalk.underline("Options") ]);
	
	options.groupless.forEach( function(option, i)
	{
		var code = "--" + color(option,config,1);
		var info = eitherOr( config.options[option].info, defaultInfo );
		
		utils.eachShorthand( config, option, function(short)
		{
			code += ", -" + color(short,config,1);
		});
		
		table.push([ indent()+code, info ]);
	});
	
	for (var i in options.groups)
	{
		table.push([ "\n"+ chalk.underline("Options ("+i+")") ]);
		
		options.groups[i].forEach( function(option, j)
		{
			var code = "--" + color(option,config,1);
			var info = eitherOr( config.options[option].info, defaultInfo );
			
			utils.eachShorthand( config, option, function(short)
			{
				code += ", -" + color(short,config,1);
			});
			
			table.push([ indent()+code, info ]);
		});
	}
	
	// ARGUMENTS
	
	if (config.aliases.length)
	{
		table.push([ "\n"+ chalk.underline("Arguments") ]);
		
		config.aliases.forEach( function(alias)
		{
			table.push([ indent()+color(alias.toUpperCase(),config,2), "Alias to --"+alias ]);
		});
	}
	
	// END
	
	var name        = eitherOr(config.name, "noname");
	var description = eitherOr(config.description, "");
	var title       = eitherOr(config.title, name.toUpperCase());
	var version     = eitherOr(config.version, "0.0.0");
	
	var usage = color(name,config,0) +" "+ color("[OPTIONS]",config,1);
	
	if (config.aliases.length)
	{
		usage += " "+ color("[ARGS]",config,2);
	}
	
	var output = "";
	
	output += title;
	output += description ? ": "+description : "";
	output += " (v"+version+")";
	output += "\n";
	output += "\n"+ chalk.underline("Usage");
	output += "\n"+ indent() + chalk.bold(usage);
	output += "\n"+ table.toString();
	output += "\n";
	
	return output;
}



function eitherOr(a, b)
{
	return (!a || a==" ") ? b : a;
}



function indent()
{
	return "  ";
}



function lazyRequire(dep)
{
	switch (dep)
	{
		case "chalk":
		{
			if (!chalk) chalk = require("chalk");
			break;
		}
		case "cli-table":
		{
			if (!cliTable) cliTable = require("cli-table");
			break;
		}
	}
}



function sortedOptions(config)
{
	var sorted = { groups:{}, groupless:[] };
	
	utils.eachOption( config, function(optionData, option)
	{
		if (!optionData.hidden)
		{
			if (optionData.sort)
			{
				if (!sorted.groups[optionData.sort])
				{
					sorted.groups[optionData.sort] = [];
				}
				
				sorted.groups[optionData.sort].push(option);
			}
			else
			{
				sorted.groupless.push(option);
			}
		}
	});
	
	return sorted;
}



module.exports = help;
module.exports.indent = indent;
