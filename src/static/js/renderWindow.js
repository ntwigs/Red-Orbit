"use strict";

/**
 * Initialize all windows ready for use.
 */
function renderWindow() {

    var movable = require("./movable");
    var windowDestroyer = require("./windowDestroyer");
    var createMemory = require("./memory/createMemory");
    var createChat = require("./chat/createChat");
    var colorSchemeer = require("./colorSchemeer/colorSchemeer");
    var windowPlacement = require("./windowPlacement");
    var setZ = require("./setZ");

    //Checks if which nav-button is being pressed.
    function navClick() {
        var findNav = document.querySelectorAll(".icon1");

        function checkNav(event) {
            if (event.target === findNav[0]) {
                render();
            } else if (event.target === findNav[1]) {
                renderMem();
            } else if (event.target === findNav[2]) {
                renderSchemee();
            }

        }

        for (var i = 0; i < findNav.length; i += 1) {

            findNav[i].addEventListener("click", checkNav);

        }

    }

    navClick();

    //Creates chat instance.
    function render() {
        var template = document.querySelector("#chat-template");
        var clone = document.importNode(template.content, true);
        var beforeThis = document.querySelector(".wrapper-hero");
        document.querySelector("body").insertBefore(clone, beforeThis);

        //initializes Placement, chat-part, movable-window, z-index, able to destroy window.
        windowPlacement.place();
        createChat.chat();
        movable.move();
        setZ.set();
        windowDestroyer.destroy();

    }

    //Create memory
    function renderMem() {
      var template = document.querySelector("#window-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      //initializes Placement, create-memory, movable-window, z-index, able to destroy window.
      windowPlacement.place();
      createMemory.create();
      movable.move();
      setZ.set();
      windowDestroyer.destroy();
  }

    //Creates Schemee (Third 'app')
    function renderSchemee() {
      var template = document.querySelector("#schemee-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      //initializes Placement, schemeer-init, movable-window, z-index, able to destroy window.
      windowPlacement.place();
      colorSchemeer.initialize();
      movable.move();
      setZ.set();
      windowDestroyer.destroy();
  }

}

//Off to app
module.exports.render = renderWindow;
