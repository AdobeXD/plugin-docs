request = require "request"
CombinedStream = require "./lib/combined-stream2.coffee"
str = require "stream"

stream = CombinedStream.create()
stream.append request("http://google.com/")
stream.append new Buffer("\nDONE!\n")
stream.pipe(new str.PassThrough).resume()
