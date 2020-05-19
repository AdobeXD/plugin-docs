"use strict";
var validate = require("./validate");



function aliases(result, config)
{
	if (!config.aliases) config.aliases = [];
	
	config.aliases.forEach( function(alias, i)
	{
		if ( config.options.hasOwnProperty(alias) )
		{
			var optionValue       = config.options[alias];
			var parsedArgValue    = result.argv.remain[i];
			var parsedOptionValue = result[alias];
			
			// Parsed option takes priority over argument
			if (!parsedOptionValue && parsedArgValue)
			{
				validate(optionValue.type, function(validateFunction)
				{
					validateFunction( result, alias, parsedArgValue );
				});
			}
		}
		else
		{
			throw new Error('The alias "'+alias+'" does not exist');
		}
	});
}



module.exports = aliases;
