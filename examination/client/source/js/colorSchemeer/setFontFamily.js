"use strict";

function setFontFamily() {
    var hexContain = document.querySelectorAll(".over-square");
    var templatesHeader = document.querySelectorAll(".header-one input");
    var switchContainer = document.querySelectorAll(".switch-container");
    var switchContainerBold = document.querySelectorAll(".switch-container-bold");
    var counter = 0;
    var i = 0;

    for (i = 0; i < hexContain.length; i += 1) {
        counter += 1;
    }

    var hexIn = hexContain[counter - 1].querySelector("input");
    templatesHeader[counter - 1].value = "LOREM IPSUM";

    hexIn.addEventListener("keydown", function() {

        this.addEventListener("keyup", function() {
            var saveTarget = this.parentElement.parentElement.parentElement.children[1].firstElementChild.firstElementChild.firstElementChild;

            // console.log(saveTarget);

            if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {
                this.value = "#" + this.value;
                saveTarget.style.color = this.value;
            } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {
                saveTarget.style.color = this.value;
            } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {
                this.value = "#" + this.value.slice(0, -1);
            }

            //Check if entered text is valid hex.
            var reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

            if (this.value.length === 7) {

                if (!reg.test(this.value)) {
                    this.style.backgroundColor = "#ae3737";
                } else {
                    this.style.backgroundColor = "#59AE37";
                }

            } else if (this.value.length < 7) {

                this.style.backgroundColor = "white";

            }

        });

    });

    switchContainer[counter - 1].addEventListener("click", function() {
        // console.log(this);
        if (templatesHeader[counter - 1].classList.contains("serif")) {
            templatesHeader[counter - 1].classList.remove("serif");
            this.firstElementChild.style.marginLeft = "0px";
        } else {
            templatesHeader[counter - 1].classList.add("serif");
            this.firstElementChild.style.marginLeft = "25px";
        }
    });

    switchContainerBold[counter - 1].addEventListener("click", function() {
        if (templatesHeader[counter - 1].classList.contains("bold")) {
            templatesHeader[counter - 1].classList.remove("bold");
            this.firstElementChild.style.marginLeft = "25px";
        } else {
            templatesHeader[counter - 1].classList.add("bold");
            this.firstElementChild.style.marginLeft = "0px";
        }
    });

}

module.exports.set = setFontFamily;
