"use strict";
var callerPath,chalk,eol,fs,path,_splitargs;
var colorsEnabled;



function forceColors(forced)
{
	lazyRequire("chalk");
	
	if (colorsEnabled === undefined)
	{
		// Not solidly reliable, as it's global and any library could have modified it
		// prior to this file accessing it, but it's probable that nothing else will
		colorsEnabled = chalk.enabled;
	}
	
	chalk.enabled = (forced || forced===undefined) ? true : colorsEnabled;
}



function lazyRequire(dep)
{
	switch (dep)
	{
		case "caller-path":
		{
			if (!callerPath) callerPath = require("caller-path");
			break;
		}
		case "chalk":
		{
			if (!chalk) chalk = require("chalk");
			break;
		}
		case "eol":
		{
			if (!eol) eol = require("eol");
			break;
		}
		case "fs":
		{
			if (!fs) fs = require("fs");
			break;
		}
		case "path":
		{
			if (!path) path = require("path");
			break;
		}
		case "splitargs":
		{
			if (!_splitargs) _splitargs = require("splitargs");
			break;
		}
	}
}



function readHelpFile(filepath)
{
	lazyRequire("caller-path");
	lazyRequire("eol");
	lazyRequire("fs");
	lazyRequire("path");
	var str;
	
	filepath = path.resolve( path.dirname(callerPath()), filepath );
	
	str = fs.readFileSync(filepath, {encoding:"utf8"});
	str = eol.lf(str);
	
	return str;
}



function replaceColorVars(str)
{
	lazyRequire("chalk");
	
	return str.replace(/({{(\/?([^}]+))}})/g, function(match, p1, p2, p3, offset, string)
	{
		if (p3)
		{
			var closer = p2.indexOf("/") == 0;
			
			return chalk.styles[p3][closer ? "close" : "open"];
		}
	});
}



function splitargs(str)
{
	lazyRequire("splitargs");
	return _splitargs(str);
}



function stripColors(str)
{
	lazyRequire("chalk");
	return chalk.stripColor(str);
}



module.exports =
{
	forceColors: forceColors,
	readHelpFile: readHelpFile,
	replaceColorVars: replaceColorVars,
	splitargs: splitargs,
	stripColors: stripColors
};
