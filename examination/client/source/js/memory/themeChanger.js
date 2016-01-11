"use strict";

function themeChanger() {
    var hasCards = document.querySelectorAll(".theme-selector");
    var counter = 0;
    var i = 0;

    for (i = 0; i < hasCards.length; i += 1) {
        counter += 1;
    }

    var cards = document.querySelectorAll(".card-container")[counter - 1].querySelectorAll(".card");

    hasCards[counter - 1].querySelectorAll(".picker-container")[0].addEventListener("click", function() {

        localStorage.setItem("theme", "plain");

        this.parentElement.parentElement.setAttribute("data-theme", "plain");

        for (i = 0; i < cards.length; i += 1) {
            cards[i].style.backgroundImage = "url('../image/plain/0.png')";
        }

    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[1].addEventListener("click", function() {

        localStorage.setItem("theme", "red");

        this.parentElement.parentElement.setAttribute("data-theme", "red");

        for (i = 0; i < cards.length; i += 1) {
            cards[i].style.backgroundImage = "url('../image/red/0.png')";
        }

    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[2].addEventListener("click", function() {

        localStorage.setItem("theme", "blue");

        this.parentElement.parentElement.setAttribute("data-theme", "blue");

        for (i = 0; i < cards.length; i += 1) {
            cards[i].style.backgroundImage = "url('../image/blue/0.png')";
        }
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[3].addEventListener("click", function() {

        localStorage.setItem("theme", "green");

        this.parentElement.parentElement.setAttribute("data-theme", "green");

        for (i = 0; i < cards.length; i += 1) {
            cards[i].style.backgroundImage = "url('../image/green/0.png')";
        }

    });

    var themeButton = hasCards[counter - 1].parentElement.firstElementChild.firstElementChild;

    function bringTheme(event) {
        event.target.classList.toggle("nick-cog-rotate");
        if (event.target.parentElement.parentElement.children[1].classList.contains("theme-field-gone")) {
            event.target.parentElement.parentElement.children[1].classList.remove("theme-field-gone");
            event.target.parentElement.parentElement.children[2].classList.remove("card-container-after");
        } else {
            event.target.parentElement.parentElement.children[1].classList.add("theme-field-gone");
            event.target.parentElement.parentElement.children[2].classList.add("card-container-after");
        }

    }

    themeButton.addEventListener("click", bringTheme);

}

module.exports.change = themeChanger;
