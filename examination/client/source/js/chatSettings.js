function chatSettings() {
  var changeButton = document.querySelectorAll(".nick-changer");
  var nameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var i = 0;

  for(i = 0; i < changeButton.length; i += 1) {
    changeButton[i].addEventListener("click", function() {
      nameField[i - 1].classList.toggle("name-field-gone");
      textContainer[i - 1].classList.toggle("text-container-after");
    });
  }
}

module.exports.change = chatSettings;
