function winCheck() {
  var windows = document.querySelectorAll(".card-container");
  var i = 0;
  var counter = 0;

  for (i = 0; i < windows.length; i += 1) {
    counter++;
  }


  windows[counter - 1].addEventListener("click", function() {
    var cardsMatch = windows[counter - 1].querySelectorAll(".aPair");

    if (cardsMatch.length === 16) {
        console.log("YOU WIN");
      }

  });

}

module.exports.win = winCheck;
