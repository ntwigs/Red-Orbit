function checkNick() {

  var nickInput = document.querySelectorAll(".name-field");
  var changeButton = document.querySelectorAll(".name-field");

  var i = 0;
  var k = 0;
  var nickname = "";

  for (i = 0; i < nickInput.length; i += 1) {
    k++;
  }

  if (localStorage.getItem("nickname") !== null) {
    nickname = localStorage.getItem("nickname");
    nickInput[k - 1].classList.add("name-field-gone");

  } else {
      nickInput[k - 1].classList.remove("name-field-gone");
  }

}

module.exports.check = checkNick;
