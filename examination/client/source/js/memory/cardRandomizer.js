"use strict";

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

  function shuffle(cardArr) {
    var m = cardArr.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = cardArr[m];
      cardArr[m] = cardArr[i];
      cardArr[i] = t;
    }

    return cardArr;
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
      newNumber = shuffle(cardArr).splice(0, 1);
      counter++;
      cardsInWindows[counter - 1].parentElement.classList.add(newNumber);
    }

  }

}

module.exports.run = cardRandomizer;
