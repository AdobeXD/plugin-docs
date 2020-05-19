'use strict';
module.exports = function (str, opts) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.trim().replace(/\s{2,}/g, ' ');
};
