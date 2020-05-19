/* jshint globalstrict: true */
/* global require */
/* global module */
"use strict";

function match(tokens, str) {
    var curr, next, next_pos;
    var p = 0;

    while(tokens.length > 0) {
        curr = tokens.shift();
        if (curr[0] === 1) {
            //the current token is a wildcard
            next = tokens.shift();
            if (next) {
                /*
                 * there is also another token after it
                 * so we match for that with a prefix > 1 for the wildcard
                 */
                next_pos = str.indexOf(next[1]);
                if (next_pos > 0) {
                    //move the pointer to the end of the non-wildcard token
                    p = next_pos + next[1].length;
                } else {
                    //didn't fit. FAIL!
                    return false;
                }
            } else {
                //the current wildcard token is also the last token.
                if (str === "") {
                    //but there's nothing left to match. FAIL!
                    return false;
                }

                /*
                 * Since this last token is a wildcard.
                 * It uses up the rest of the string.
                 */
                str = "";
            }
        } else {
            // the current token is a string token
            if (str.indexOf(curr[1]) !== 0) {
                // it doesn't fit at the beginning. FAIL!
                return false;
            } else {
                // move pointer to the end of the string token
                p = p + curr[1].length;
            }
        }

        // cut the already matched part from the beginning of the string
        str = str.substr(p);
    }

    if (str.length > 0) {
        // the tokens didn't use up the 
        return false
    }

    // it did actually match. WOW!
    return true;
}

module.exports = match;
