"use strict";

/**
 *Let's the navbar appear on load (Gives a visually pleasing effect).
 */
function taskbar() {
    var findTaskbar = document.querySelector(".taskbar");
    window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

//Off to app
module.exports.bringForth = taskbar;
