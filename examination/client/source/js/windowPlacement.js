"use strict";

var newCounter = 0;
var height = 0;
var width = 0;
var counting = 0;

function windowPlacement() {

  function whereToPlace() {
    var findAllWindows = document.querySelectorAll(".window");
    var counter = 0;
    var i = 0;
    
    for (i = 0; i < findAllWindows.length; i += 1) {
      counter++;
    }

    var setZ = require("./setZ");
    setZ.set();

    findAllWindows[counter - 1].style.top = "" + 30 * newCounter + "px";
    findAllWindows[counter - 1].style.left = "" + 30 * newCounter + "px";

    height += 30;
    width += 30;

    if ((width) > window.innerHeight - 500) {
      newCounter = 0;
      width = 30;
      findAllWindows[counter - 1].style.top = "" + width + "px";
      findAllWindows[counter - 1].style.left = "" + height + "px";
    } else {
      findAllWindows[counter - 1].style.top = "" + width + "px";
      findAllWindows[counter - 1].style.left = "" + height + "px";
    }


    if ((height) > window.innerWidth - 450) {
      counting++;
      height = 5 * counting;
    }
  }

  whereToPlace();



}

module.exports.place = windowPlacement;
