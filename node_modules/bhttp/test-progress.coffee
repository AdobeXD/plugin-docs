Promise = require "bluebird"
bhttp = require "./"
fs = require "fs"
devNull = require "dev-null"

formatLine = (line) -> line.toString().replace(/\n/g, "\\n").replace(/\r/g, "\\r")

Promise.try ->
	# multipart POST upload
	console.log "Starting upload..."

	bhttp.post "http://posttestserver.com/post.php",
		fieldOne: "value 1"
		fieldTwo: "value 2"
		fieldThree: ["value 3a", "value 3b"]
		fieldFour: new Buffer "value 4"
		testFile: fs.createReadStream("./lower.txt")
	,
		headers: {"user-agent": "bhttp/test POST multipart"}
		onUploadProgress: (completedBytes, totalBytes, request) ->
			console.log "#{completedBytes / totalBytes * 100}%", completedBytes, totalBytes
.then (response) ->
	console.log "POST multipart", formatLine(response.body)
.then ->
	# GET large file
	console.log "Starting download..."

	bhttp.get "http://posttestserver.com/files/2015/04/06/f_00.16.102133822615",
		headers: {"user-agent": "bhttp/test GET large file"}
		stream: true
.then (response) ->
	#setTimeout (->), 10000
	console.log "Got response"
	response.on "progress", (completedBytes, totalBytes, request) ->
			console.log "#{completedBytes / totalBytes * 100}%", completedBytes, totalBytes
	response.pipe(devNull())
	response.on "end", ->
		console.log "Completed response download"
