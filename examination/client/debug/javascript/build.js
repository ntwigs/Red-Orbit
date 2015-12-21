(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

// var memory = require("./memory");
// memory.create();

},{"./renderWindow":7,"./taskbar":8}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
"use strict";

function loadCards(rows, cards) {

  var j = 0;
  var i = 0;
  var cardSort = -1;

  var createCard = document.createElement("DIV");
  createCard.classList.add("card");
  var findCardContainer = document.querySelector(".card-container");

  for (i = 0; i < rows; i += 1) {
    var cardRow = document.createElement("DIV");
    cardRow.classList.add("row");
    for (j = 0; j < cards; j += 1) {
      var createCard = document.createElement("A");
      createCard.setAttribute("href", "#");
      var createImg = document.createElement("IMG");
      createCard.classList.add("card");
      createCard.appendChild(createImg);
      cardRow.appendChild(createCard);
      findCardContainer.appendChild(cardRow);
    }

  }

  var findAllCards = document.querySelectorAll(".card");

  if (findAllCards.length % 2 !== 0) {
    throw new Error("no");
  } else if (findAllCards.length > 16) {
    throw new Error("Too many");
  } else if (findAllCards.length < 4) {
    throw new Error("Too few");
  }

}

module.exports.cards = loadCards;

},{}],4:[function(require,module,exports){
"use strict";

function createMemory() {

  var loadCards = require("./loadCards");
  loadCards.cards(2, 2);

  var cardCheck = require("./cardCheck");
  cardCheck.check();

  var pairCheck = require("./pairCheck");
  pairCheck.pair();

}

module.exports.create = createMemory;

},{"./cardCheck":2,"./loadCards":3,"./pairCheck":6}],5:[function(require,module,exports){
function movable() {


  var findWindows = document.querySelectorAll(".window");
  var i = 0;

  function addListeners() {

      //Look for the window and add mousedown + and mouseup
      for (i = 0; i < findWindows.length; i += 1) {
        findWindows[i].addEventListener("mousedown", mouseDown, false);
      }

      window.addEventListener("mouseup", mouseUp, false);
  }

  function mouseUp() {
      //When releasing mouse.
      window.removeEventListener("mousemove", divMove, true);
  }

  function mouseDown(event) {

    //Saving coordinates on click.
    if (event.target.className === "top") {
      aVarY = event.offsetY;
      aVarX = event.offsetX;
      saveTarget = event.target;
    }

    //Runs mousemove - if dragging on the right place
    // if(saveTarget) {
    window.addEventListener("mousemove", divMove, true);
    // }
  }

  function divMove(event) {

    //Checks for window top.

    // if (event.target.className === "top") {

      //Sets top and left on absolute element.
      saveTarget.parentElement.style.top = event.y - aVarY + "px";
      saveTarget.parentElement.style.left = event.x - aVarX + "px";
    // }
  }

  addListeners();

};

module.exports.move = movable;

},{}],6:[function(require,module,exports){
"use strict";

function pairCheck() {
  var findTheCards = document.querySelectorAll("img");
  var findCounter = document.querySelector(".clickCounter");
  var clickCounting = 0;
  var i = 0;
  var onHandArr = [];
  var theCheckArr = [];

  var setAsFunctionTest = function(event) {

    clickCounting += 1;

    theCheckArr.push(event.target);
    onHandArr.push(event.target);


    if (theCheckArr[0] && theCheckArr[1]) {

      if (theCheckArr[0] !== theCheckArr[1]) {

          if (onHandArr[0] && onHandArr[1]) {
            if (onHandArr[2] !== undefined && onHandArr[2] !== null) {
              onHandArr = onHandArr.slice(0, -1);
            }


          window.setTimeout(function() {
            if (onHandArr[0] !== undefined && onHandArr[1] !== undefined) {
              if (onHandArr[0].className === onHandArr[1].className) {
                console.log("pair");
                // window.setTimeout(function() {
                onHandArr[0].classList.add("aPair");
                onHandArr[1].classList.add("aPair");
              // }, 1000);

              // window.setTimeout(function() {
                  onHandArr.length = 0;
                  theCheckArr.length = 0;
              // }, 1001);

              } else {

                console.log("not pair");
                // window.setTimeout(function() {
                  onHandArr[0].setAttribute("src", "image/0.png");
                  onHandArr[1].setAttribute("src", "image/0.png");
                // }, 500);

                  // window.setTimeout(function() {
                      onHandArr.length = 0;
                      theCheckArr.length = 0;
                  // }, 1001);

              }
            }
          }, 1001);
        }
      } else {
        onHandArr = onHandArr.slice(0, -1);
        console.log("You're pushing the same over and over again.");
        theCheckArr = theCheckArr.slice(0, -1);
        clickCounting -= 1;
      }
    }
    findCounter.textContent = clickCounting;
  };

    for (i = 0; i < findTheCards.length; i += 1) {
      findTheCards[i].addEventListener("click", setAsFunctionTest);
    }
}

module.exports.pair = pairCheck;

},{}],7:[function(require,module,exports){
"use strict";

function renderWindow() {

  var movable = require("./movable");
  var windowDestroyer = require("./windowDestroyer");
  var memory = require("./memory.js");

  function navClick() {
    var findNav = document.querySelectorAll(".icon1");
    findNav[0].addEventListener("click", function() {
      render();
    });
  }

  navClick();

  function render() {
    var template = document.querySelector("#window-template");
    console.log(template);
    var clone = document.importNode(template.content, true);
    var beforeThis = document.querySelector(".wrapper-hero");
    document.querySelector("body").insertBefore(clone, beforeThis);

    movable.move();
    memory.create();
    windowDestroyer.destroy();
  }

}

module.exports.render = renderWindow;

},{"./memory.js":4,"./movable":5,"./windowDestroyer":9}],8:[function(require,module,exports){
function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],9:[function(require,module,exports){
function windowDestroyer() {
  var findExit = document.querySelectorAll(".exit");
  for (var i = 0; i < findExit.length; i += 1) {
    findExit[i].addEventListener("click", function(event) {
      event.target.parentElement.parentElement.parentElement.remove();
    });
  }
}

module.exports.destroy = windowDestroyer;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2xvYWRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wYWlyQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL3JlbmRlcldpbmRvdy5qcyIsImNsaWVudC9zb3VyY2UvanMvdGFza2Jhci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93RGVzdHJveWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVuZGVyV2luZG93ID0gcmVxdWlyZShcIi4vcmVuZGVyV2luZG93XCIpO1xyXG5yZW5kZXJXaW5kb3cucmVuZGVyKCk7XHJcblxyXG52YXIgdGFza2JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XHJcbnRhc2tiYXIuYnJpbmdGb3J0aCgpO1xyXG5cclxuLy8gdmFyIG1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeVwiKTtcclxuLy8gbWVtb3J5LmNyZWF0ZSgpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGNhcmRDaGVjaygpIHtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBjYXJkQXJyID0gW107XHJcblxyXG5cclxuICB2YXIgZmluZEltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBmaW5kSW1nLmxlbmd0aC8yOyBpKz0gMSkge1xyXG4gICAgY2FyZEFyci5wdXNoKGkrMSk7XHJcbiAgICBjYXJkQXJyLnB1c2goaSsxKTtcclxuICB9XHJcblxyXG4gIHZhciBtID0gY2FyZEFyci5sZW5ndGgsIHQsIGk7XHJcblxyXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXHJcbiAgd2hpbGUgKG0pIHtcclxuXHJcbiAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnTigKZcclxuICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtLS0pO1xyXG5cclxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgIHQgPSBjYXJkQXJyW21dO1xyXG4gICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XHJcbiAgICBjYXJkQXJyW2ldID0gdDtcclxuICB9XHJcblxyXG4gIHZhciBzdG9yYWdlID0gW107XHJcbiAgdmFyIHJhbmRvbWl6ZXIgPSAwO1xyXG4gIHZhciByZW1vdmVUaGVOdW1iZXIgPSAwO1xyXG5cclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGZpbmRJbWcubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIHJhbmRvbWl6ZXIgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjYXJkQXJyLmxlbmd0aCk7XHJcbiAgICByZW1vdmVUaGVOdW1iZXIgPSBjYXJkQXJyLnNwbGljZShyYW5kb21pemVyLCAxKTtcclxuICAgIGZpbmRJbWdbaV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICBmaW5kSW1nW2ldLmNsYXNzTGlzdC5hZGQocmVtb3ZlVGhlTnVtYmVyKTtcclxuICAgIGZpbmRJbWdbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHN0b3JhZ2UucHVzaChldmVudC50YXJnZXQpO1xyXG4gICAgICBpZiAoc3RvcmFnZS5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzdG9yYWdlLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzdG9yYWdlWzBdID09PSBzdG9yYWdlWzFdKSB7XHJcbiAgICAgICAgc3RvcmFnZSA9IHN0b3JhZ2Uuc2xpY2UoMCwgLTEpO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0b3JhZ2UubGVuZ3RoIDw9IDIpIHtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpKSB7XHJcbiAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyBldmVudC50YXJnZXQuY2xhc3NOYW1lICsgXCIucG5nXCIgKTtcclxuXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzdG9yYWdlLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICB9LCAxMDAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNhcmRDaGVjaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBsb2FkQ2FyZHMocm93cywgY2FyZHMpIHtcclxuXHJcbiAgdmFyIGogPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY2FyZFNvcnQgPSAtMTtcclxuXHJcbiAgdmFyIGNyZWF0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gIGNyZWF0ZUNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XHJcbiAgdmFyIGZpbmRDYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IHJvd3M7IGkgKz0gMSkge1xyXG4gICAgdmFyIGNhcmRSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gICAgY2FyZFJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xyXG4gICAgZm9yIChqID0gMDsgaiA8IGNhcmRzOyBqICs9IDEpIHtcclxuICAgICAgdmFyIGNyZWF0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQVwiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgdmFyIGNyZWF0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJJTUdcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuYXBwZW5kQ2hpbGQoY3JlYXRlSW1nKTtcclxuICAgICAgY2FyZFJvdy5hcHBlbmRDaGlsZChjcmVhdGVDYXJkKTtcclxuICAgICAgZmluZENhcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoY2FyZFJvdyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdmFyIGZpbmRBbGxDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcclxuXHJcbiAgaWYgKGZpbmRBbGxDYXJkcy5sZW5ndGggJSAyICE9PSAwKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJub1wiKTtcclxuICB9IGVsc2UgaWYgKGZpbmRBbGxDYXJkcy5sZW5ndGggPiAxNikge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnlcIik7XHJcbiAgfSBlbHNlIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoIDwgNCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIGZld1wiKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYXJkcyA9IGxvYWRDYXJkcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XHJcblxyXG4gIHZhciBsb2FkQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkQ2FyZHNcIik7XHJcbiAgbG9hZENhcmRzLmNhcmRzKDIsIDIpO1xyXG5cclxuICB2YXIgY2FyZENoZWNrID0gcmVxdWlyZShcIi4vY2FyZENoZWNrXCIpO1xyXG4gIGNhcmRDaGVjay5jaGVjaygpO1xyXG5cclxuICB2YXIgcGFpckNoZWNrID0gcmVxdWlyZShcIi4vcGFpckNoZWNrXCIpO1xyXG4gIHBhaXJDaGVjay5wYWlyKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsImZ1bmN0aW9uIG1vdmFibGUoKSB7XHJcblxyXG5cclxuICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGZpbmRXaW5kb3dzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZVVwKCkge1xyXG4gICAgICAvL1doZW4gcmVsZWFzaW5nIG1vdXNlLlxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xyXG5cclxuICAgIC8vU2F2aW5nIGNvb3JkaW5hdGVzIG9uIGNsaWNrLlxyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09IFwidG9wXCIpIHtcclxuICAgICAgYVZhclkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgICBhVmFyWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy9SdW5zIG1vdXNlbW92ZSAtIGlmIGRyYWdnaW5nIG9uIHRoZSByaWdodCBwbGFjZVxyXG4gICAgLy8gaWYoc2F2ZVRhcmdldCkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgLy9DaGVja3MgZm9yIHdpbmRvdyB0b3AuXHJcblxyXG4gICAgLy8gaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09IFwidG9wXCIpIHtcclxuXHJcbiAgICAgIC8vU2V0cyB0b3AgYW5kIGxlZnQgb24gYWJzb2x1dGUgZWxlbWVudC5cclxuICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcclxuICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBldmVudC54IC0gYVZhclggKyBcInB4XCI7XHJcbiAgICAvLyB9XHJcbiAgfVxyXG5cclxuICBhZGRMaXN0ZW5lcnMoKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tb3ZlID0gbW92YWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBwYWlyQ2hlY2soKSB7XHJcbiAgdmFyIGZpbmRUaGVDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcbiAgdmFyIGZpbmRDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XHJcbiAgdmFyIGNsaWNrQ291bnRpbmcgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgb25IYW5kQXJyID0gW107XHJcbiAgdmFyIHRoZUNoZWNrQXJyID0gW107XHJcblxyXG4gIHZhciBzZXRBc0Z1bmN0aW9uVGVzdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgY2xpY2tDb3VudGluZyArPSAxO1xyXG5cclxuICAgIHRoZUNoZWNrQXJyLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuICAgIG9uSGFuZEFyci5wdXNoKGV2ZW50LnRhcmdldCk7XHJcblxyXG5cclxuICAgIGlmICh0aGVDaGVja0FyclswXSAmJiB0aGVDaGVja0FyclsxXSkge1xyXG5cclxuICAgICAgaWYgKHRoZUNoZWNrQXJyWzBdICE9PSB0aGVDaGVja0FyclsxXSkge1xyXG5cclxuICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0gJiYgb25IYW5kQXJyWzFdKSB7XHJcbiAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMl0gIT09IHVuZGVmaW5lZCAmJiBvbkhhbmRBcnJbMl0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBvbkhhbmRBcnIgPSBvbkhhbmRBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAob25IYW5kQXJyWzBdICE9PSB1bmRlZmluZWQgJiYgb25IYW5kQXJyWzFdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpZiAob25IYW5kQXJyWzBdLmNsYXNzTmFtZSA9PT0gb25IYW5kQXJyWzFdLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMF0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgb25IYW5kQXJyWzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcclxuICAgICAgICAgICAgICAvLyB9LCAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICB0aGVDaGVja0Fyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgIC8vIH0sIDEwMDEpO1xyXG5cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IHBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyWzBdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkhhbmRBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoZUNoZWNrQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIC8vIH0sIDEwMDEpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvbkhhbmRBcnIgPSBvbkhhbmRBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiWW91J3JlIHB1c2hpbmcgdGhlIHNhbWUgb3ZlciBhbmQgb3ZlciBhZ2Fpbi5cIik7XHJcbiAgICAgICAgdGhlQ2hlY2tBcnIgPSB0aGVDaGVja0Fyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgY2xpY2tDb3VudGluZyAtPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmaW5kQ291bnRlci50ZXh0Q29udGVudCA9IGNsaWNrQ291bnRpbmc7XHJcbiAgfTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFRoZUNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRUaGVDYXJkc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2V0QXNGdW5jdGlvblRlc3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYWlyID0gcGFpckNoZWNrO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcldpbmRvdygpIHtcclxuXHJcbiAgdmFyIG1vdmFibGUgPSByZXF1aXJlKFwiLi9tb3ZhYmxlXCIpO1xyXG4gIHZhciB3aW5kb3dEZXN0cm95ZXIgPSByZXF1aXJlKFwiLi93aW5kb3dEZXN0cm95ZXJcIik7XHJcbiAgdmFyIG1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeS5qc1wiKTtcclxuXHJcbiAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XHJcbiAgICB2YXIgZmluZE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaWNvbjFcIik7XHJcbiAgICBmaW5kTmF2WzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgcmVuZGVyKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5hdkNsaWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xyXG4gICAgY29uc29sZS5sb2codGVtcGxhdGUpO1xyXG4gICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xyXG5cclxuICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgbWVtb3J5LmNyZWF0ZSgpO1xyXG4gICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XHJcbiIsImZ1bmN0aW9uIHRhc2tiYXIoKSB7XHJcbiAgdmFyIGZpbmRUYXNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgZmluZFRhc2tiYXIuY2xhc3NMaXN0LmFkZChcInRhc2stYXBwZWFyXCIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcclxuIiwiZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xyXG4gIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xyXG4iXX0=
