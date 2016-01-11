"use strict";

function loadScheme() {
    var findSquare = document.querySelectorAll(".design-square");
    var tempOne = document.querySelector("#design-one");
    var clone = document.importNode(tempOne.content, true);
    var counter = 0;
    var i = 0;

    var setPoint = document.querySelectorAll(".before-this");

    for (i = 0; i < findSquare.length; i += 1) {
        counter += 1;
    }

    findSquare[counter - 1].insertBefore(clone, setPoint[counter - 1]);

}

module.exports.load = loadScheme;
