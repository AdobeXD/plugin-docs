## 1.2.4 (August 16, 2016)

* __Documentation:__ Added this changelog.

## 1.2.3 (August 16, 2016)

* __Patch:__ Upgraded `tough-cookie` to `2.31` to resolve [a ReDoS vulnerability](https://nodesecurity.io/advisories/130). (contributed by [Rocky Assad](https://github.com/fourq))
* __Patch:__ Fixed delete method to not have a `data` argument (in line with the documentation). (contributed by [MychaelZ](https://github.com/MychaelZ))

## 1.2.2

(never existed due to an administrative error)

## 1.2.1 (April 27, 2015)

* __Documentation:__ Fixed tips button in README.

## 1.2.0 (April 27, 2015)

* __Minor:__ Allow request payloads for custom HTTP verbs.

## 1.1.3 (April 11, 2015)

* __Patch:__ Changed redirect handling to correctly resolve relative paths to the original request domain.
* __Documentation:__ Added clarification regarding convenience methods, and the fact that they use `bhttp.request` internally.

## 1.1.2 (April 9, 2015)

* __Patch:__ Fixed to send the correct `Content-Type` header for request payloads - specifically, for JSON-encoded payloads.

## 1.1.1 (April 9, 2015)

* __Patch:__ Replaced `.resume()` with a `.pipe()` to the `dev-null` module, and monkeypatched the progress event handling into the response stream, to prevent "old mode" stream errors in some versions of Node.js 0.10.

## 1.1.0 (April 8, 2015)

* __Minor:__ Added a response timeout configuration option.
* __Minor:__ Added progress events.
* __Minor:__ Added a ConnectionTimeoutError type.
* __Patch:__ Isolated error types to the `bhttp` module, rather than storing them directly on the `errors` module.
* __Patch:__ Made internal debugging statements clearer.
* __Documentation:__ Added clarification regarding the agent problem only existing until Node.js 0.10.

## 1.0.4 (March 17, 2015)

* __Documentation:__ Fixed two missing `return`s in the session example.

## 1.0.3 (February 22, 2015)

* __Documentation:__ Fixed a missing `require()` in the usage example.

## 1.0.2 (January 24, 2015)

* __Patch:__ Fixed broken nodeback API.
* __Documentation:__ Added a simple usage example.

## 1.0.1 (January 23, 2015)

* __Documentation:__ Added a remark regarding HTTPS use.

## 1.0.0 (January 23, 2015)

* Initial release