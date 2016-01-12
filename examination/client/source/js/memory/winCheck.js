"use strict";

/**
 * Adds a winning message to the the specific window (Current window).
 * @param currentWindow
 */
function winCheck(currentWindow) {
    var youWin = document.createTextNode("YOU WIN!");
    var breaking = document.createElement("BR");
    var ptag = document.createElement("P");
    ptag.appendChild(youWin);
    ptag.classList.add("winning-message");
    currentWindow.appendChild(breaking);
    currentWindow.appendChild(ptag);
    currentWindow.classList.add("present-click");
}

//Off to checkPair
module.exports.win = winCheck;
