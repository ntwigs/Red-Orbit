"use strict";

function windowDestroyer() {
    var findExit = document.querySelectorAll(".exit");
    var body = document.querySelector("body");

    function removing(event) {
        if (event.target.parentElement.parentElement.parentElement !== body) {
            event.target.parentElement.parentElement.parentElement.remove();
        }
    }

    for (var i = 0; i < findExit.length; i += 1) {
        findExit[i].addEventListener("click", removing);
    }
}

module.exports.destroy = windowDestroyer;
