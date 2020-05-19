bhttp = require "./"

console.log "make request"
bhttp.get("http://dead.dns.entry/asdfasdgasdg", responseTimeout: 4000)
bhttp.get("http://cryto.net", responseTimeout: 4000)
bhttp.get("http://dead.dns.entry/asdfasdgasdg")
