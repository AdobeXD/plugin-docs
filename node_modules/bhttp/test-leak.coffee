firstCode = global.code
require "./"
secondCode = global.code
console.log global.name
console.log "Leaking global.code:", (firstCode != secondCode)
