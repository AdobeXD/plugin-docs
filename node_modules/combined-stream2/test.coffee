fs = require "fs"
CombinedStream = require "./"
devNull = require "dev-null"

combinedStream = CombinedStream.create()
combinedStream.append fs.createReadStream("./package.json")
combinedStream.append fs.createReadStream("./test.coffee")
#combinedStream.pipe devNull()
combinedStream.pipe process.stdout
