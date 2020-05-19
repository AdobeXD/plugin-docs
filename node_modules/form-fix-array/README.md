# form-fix-array

This makes sure that form data is handled correctly when sent to a server.

While arrays are a natively supported feature of HTTP form data (whether URL-encoded or multipart/form-data), implementation differences exist. Especially PHP is notorious for refusing to recognize a field as an array unless it specifically has array brackets in the field name. This means that `field=val1&field=val2` will simply be interpreted as `val2`, whereas `field[]=val1&field[]=val2` will be interpreted as an array containing `val1` and `val2`.

This module ensures that all fields containing an array of values have a `[]` suffix, adding it where necessary (and doing nothing where it is already there). That way, every receiving server should be able to handle the request.

It does not currently support objects ('associative arrays'), only plain arrays.

## License

[WTFPL](http://www.wtfpl.net/txt/copying/) or [CC0](https://creativecommons.org/publicdomain/zero/1.0/), whichever you prefer. A donation and/or attribution are appreciated, but not required.

## Donate

My income consists entirely of donations for my projects. If this module is useful to you, consider [making a donation](http://cryto.net/~joepie91/donate.html)!

You can donate using Bitcoin, PayPal, Gratipay, Flattr, cash-in-mail, SEPA transfers, and pretty much anything else.

## Contributing

Pull requests welcome. Please make sure your modifications are in line with the overall code style, and ensure that you're editing the `.coffee` files, not the `.js` files.

Build tool of choice is `gulp`; simply run `gulp` while developing, and it will watch for changes.

Be aware that by making a pull request, you agree to release your modifications under the licenses stated above.

## Usage

```javascript
var formFixArray = require("form-fix-array");

var sampleFormData = {
	"fieldOne": "value 1",
	"fieldTwo": ["value 2a", "value 2b"],
	"fieldThree[]": ["value 3a", "value 3b"]
}

var fixedFormData = formFixArray(sampleFormData);

/* Result:
{
	"fieldOne": "value 1",
	"fieldTwo[]": ["value 2a", "value 2b"],
	"fieldThree[]": ["value 3a", "value 3b"]
}
*/
```
