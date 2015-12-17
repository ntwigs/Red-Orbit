"use strict";

function renderWindow() {

  var movable = require("./movable");
  var windowDestroyer = require("./windowDestroyer");

  function navClick() {
    var findNav = document.querySelectorAll(".icon1");
    findNav[0].addEventListener("click", function() {
      render();
    });
  }

  navClick();

  function render() {
    var template = document.querySelector("#window-template");
    console.log(template);
    var clone = document.importNode(template.content, true);
    var beforeThis = document.querySelector(".wrapper-hero");
    document.querySelector("body").insertBefore(clone, beforeThis);

    movable.move();
    windowDestroyer.destroy();
  }

}

module.exports.render = renderWindow;
