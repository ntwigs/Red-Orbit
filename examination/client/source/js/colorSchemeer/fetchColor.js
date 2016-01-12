"use strict";

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
            // console.log(saveTarget);

            this.addEventListener("keyup", function() {
                var saveTarget = this.parentElement.parentElement.parentElement;

                saveTarget = saveTarget.children[1].children[0];

                if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {
                    this.value = "#" + this.value;
                    this.parentElement.children[0].style.backgroundColor = this.value;
                    if (this === hexIn[0]) {
                        saveTarget.children[0].style.backgroundColor = this.value;
                    }

                    if (this === hexIn[1]) {
                        saveTarget.children[1].style.backgroundColor = this.value;
                    }

                    if (this === hexIn[2]) {
                        saveTarget.style.backgroundColor = this.value;
                    }

                    if (this === hexIn[3]) {
                        saveTarget.children[2].style.backgroundColor = this.value;
                    }
                } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {
                    this.parentElement.children[0].style.backgroundColor = this.value;
                    if (this === hexIn[0]) {
                        saveTarget.children[0].style.backgroundColor = this.value;
                    }

                    if (this === hexIn[1]) {
                        saveTarget.children[1].style.backgroundColor = this.value;
                    }

                    if (this === hexIn[2]) {
                        saveTarget.style.backgroundColor = this.value;
                    }

                    if (this === hexIn[3]) {
                        saveTarget.children[2].style.backgroundColor = this.value;
                    }
                } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {
                    this.value = "#" + this.value.slice(0, -1);
                    if (this === hexIn[0]) {
                        saveTarget.children[0].style.backgroundColor = this.value;
                    }

                    if (this === hexIn[1]) {
                        saveTarget.children[1].style.backgroundColor = this.value;
                    }

                    if (this === hexIn[2]) {
                        saveTarget.style.backgroundColor = this.value;
                    }

                    if (this === hexIn[3]) {
                        saveTarget.children[2].style.backgroundColor = this.value;
                    }
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

module.exports.fetch = fetchColor;
