"use strict";
var isObject = require("is-object");
var isString = require("is-string");

var InputTypes = require("./InputTypes");



function inputType(input)
{
	if (isString(input) === true)
	{
		return InputTypes.STRING;
	}
	else if (isObject(input)===true && Array.isArray(input)===false)
	{
		if (input.protocol !== undefined)
		{
			if (isObject(input.extra) === true)
			{
				return InputTypes.URLOBJ;
			}
			
			return InputTypes.CORE_URL_OBJECT;
		}
	}
	
	return InputTypes.OTHER;
}



module.exports = inputType;
