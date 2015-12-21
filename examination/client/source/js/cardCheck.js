"use strict";

function cardCheck() {

  var i = 0;
  var cardArr = [];


  var findImg = document.querySelectorAll("img");

  for (i = 0; i < findImg.length/2; i+= 1) {
    cardArr.push(i+1);
    cardArr.push(i+1);
  }

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

  var storage = [];
  var randomizer = 0;
  var removeTheNumber = 0;


  for (i = 0; i < findImg.length; i += 1) {
    randomizer = Math.floor(Math.random() * cardArr.length);
    removeTheNumber = cardArr.splice(randomizer, 1);
    findImg[i].setAttribute("src", "image/0.png");
    findImg[i].classList.add(removeTheNumber);
    findImg[i].addEventListener("click", function(event) {
      storage.push(event.target);
      if (storage.length > 2) {
        window.setTimeout(function() {
          storage.length = 0;
        }, 1001);
      }

      if (storage[0] === storage[1]) {
        storage = storage.slice(0, -1);
      } else if (storage.length <= 2) {
        if (event.target.hasAttribute("src", "image/0.png")) {
          event.target.setAttribute("src", "image/" + event.target.className + ".png" );

          setTimeout(function() {
            storage.length = 0;
          }, 1001);
        }
      }

    });
  }

}

module.exports.check = cardCheck;
