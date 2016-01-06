function setFontFamily() {
  var hexSquare = document.querySelector(".over-square input");
  var hexContain = document.querySelectorAll(".over-square");
  var templatesHeader = document.querySelectorAll(".header-one input");
  var switchContainer = document.querySelectorAll(".switch-container");
  var counter = 0;
  var newCounter = 0;
  var i = 0;

  for (i = 0; i < hexContain.length; i += 1) {
    counter++;
  }

  var hexIn = hexContain[counter - 1].querySelector("input");
  templatesHeader[counter - 1].value = "Lorem Ipsum";



  hexIn.addEventListener("keydown", function() {

      this.addEventListener("keyup", function() {
        var saveTarget = this.parentElement.parentElement.children[1].firstElementChild.firstElementChild;

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
            this.style.backgroundColor = "red";
          } else {
            this.style.backgroundColor = "green";
          }

        } else if (this.value.length < 7) {

          this.style.backgroundColor = "white";

        }

      });

  });

  console.log(hexIn);

  switchContainer[counter - 1].addEventListener("click", function() {
    if (templatesHeader[counter - 1].classList.contains("serif")) {
      templatesHeader[counter - 1].classList.remove("serif");
      this.firstElementChild.style.marginLeft = "0px";
    } else {
      templatesHeader[counter - 1].classList.add("serif");
      this.firstElementChild.style.marginLeft = "25px";
    }
  });


}

module.exports.set = setFontFamily;
