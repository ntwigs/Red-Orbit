"use strict";

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
    findAllWindows[counter - 1].style.top = "" + 30 * counter + "px";
    findAllWindows[counter - 1].style.left = "" + 30 * counter + "px";
  }

  whereToPlace();



}

module.exports.place = windowPlacement;
