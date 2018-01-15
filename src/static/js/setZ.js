"use strict";

function setZ() {
    var windows = document.querySelectorAll(".window");
    var nav = document.querySelector(".taskbar");
    var counter = 0;
    var i = 0;
    var newArr = [];

    function higestZ(theWindows, naving) {

        var glassSquare = document.querySelectorAll(theWindows);
        var highest = 0;

        for (var i = 0; i < glassSquare.length; i += 1) {
            //Checks all the windows for z-index
            var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");
            if ((zindex !== "auto")) {

                //If it's the nav - then add 200 to the z-index, else just one for normal windows.
                if (naving) {
                    highest = parseInt(zindex) + 200;
                } else {
                    highest = parseInt(zindex) + 1;

                    //Push values into array
                    newArr.push(highest);
                }
            }
        }

        //Sort array
        newArr.sort(function(a, b) {
            return b - a;
        });

        //If the highest in array isn't undefined, return that value, else return normal highest.
        if (newArr[0] !== undefined) {
            return newArr[0];
        } else {
            return highest;
        }

    }

    //When run, get the highest z-index and set that to the navbar
    nav.style.zIndex = parseInt(higestZ(".window", true));

    function settingNe() {

        for (i = 0; i < windows.length; i += 1) {
            counter += 1;
        }

        //In order for nav to get the highest z-index, give the windows z-index on init.
        windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

        //When clicking a window, check the highest z-index and add that to that specific window.
        windows[counter - 1].addEventListener("mousedown", function() {
            this.style.zIndex = parseInt(higestZ(".window", false));

        });

    }

    settingNe();

}

//Off to renderWindow + windowPlacement
module.exports.set = setZ;
