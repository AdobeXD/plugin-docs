"use strict";

module.exports = 
{
	NOTHING:    -1,  // TODO :: rename to NONE
	
	PROTOCOL:   0,
	SCHEME:     0,
	
	//TLD:        1,
	//DOMAIN:     2,
	//SUB_DOMAIN: 3,
	HOSTNAME:   4,	// TODO :: implement domain parts
	PORT:       5,
	HOST:       6,
	AUTH:       7,
	DIRECTORY:  8,
	FILENAME:   9,
	PATHNAME:   10,
	
	QUERY:      11,
	SEARCH:     11,
	
	PATH:       12,
	
	HASH:       13,
	FRAGMENT:   13
};
