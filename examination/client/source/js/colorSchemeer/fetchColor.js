function fetchColor() {
  var hexSquare = document.querySelectorAll(".color-row input");
  var hexContain = document.querySelectorAll(".color-container");
  var counter = 0;
  var newCounter = 0;
  var i = 0;

  for (i = 0; i < hexContain.length; i += 1) {
    counter++;
  }

  var hexIn = hexContain[counter - 1].querySelectorAll(".color-row input");

  for (i = 0; i < hexIn.length; i += 1) {
    // if (hexIn[i].value.length === 5) {
    //   hexIn[i].parentElement.children[0].style.backgroundColor = "#" + this.value + "0";
    // }

    newCounter++;

    hexIn[i].addEventListener("keydown", function() {
      // if (this.value.length === 5) {
      // var savethis = this.value;
      // this.parentElement.children[0].style.backgroundColor = "#" + hexIn[i].value;
        // setTimeout(function() {
        this.addEventListener("keyup", function() {
          if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {
            this.value = "#" + this.value;
            this.parentElement.children[0].style.backgroundColor = this.value;
          } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {

              this.parentElement.children[0].style.backgroundColor = this.value;
          } else if (this.value.length > 7) {
            this.value.length = 7;
          }
        });
    });
  }



}

module.exports.fetch = fetchColor;
