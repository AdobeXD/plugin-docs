"use strict";
var nopt = require("nopt");



function validate(type, callback)
{
	for (var i in nopt.typeDefs)
	{
		if ( nopt.typeDefs.hasOwnProperty(i) && nopt.typeDefs[i].type===type )
		{
			callback( nopt.typeDefs[i].validate );
			
			break;
		}
	}
}



module.exports = validate;
