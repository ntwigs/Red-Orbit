function chatSettings(event) {
  var changeButton = document.querySelectorAll(".nick-changer");
  var nameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var brawski = 0;
  var j = 0;
  var newArr = [];

  for (j = 0; j < changeButton.length; j += 1) {
    brawski++;
  }

  console.log(brawski);


  function findAndSet(event) {
    console.log("hey");

      if (event.target.parentElement.parentElement.children[1].classList.contains("name-field-gone")) {
        event.target.parentElement.parentElement.children[1].classList.remove("name-field-gone");
        event.target.parentElement.parentElement.children[2].classList.remove("text-container-after");
      } else {
        event.target.parentElement.parentElement.children[1].classList.add("name-field-gone");
        event.target.parentElement.parentElement.children[2].classList.add("text-container-after");
      }

  }


  changeButton[brawski - 1].addEventListener("click", findAndSet);

  // for(i = 0; i < changeButton.length; i += 1) {
  //     changeButton[i].addEventListener("click", findAndSet, true);
  // }

}

module.exports.change = chatSettings;
