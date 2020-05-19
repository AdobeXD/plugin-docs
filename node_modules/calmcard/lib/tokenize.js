/* jshint globalstrict: true */
/* global require */
/* global module */
"use strict";

function tokenize(str) {
    var l = str.length;
    var i;
    var curr, next;
    var tokens = [];
    var tok = [0, ""];

    for (i = 0; i < l; i++) {
        curr = str.substr(i,1);
        if (curr === "*") {
            while (str.substr(i+1, 1) === "*") {
                // sequences of wildcards must be collapsed into one
                i++;
            }
            tokens.push(tok); // save the previously built srting token
            tokens.push([1]); //add a wildcard token
            tok = [0, ""]; //prepare a new string token
        } else if (curr === "\\") {
            // this is an escape sequence, skip to the next character
            i++;
            tok[1] += str.substr(i, 1);
        } else {
            tok[1] += curr;
        }
    }

    if (tok[0] === 1 || tok[0] === 0 && tok[1] !== "") {
        /*
         * Prevent an emoty string token at the end.
         */
        tokens.push(tok);
    }

    if (str !== "" && tokens[0][0] === 0 && tokens[0][1] === "") {
        /*
         * remove the empty string token at the beginning,
         * except if the whole pattern is an empty string.
         */
        tokens.shift();
    }

    return tokens;
}

module.exports = tokenize;
