"use strict";

function movable() {


  var findWindows = document.querySelectorAll(".window");
  var i = 0;
  var counter = 0;

  function addListeners() {

      //Look for the window and add mousedown + and mouseup
      for (i = 0; i < findWindows.length; i += 1) {
        counter++;
      }

      findWindows[counter - 1].addEventListener("mousedown", mouseDown, false);

      window.addEventListener("mouseup", mouseUp, false);
  }

  var aVarY = 0;
  var aVarX = 0;
  var saveTarget = 0;

  function mouseDown(event) {

      if (event.target.className.slice(0, 3) === "top") {
        aVarY = event.offsetY;
        aVarX = event.offsetX;
        saveTarget = event.target;
        window.addEventListener("mousemove", divMove, true);
        saveTarget.parentElement.style.opacity = 0.85;
      }
  }

  function mouseUp(event) {

    for (i = 0; i < findWindows.length; i += 1) {
      findWindows[i].style.opacity = 1;
    }

    window.removeEventListener("mousemove", divMove, true);

  }

  function divMove(event) {
    if (event.y - aVarY < 0) {
      saveTarget.parentElement.style.top = "0px";
    } else if (event.y - aVarY > window.innerHeight - saveTarget.parentElement.offsetHeight + saveTarget.parentElement.offsetHeight * 0.5) {
      saveTarget.parentElement.style.top = window.innerHeight - saveTarget.parentElement.offsetHeight + saveTarget.parentElement.offsetHeight * 0.5 + "px";
    } else {
      // console.log(window.innerHeight);
      saveTarget.parentElement.style.top = event.y - aVarY + "px";
    }

    if (event.x - aVarX < 0) {
      saveTarget.parentElement.style.left = "0px";
    } else if (event.x - aVarX > window.innerWidth - saveTarget.parentElement.offsetWidth + saveTarget.parentElement.offsetWidth * 0.5) {
      saveTarget.parentElement.style.left = window.innerWidth - saveTarget.parentElement.offsetWidth + saveTarget.parentElement.offsetWidth * 0.5 + "px";
    } else {
      saveTarget.parentElement.style.left = event.x - aVarX + "px";
    }




  }

  addListeners();

};

module.exports.move = movable;
