"use strict";

/**
 * Obtains the colors from input and checks for errors.
 */
function fetchColor() {
    var hexContain = document.querySelectorAll(".color-container");
    var counter = 0;
    var newCounter = 0;
    var i = 0;

    for (i = 0; i < hexContain.length; i += 1) {
        counter += 1;
    }

    var hexIn = hexContain[counter - 1].querySelectorAll(".color-row input");

    for (i = 0; i < hexIn.length; i += 1) {

        newCounter += 1;

        hexIn[i].addEventListener("keydown", function() {

            this.addEventListener("keyup", function() {
                var saveTarget = this.parentElement.parentElement.parentElement;

                saveTarget = saveTarget.children[1].children[0];

                //Selection is the current input (this).
                function setBg(selection) {
                    if (selection === hexIn[0]) {
                        saveTarget.children[0].style.backgroundColor = hexIn[0].value;
                    }

                    if (selection === hexIn[1]) {
                        saveTarget.children[1].style.backgroundColor = hexIn[1].value;
                    }

                    if (selection === hexIn[2]) {
                        saveTarget.style.backgroundColor = hexIn[2].value;
                    }

                    if (selection === hexIn[3]) {
                        saveTarget.children[2].style.backgroundColor = hexIn[3].value;
                    }
                }

                if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {

                    //If there's six letters and no hashtag.
                    this.value = "#" + this.value;
                    this.parentElement.children[0].style.backgroundColor = this.value;
                    setBg(this);

                } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {

                    //If there's 6 letters + a hashtag - proceed as normal.
                    this.parentElement.children[0].style.backgroundColor = this.value;
                    setBg(this);

                } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {

                    //If there's 7 or more letters (More should be impossible) - then remove that last and add a hash.
                    this.value = "#" + this.value.slice(0, -1);
                    setBg(this);
                }

                //Check if entered text is valid hex.
                var reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

                if (this.value.length === 7) {

                    //Sets colors on inputs depending on value
                    if (!reg.test(this.value)) {
                        this.style.backgroundColor = "#8b3030";
                    } else {
                        this.style.backgroundColor = "#59AE37";
                    }

                } else if (this.value.length < 7) {
                    this.style.backgroundColor = "white";

                }

            });

        });
    }

}

//Off to colorSchemeer
module.exports.fetch = fetchColor;
