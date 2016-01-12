"use strict";

/**
 * Gamelogic (Is it pair? What if it isn't? Can the user press? Etc.)
 */
function checkPair() {
    var container = document.querySelectorAll(".card-container");
    var counter = 0;
    var i = 0;
    var newArr = [];
    var targetArr = [];
    var saveTarget = [];
    var clicks = 0;
    var tries = 0;
    var pairCounter = 0;
    var winCheck = require("./winCheck");

    for (i = 0; i < container.length; i += 1) {
        counter += 1;
    }

    var cardsInWindow = container[counter - 1].querySelectorAll(".card");
    var counterInWindow = container[counter - 1].parentElement.querySelector(".clickCounter");

    //Pushes cards into array.
    function checkerTool(whichElement) {
        newArr.push(whichElement.parentElement.className);
        saveTarget.push(whichElement);
    }

    //If it's a pair, do the following.
    function onPair() {
        saveTarget[0].classList.add("aPair");
        saveTarget[1].classList.add("aPair");
        saveTarget[0].setAttribute("tabindex", "0");
        saveTarget[0].setAttribute("tabindex", "0");
        clicks = 0;
        pairCounter += 1;
        if (pairCounter >= 8) {
            winCheck.win(counterInWindow);
        }
    }

    //If it's not a pair, do the following.
    function notPair(theTheme) {

        if (localStorage.theme !== "") {

            // var lastTheme = localStorage.getItem("theme");
            saveTarget[0].style.backgroundImage = "url('../image/" + theTheme + "/0.png')";
            saveTarget[1].style.backgroundImage = "url('../image/" + theTheme + "/0.png')";
        } else {
            saveTarget[0].style.backgroundImage = "url('../image/plain/0.png')";
            saveTarget[1].style.backgroundImage = "url('../image/plain/0.png')";
        }

        clicks = 0;
    }

    //Runs either onPair, or notPair with checkerTool.
    function isPair(whichElement, currentTheme) {
        if (targetArr[0] !== targetArr[1]) {
            if (newArr.length < 1) {
                checkerTool(whichElement);
            } else if (newArr.length < 2) {
                if (targetArr[0] && targetArr[1]) {
                    checkerTool(whichElement);

                }
            } else if (newArr.length >= 2) {
                newArr.length = 0;
                saveTarget.length = 0;
                checkerTool(whichElement);
            }

            if (newArr[0] && newArr[1]) {
                if (newArr[0] === newArr[1]) {
                    setTimeout(onPair, 1000);
                } else {
                    setTimeout(function() {
                        notPair(currentTheme);
                    }, 1000);
                }
            }
        }
    }

    //Click with enter.
    function checkEnter(selection, event) {
        selection.click();
        event.preventDefault();
    }

    //Game logic init.
    function listener(whichElement) {

        if (clicks < 2) {

            clicks += 1;

            tries += 1;

            var getWindow = whichElement.parentElement.parentElement.parentElement.parentElement;
            var currentTheme = getWindow.getAttribute("data-theme");

            whichElement.style.backgroundImage = "url('../image/" + currentTheme + "/" + whichElement.parentElement.className + ".png')";

            if (targetArr.length >= 2) {
                targetArr.length = 0;
            }

            if (targetArr.length < 2) {
                targetArr.push(whichElement);
            }

            if (targetArr[0] === targetArr[1]) {
                targetArr = targetArr.splice(0, 1);
                clicks = clicks -= 1;
                tries = tries -= 1;
                pairCounter = pairCounter -= 1;
            }

            counterInWindow.textContent = tries;

            isPair(whichElement, currentTheme);

        }
    }

    //Check if pressing with enter.
    function applyClicks(i, event) {
        cardsInWindow[i].addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                checkEnter(this, event);
            }
        });

        //Check if clicked.
        cardsInWindow[i].addEventListener("click", function() {
            listener(this, event);
        });
    }

    //Apply the events to the cards.
    for (i = 0; i < cardsInWindow.length; i += 1) {
        applyClicks(i, event);
    }
}

//Off to createMemory
module.exports.check = checkPair;
