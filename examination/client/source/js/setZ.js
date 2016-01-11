"use strict";

function setZ() {
    var windows = document.querySelectorAll(".window");
    var nav = document.querySelector(".taskbar");
    var counter = 0;
    var i = 0;
    var newArr = [];

    // for (j = 0; j < 4; j += 1) {

    // }

    function higestZ(theWindows, naving) {

        var glassSquare = document.querySelectorAll(theWindows);
        var highest = 0;

        for (var i = 0; i < glassSquare.length; i += 1) {
            var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");
            if ((zindex !== "auto")) {
                if (naving) {
                    highest = parseInt(zindex) + 200;
                } else {
                    highest = parseInt(zindex) + 1;
                    newArr.push(highest);
                }
            }
        }

        newArr.sort(function(a, b) {
            return b - a;
        });

        if (newArr[0] === newArr[1]) {
            if (newArr[0] !== undefined) {
                newArr.unshift(parseInt(newArr[0]));
            }
        }

        if (newArr[0] !== undefined) {
            return newArr[0];
        } else {
            return highest;
        }

    }

    nav.style.zIndex = parseInt(higestZ(".window", true));

    function settingNe() {

        for (i = 0; i < windows.length; i += 1) {
            counter += 1;
        }

        windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

        windows[counter - 1].addEventListener("mousedown", function() {
            this.style.zIndex = parseInt(higestZ(".window", false));

        });

    }

    settingNe();

}

module.exports.set = setZ;
