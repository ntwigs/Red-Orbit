function cardRandomizer() {
  var cards = document.querySelectorAll(".card");
  var windows = document.querySelectorAll(".window");
  var cardContainer = document.querySelectorAll(".card-container");
  var i = 0;
  var j = 0;
  var cardArr = [];
  var newNumber = 0;
  var newCounter = 0;

  for (i = 0; i < 8; i += 1) {
    for (j = 0; j < 2; j += 1) {
      cardArr.push(i + 1);
    }
  }

  for (i = 0; i < windows.length; i += 1) {
    newCounter++;
  }


  randomAndSet();




  function randomAndSet() {
    var counter = 0;
    var windowCount = 0;

    for (i = 0; i < windows.length; i += 1) {
      windowCount++;
    }

    var cardsInWindows = windows[windowCount - 1].querySelectorAll(".card");

    for (i = 0; i < 16; i += 1) {
      newNumber = cardArr.splice(0, 1);
      counter++;
      cardsInWindows[counter - 1].parentElement.classList.add(newNumber);
    }

    counter = 0;

    for (i = 0; i < cards.length; i += 1) {

      counter++;

      cards[counter - 1].addEventListener("click", function() {
        console.log(this.parentElement.className);
        this.style.backgroundImage = "url('../image/" + this.parentElement.className + ".png')";
      });
    }

  }

  // console.log(cardArr);

}

module.exports.run = cardRandomizer;
