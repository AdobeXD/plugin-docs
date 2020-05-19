"use strict";

module.exports = 
{
	// Functions
	//absolute:      require("./resolveUrl"),
	format:        require("url").format,
	//minify:        require("./minifyUrl"),  // TODO :: put in separate package?
	normalize:     require("./normalizeUrl"),
	parse:         require("./parseUrl"),
	relation:      require("./urlRelation"),
	resolve:       require("./resolveUrl"),
	
	// Constants
	component:     require("./UrlComponent"), // for `relation()`
	type:          require("./UrlType"),      // for `parse().extra.type`
	
	// Exposed internals
	areSameDir:       require("./areSameDir"),
	areSameQuery:     require("./areSameQuery"),
	//isDefaultPort:    require("./isDefaultPort"),
	//isDirectoryIndex: require("./isDirectoryIndex"),
	joinDirs:         require("./joinDirs"),
	joinQuery:        require("./joinQuery"),
	normalizeDirs:    require("./normalizeDirs"),
	parsePath:        require("./parsePath"),
	resolveDirs:      require("./resolveDirs"),
	typeofUrl:        require("./typeofUrl")
};
