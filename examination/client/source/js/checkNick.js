function checkNick() {

  var nickInput = document.querySelectorAll(".name-field");

  var i = 0;
  var nickname = "";

  if (localStorage.getItem("nickname") !== null) {
    nickname = localStorage.getItem("nickname");
    console.log("not empty");
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.add("name-field-gone");
    }

  } else {
    console.log("very empty");
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.remove("name-field-gone");
    }
  }

  console.log(nickname);
  return nickname;

}

module.exports.check = checkNick;
