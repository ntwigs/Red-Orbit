function checkPair() {
  var container = document.querySelectorAll(".card-container");
  var counter = 0;
  var i = 0;
  var newArr = [];
  var targetArr = [];
  var saveTarget = [];
  var newCounter = 0;
  var clicks = 0;
  var tries = 0;
  var windows = document.querySelectorAll(".window");

  for (i = 0; i < container.length; i += 1) {
    counter++;
  }

  var cardsInWindow = container[counter - 1].querySelectorAll(".card");
  var counterInWindow = windows[counter - 1].querySelector(".clickCounter");

  for (i = 0; i < cardsInWindow.length; i += 1) {
      cardsInWindow[i].addEventListener("click", function(event) {

      if (clicks < 2) {

      clicks += 1;

      tries += 1;


      this.style.backgroundImage = "url('../image/" + this.parentElement.className + ".png')";

        if (targetArr.length >= 2) {
          targetArr.length = 0;
        }

        if (targetArr.length < 2) {
          targetArr.push(this);
        }

        if (targetArr[0] === targetArr[1]) {
          targetArr = targetArr.splice(0, 1);
          clicks = clicks -= 1;
          tries = tries -= 1;
        }


        counterInWindow.textContent = tries;

          if (targetArr[0] !== targetArr[1]) {
            if (newArr.length < 1) {
              newArr.push(this.parentElement.className);
              saveTarget.push(this);
            } else if (newArr.length < 2) {
              if(targetArr[0] && targetArr[1]) {
                newArr.push(this.parentElement.className);
                saveTarget.push(this);
              }
            } else if (newArr.length >= 2) {
                newArr.length = 0;
                saveTarget.length = 0;
                newArr.push(this.parentElement.className);
                saveTarget.push(this);
            }
          if (newArr[0] && newArr[1]) {
            if (newArr[0] === newArr[1]) {
              setTimeout(function() {
                saveTarget[0].classList.add("aPair");
                saveTarget[1].classList.add("aPair");
                console.log("PAIR");
                clicks = 0;
                }, 1000);
            } else {
              setTimeout(function() {
                saveTarget[0].style.backgroundImage = "url('../image/0.png')";
                saveTarget[1].style.backgroundImage = "url('../image/0.png')";
                console.log("NOT A PAIR");
                clicks = 0;
                }, 1000);
            }
          }
        }
      }
  });
  }
}



module.exports.check = checkPair;
