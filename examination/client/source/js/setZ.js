"use strict";

function setZ() {
  var windows = document.querySelectorAll(".window");
  var counter = 0;
  var i = 0;
  var j = 0;
  var newCounter = 0;
  var newArr = [];

  function higestZ(theWindows) {

    var glassSquare = document.querySelectorAll(theWindows);
    var highest = 0;

    for (var i = 0; i < glassSquare.length; i++) {
      var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");
      if ((zindex !== "auto")) {
        // (zindex > highest) &&
        highest = parseInt(zindex) + 1;
        console.log(highest)
        newArr.push(highest);
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

settingNe();

  function settingNe() {

    for (i = 0; i < windows.length; i += 1) {
      counter++;
    }

      windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

      windows[counter - 1].addEventListener("mousedown", function() {
        // console.log(parseInt(higest));
        this.style.zIndex = parseInt(higestZ(".window"));
      });



  }

}

module.exports.set = setZ;
