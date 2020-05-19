"use strict";

const red = "#f15056";
const yellow = "#f9c536";
const green = "#39e949";

/**
 * Creates a circular window button.
 * @param fill The fill to create with.
 */
function createButton(fill) {
    let button = "<svg width='20' height='22'>";
    button += "<circle cx='8' cy='15' r='7' fill='" + fill + "'></circle>";
    button += "</svg>";

    return button;
}

/**
 * Exported members.
 */
module.exports = {
    /**
     * Create a terminal representation based on a body of text.
     * @param body The text/command to include in the terminal.
     */
    createTerm: function (body) {
        const termWindow = "<div class='top term'>" + createButton(yellow) + createButton(green) + createButton(red) + "</div>";
        const termBody = "<div class='term text bottom'><span class='normalUser'>&#36;</span>" + body + "</div>";

        return termWindow + termBody;
    }
}
