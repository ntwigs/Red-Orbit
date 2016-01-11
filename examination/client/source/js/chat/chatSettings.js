"use strict";

function chatSettings() {
    var changeButton = document.querySelectorAll(".nick-changer");
    var nicking = document.querySelectorAll(".enter-nick");
    var k = 0;
    var j = 0;

    for (j = 0; j < changeButton.length; j += 1) {
        k += 1;
    }

    function findAndSet(event) {

        nicking[k - 1].setAttribute("placeholder", localStorage.getItem("nickname"));
        event.target.classList.toggle("nick-cog-rotate");
        if (event.target.parentElement.parentElement.children[1].classList.contains("name-field-gone")) {
            event.target.parentElement.parentElement.children[1].classList.remove("name-field-gone");
            event.target.parentElement.parentElement.children[2].classList.remove("text-container-after");
        } else {
            event.target.parentElement.parentElement.children[1].classList.add("name-field-gone");
            event.target.parentElement.parentElement.children[2].classList.add("text-container-after");
        }

    }

    changeButton[k - 1].addEventListener("click", findAndSet);

}

module.exports.change = chatSettings;
