Promise = require "bluebird"
bhttp = require "./"
util = require "util"

session = bhttp.session()
#console.log util.inspect(session, {colors: true})

Promise.try ->
	console.log "Making first request..."
	session.post "http://www.html-kit.com/tools/cookietester/",
		cn: "testkey1"
		cv: "testvalue1"
.then (response) ->
	# discard the response

	console.log "Making first-and-a-half request..."
	session.post "http://www.html-kit.com/tools/cookietester/",
		cn: "testkey2"
		cv: "testvalue2"
.then (response) ->
	# discard the response

	console.log "Making second request..."
	session.get "http://www.html-kit.com/tools/cookietester/"
.then (response) ->
	console.log response.request.options.headers.cookie
	# discard the response
