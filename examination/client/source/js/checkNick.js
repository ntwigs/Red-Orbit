function checkNick() {

  var nickInput = document.querySelectorAll(".name-field");
  var changeButton = document.querySelectorAll(".name-field");

  var i = 0;
  var nickname = "";

  if (localStorage.getItem("nickname") !== null) {
    nickname = localStorage.getItem("nickname");
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.add("name-field-gone");
    }

  } else {
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.remove("name-field-gone");
    }
  }

}

module.exports.check = checkNick;
