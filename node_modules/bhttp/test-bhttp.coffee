bhttp = require "./"
Promise = require "bluebird"
fs = require "fs"
util = require "util"
devNull = require "dev-null"

requestbinTarget = process.argv[2]
if not requestbinTarget
	throw new Error("No RequestBin target URL specified.")

formatLine = (line) -> line.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")

testcases = []

testcases.push(Promise.try ->
	# multipart POST upload
	bhttp.post "http://posttestserver.com/post.php",
		fieldOne: "value 1"
		fieldTwo: "value 2"
		fieldThree: ["value 3a", "value 3b"]
		fieldFour: new Buffer "value 4"
		testFile: fs.createReadStream("./lower.txt")
	, {headers: {"user-agent": "bhttp/test POST multipart"}}
.then (response) ->
	console.log "POST multipart", formatLine(response.body)
)

testcases.push(Promise.try ->
	# url-encoded POST form
	bhttp.post requestbinTarget,
		fieldOne: "value 1"
		fieldTwo: "value 2"
		fieldThree: ["value 3a", "value 3b"]
	, {headers: {"user-agent": "bhttp/test POST url-encoded"}}
.then (response) ->
	console.log "POST url-encoded", formatLine(response.body)
)

testcases.push(Promise.try ->
	# POST stream
	bhttp.post requestbinTarget, null,
		inputStream: fs.createReadStream("./lower.txt")
		headers: {"user-agent": "bhttp/test POST stream"}
.then (response) ->
	console.log "POST stream", formatLine(response.body)
)

testcases.push(Promise.try ->
	# POST buffer
	bhttp.post requestbinTarget, null,
		inputBuffer: new Buffer("test buffer contents")
		headers: {"user-agent": "bhttp/test POST buffer"}
.then (response) ->
	console.log "POST buffer", formatLine(response.body)
)

testcases.push(Promise.try ->
	# PUT buffer
	bhttp.put requestbinTarget, null,
		inputBuffer: new Buffer("test buffer contents")
		headers: {"user-agent": "bhttp/test PUT buffer"}
.then (response) ->
	console.log "PUT buffer", formatLine(response.body)
)

testcases.push(Promise.try ->
	# PATCH buffer
	bhttp.patch requestbinTarget, null,
		inputBuffer: new Buffer("test buffer contents")
		headers: {"user-agent": "bhttp/test PATCH buffer"}
.then (response) ->
	console.log "PATCH buffer", formatLine(response.body)
)

testcases.push(Promise.try ->
	# DELETE
	bhttp.delete requestbinTarget, {headers: {"user-agent": "bhttp/test DELETE"}}
.then (response) ->
	console.log "DELETE", formatLine(response.body)
)

testcases.push(Promise.try ->
	# GET
	bhttp.get requestbinTarget, {headers: {"user-agent": "bhttp/test GET"}}
.then (response) ->
	console.log "GET", formatLine(response.body)
)

testcases.push(Promise.try ->
	# Cookie test
	session = bhttp.session()
	session.post "http://www.html-kit.com/tools/cookietester/",
		cn: "testkey1"
		cv: "testvalue1"
.then (response) ->
	console.log "COOKIE1", response.redirectHistory[0].headers["set-cookie"]

	# Try to create a new session, make sure cookies don't carry over
	session = bhttp.session(headers: {"x-test-header": "some value"})
	session.post "http://www.html-kit.com/tools/cookietester/",
		cn: "testkey2"
		cv: "testvalue2"
.then (response) ->
	console.log "COOKIE2c", response.redirectHistory[0].headers["set-cookie"]
	console.log "COOKIE2h", response.request.options.headers
	console.log "COOKIE2h", response.redirectHistory[0].request.options.headers

	# Last test... without a session, this time
	bhttp.post "http://www.html-kit.com/tools/cookietester/",
		cn: "testkey3"
		cv: "testvalue4"
.then (response) ->
	console.log "NON-COOKIE SET", response.redirectHistory[0].headers["set-cookie"]

	# Ensure nothing was retained cookie-wise
	bhttp.get "http://www.html-kit.com/tools/cookietester/"
.then (response) ->
	console.log "NON-COOKIE GET", response.request.options.headers["cookie"]
)

testcases.push(Promise.try ->
	# No-redirect test
	session = bhttp.session()
	session.post "http://www.html-kit.com/tools/cookietester/",
		cn: "testkey1"
		cv: "testvalue1"
	, followRedirects: false
.then (response) ->
	console.log "NO-REDIR", response.headers["location"]
)

testcases.push(Promise.try ->
	# Redirect test
	bhttp.get "http://google.com/"
.then (response) ->
	console.log "REDIR", response.headers["location"], response.redirectHistory.length
)

Promise.all testcases
	.then ->
		bhttp.get "http://posttestserver.com/files/2015/01/19/f_03.01.01627545156", stream: true
	.then (response) ->
		#response.pipe process.stdout
		response
			.pipe(devNull())
			.on "finish", ->
				console.log "GET STREAM", "ok"

