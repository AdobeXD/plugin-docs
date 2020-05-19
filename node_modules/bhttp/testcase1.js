var bhttp = require("./");
var stockName = "AAPL";
var debug = require("debug")("testcase1");
var util = require("util");

bhttp.get('http://finance.yahoo.com/q/ks?s=' + stockName + '+Key+Statistics', { stream: false }, function(err, res) {
	if(err) {
		debug('ERROR: ' + err)
	  return callback(err)
	} else {
		debug('res: ' + util.inspect(res))
	}
})
