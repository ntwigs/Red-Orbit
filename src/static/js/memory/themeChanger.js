"use strict";

/**
 * Makes it available for the user to change the theme of the memory.
 */
function themeChanger() {
    var hasCards = document.querySelectorAll(".theme-selector");
    var counter = 0;
    var i = 0;

    for (i = 0; i < hasCards.length; i += 1) {
        counter += 1;
    }

    //Select all cards.
    var cards = document.querySelectorAll(".card-container")[counter - 1].querySelectorAll(".card");

    //Check and get (if) theme
    function whatCards(color) {

        localStorage.setItem("theme", color);

        hasCards[counter - 1].parentElement.setAttribute("data-theme", color);

        for (i = 0; i < cards.length; i += 1) {
            cards[i].style.backgroundImage = "url('../image/" + color + "/0.png')";
        }

    }

    hasCards[counter - 1].querySelectorAll(".picker-container")[0].addEventListener("click", function() {
        whatCards("plain");
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[1].addEventListener("click", function() {
        whatCards("red");
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[2].addEventListener("click", function() {
        whatCards("blue");
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[3].addEventListener("click", function() {
        whatCards("green");
    });

    var themeButton = hasCards[counter - 1].parentElement.firstElementChild.firstElementChild;

    function bringTheme(event) {
        event.target.classList.toggle("nick-cog-rotate");
        event.target.parentElement.parentElement.children[1].classList.toggle("theme-field-gone");
        event.target.parentElement.parentElement.children[2].classList.toggle("card-container-after");
    }

    themeButton.addEventListener("click", bringTheme);

}

//Off to createMemory
module.exports.change = themeChanger;
