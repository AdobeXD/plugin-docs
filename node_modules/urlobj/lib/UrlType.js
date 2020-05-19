"use strict";

module.exports = 
{
	UNKNOWN:            -1,
	
	ABSOLUTE:           0,
	PROTOCOL_RELATIVE:  1,
	ROOT_RELATIVE:      2,
	DIRECTORY_RELATIVE: 3,  // TODO :: what about "document-relative" ?
	FILENAME_RELATIVE:  4,
	QUERY_RELATIVE:     5,
	
	EMPTY:              6,  // TODO :: goes here?
	
	HASH_RELATIVE:      7
};
