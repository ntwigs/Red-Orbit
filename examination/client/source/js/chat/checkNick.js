"use strict";

function checkNick() {

    var nickInput = document.querySelectorAll(".name-field");

    var i = 0;
    var k = 0;
    var nickname = "";

    for (i = 0; i < nickInput.length; i += 1) {
        k += 1;
    }

    //Check if there is a nickname in localstorage
    if (localStorage.getItem("nickname") !== null) {

        //Get nick from local storage
        nickname = localStorage.getItem("nickname");
        nickInput[k - 1].classList.add("name-field-gone");
    } else {

        //Else display nick box.
        nickInput[k - 1].classList.remove("name-field-gone");
    }

}

module.exports.check = checkNick;
