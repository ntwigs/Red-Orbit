"use strict";

function loadingCards() {
  var i = 0;
  var counter = 0;
  var windows = document.querySelectorAll(".window");
  var template = document.querySelector("#memory-template");
  var clone = document.importNode(template.content, true);
  var clickCounter = document.querySelectorAll(".clickCounter");

  for (i = 0; i < windows.length; i += 1) {
    counter++;
  }

  document.querySelectorAll(".window")[counter - 1].insertBefore(clone, clickCounter[counter - 1]);

}

module.exports.load = loadingCards;
