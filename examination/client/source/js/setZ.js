"use strict";

function setZ() {
  var windows = document.querySelectorAll(".window");
  var nav = document.querySelector(".taskbar");
  var counter = 0;
  var i = 0;
  var j = 0;
  var newCounter = 0;
  var newArr = [];

  // for (j = 0; j < 4; j += 1) {
    nav.style.zIndex = parseInt(higestZ(".window", true));
  // }

  function higestZ(theWindows, naving) {

    var glassSquare = document.querySelectorAll(theWindows);
    var highest = 0;

    for (var i = 0; i < glassSquare.length; i++) {
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

settingNe();

  function settingNe() {



    for (i = 0; i < windows.length; i += 1) {
      counter++;
    }

      windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

      windows[counter - 1].addEventListener("mousedown", function() {
        this.style.zIndex = parseInt(higestZ(".window", false));

      });


  }

}

module.exports.set = setZ;
