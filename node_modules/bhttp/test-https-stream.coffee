bhttp = require "./"
Promise = require "bluebird"

Promise.try ->
	bhttp.get "https://google.com/"
.then (response) ->
	console.log "Got response", response
