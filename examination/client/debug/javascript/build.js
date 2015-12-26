(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

// var memory = require("./memory");
// memory.create();

},{"./renderWindow":8,"./taskbar":9}],2:[function(require,module,exports){
"use strict";

function cardCheck() {

  var i = 0;
  var cardArr = [];


  var findImg = document.querySelectorAll("img");
  var findImgInsideWindow = document.querySelectorAll(".window img");

    console.log(cardArr);
  function randomizing() {
    for (i = 0; i < calculatingCards/2; i += 1) {
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
    return cardArr;
  }

  var storage = [];
  var randomizer = 0;
  var removeTheNumber = 0;
  var allWindows = document.querySelectorAll(".window");
  var theCards = [];

  console.log("----");

  // console.log(findImg.length/allWindows.length);
  var calculatingCards = findImg.length/allWindows.length;

  for (i = 0; i < findImgInsideWindow.length; i += 1) {

    theCards = randomizing();

    if (theCards[i] !== 0) {
      removeTheNumber = theCards.splice(0, 1);
    }

    findImg[i].setAttribute("src", "image/0.png");

    if (!findImg[i].hasAttribute("class")) {
      findImg[i].classList.add(removeTheNumber);
    }

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
function createChat() {

  var findSubmit = document.querySelectorAll(".submit");
  var findTextArea = document.querySelectorAll(".text-mess");
  var findNickSubmit = document.querySelectorAll(".accept-name");
  var findNickArea = document.querySelectorAll(".enter-nick");
  var textContainer = document.querySelectorAll(".text-container");
  var enteredMessage = "";
  var theMessage = "";


  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
  for (var i = 0; i < findSubmit.length; i += 1) {
    findTextArea[i].addEventListener("click", function() {
      //Hide after use - send to local storage
      data["username"] = findNickArea[i - 1].value;
    });


    findSubmit[i].addEventListener("click", function() {
        data["data"] = findTextArea[i - 1].value;
    });
  }


  var data = {
    "type": "message",
    "data" : theMessage,
    "username": "",
    "channel": "",
    "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
  };

  socket.addEventListener("open", function (event) {
    for (var i = 0; i < findSubmit.length; i += 1) {
      findSubmit[i].addEventListener("click", function(event) {
        socket.send(JSON.stringify(data));
        findTextArea[i - 1].value = "";
        event.preventDefault();
      });
    }
  });

  socket.addEventListener("message", function (event) {
    var pTagUser = document.createElement("P");
    var pTagMess = document.createElement("P");
    var divTagText = document.createElement("DIV");
    // var brTag = document.createElement("BR");
    var chatData = JSON.parse(event.data).data;
    var chatUser = JSON.parse(event.data).username;
    var createText = document.createTextNode(chatData);
    var createUser = document.createTextNode(chatUser);
    pTagUser.appendChild(createUser);
    // pTag.appendChild(brTag);
    pTagMess.appendChild(createText);
    divTagText.appendChild(pTagUser);
    divTagText.appendChild(pTagMess);

    for (var i = 0; i < textContainer.length; i += 1) {
      if (chatUser !== "" && chatData !== "") {
        textContainer[i].appendChild(divTagText);
        textContainer[i].scrollTop = textContainer[i].scrollHeight;
      }
    }


  });


}

module.exports.chat = createChat;

},{}],4:[function(require,module,exports){
"use strict";

function createMemory() {

  var loadCards = require("./loadCards");
  loadCards.cards(4, 4);

  var cardCheck = require("./cardCheck");
  cardCheck.check();

  var pairCheck = require("./pairCheck");
  pairCheck.pair();

}

module.exports.create = createMemory;

},{"./cardCheck":2,"./loadCards":5,"./pairCheck":7}],5:[function(require,module,exports){
"use strict";

function loadCards(rows, cards) {

  var j = 0;
  var i = 0;
  var k = 0;
  // var cardSort = -1;

  var createCard = document.createElement("DIV");
  createCard.classList.add("card");
  var findCardContainer = document.querySelectorAll(".card-container");

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
    }

    for (k = 0; k < findCardContainer.length; k += 1) {
      findCardContainer[k].appendChild(cardRow);
    }

  }

  var findAllCards = document.querySelectorAll(".card");


//For later use
  // if (findAllCards.length % 2 !== 0) {
  //   throw new Error("no");
  // } else if (findAllCards.length > 16) {
  //   throw new Error("Too many");
  // } else if (findAllCards.length < 4) {
  //   throw new Error("Too few");
  // }

}

module.exports.cards = loadCards;

},{}],6:[function(require,module,exports){
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

  function mouseUp(event) {
      //When releasing mouse.
      window.removeEventListener("mousemove", divMove, true);
      // event.target.parentElement.style.zIndex = "998";
  }

  function mouseDown(event) {

    //Saving coordinates on click.
    if (event.target.className === "top") {
      aVarY = event.offsetY;
      aVarX = event.offsetX;
      saveTarget = event.target;

      //Runs mousemove - if dragging on the right place
      window.addEventListener("mousemove", divMove, true);
    }
  }

  function divMove(event) {

    saveTarget.parentElement.style.top = event.y - aVarY + "px";
    saveTarget.parentElement.style.left = event.x - aVarX + "px";

  }

  addListeners();

};

module.exports.move = movable;

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";

function renderWindow(event) {

  var movable = require("./movable");
  var windowDestroyer = require("./windowDestroyer");
  var createMemory = require("./createMemory");
  var createChat = require("./createChat");

  var i = 0;
  var number = "";

  function navClick() {
    var findNav = document.querySelectorAll(".icon1");
    for (var i = 0; i < findNav.length; i += 1) {

    findNav[i].addEventListener("click", function(event) {
      if (event.target === findNav[0]) {
        render();
      } else if (event.target === findNav[1]) {
        renderMem();
      }
    });

    }
  }

  navClick();

  function render() {
    var template = document.querySelector("#chat-template");
    var clone = document.importNode(template.content, true);
    var beforeThis = document.querySelector(".wrapper-hero");
    document.querySelector("body").insertBefore(clone, beforeThis);
    var findAllWindows = document.querySelectorAll(".window");
    for (i = 0; i < findAllWindows.length; i += 1) {
      findAllWindows[i].classList.add("window-" + i);
    }

    createChat.chat();
        movable.move();
        windowDestroyer.destroy();

  }

  function renderMem() {
      var template = document.querySelector("#window-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);
      var findAllWindows = document.querySelectorAll(".window");
      for (i = 0; i < findAllWindows.length; i += 1) {
        findAllWindows[i].classList.add("window-" + i);
      }

      createMemory.create();
          movable.move();
          windowDestroyer.destroy();
  }


  }


module.exports.render = renderWindow;

},{"./createChat":3,"./createMemory":4,"./movable":6,"./windowDestroyer":10}],9:[function(require,module,exports){
function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],10:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NyZWF0ZUNoYXQuanMiLCJjbGllbnQvc291cmNlL2pzL2NyZWF0ZU1lbW9yeS5qcyIsImNsaWVudC9zb3VyY2UvanMvbG9hZENhcmRzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wYWlyQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL3JlbmRlcldpbmRvdy5qcyIsImNsaWVudC9zb3VyY2UvanMvdGFza2Jhci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93RGVzdHJveWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcclxucmVuZGVyV2luZG93LnJlbmRlcigpO1xyXG5cclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xyXG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcclxuXHJcbi8vIHZhciBtZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnlcIik7XHJcbi8vIG1lbW9yeS5jcmVhdGUoKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjYXJkQ2hlY2soKSB7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY2FyZEFyciA9IFtdO1xyXG5cclxuXHJcbiAgdmFyIGZpbmRJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xyXG4gIHZhciBmaW5kSW1nSW5zaWRlV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3cgaW1nXCIpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGNhcmRBcnIpO1xyXG4gIGZ1bmN0aW9uIHJhbmRvbWl6aW5nKCkge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNhbGN1bGF0aW5nQ2FyZHMvMjsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRBcnIucHVzaChpKzEpO1xyXG4gICAgICBjYXJkQXJyLnB1c2goaSsxKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbSA9IGNhcmRBcnIubGVuZ3RoLCB0LCBpO1xyXG5cclxuICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXHJcbiAgICB3aGlsZSAobSkge1xyXG5cclxuICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW504oCmXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtLS0pO1xyXG5cclxuICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICB0ID0gY2FyZEFyclttXTtcclxuICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XHJcbiAgICAgIGNhcmRBcnJbaV0gPSB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhcmRBcnI7XHJcbiAgfVxyXG5cclxuICB2YXIgc3RvcmFnZSA9IFtdO1xyXG4gIHZhciByYW5kb21pemVyID0gMDtcclxuICB2YXIgcmVtb3ZlVGhlTnVtYmVyID0gMDtcclxuICB2YXIgYWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gIHZhciB0aGVDYXJkcyA9IFtdO1xyXG5cclxuICBjb25zb2xlLmxvZyhcIi0tLS1cIik7XHJcblxyXG4gIC8vIGNvbnNvbGUubG9nKGZpbmRJbWcubGVuZ3RoL2FsbFdpbmRvd3MubGVuZ3RoKTtcclxuICB2YXIgY2FsY3VsYXRpbmdDYXJkcyA9IGZpbmRJbWcubGVuZ3RoL2FsbFdpbmRvd3MubGVuZ3RoO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgZmluZEltZ0luc2lkZVdpbmRvdy5sZW5ndGg7IGkgKz0gMSkge1xyXG5cclxuICAgIHRoZUNhcmRzID0gcmFuZG9taXppbmcoKTtcclxuXHJcbiAgICBpZiAodGhlQ2FyZHNbaV0gIT09IDApIHtcclxuICAgICAgcmVtb3ZlVGhlTnVtYmVyID0gdGhlQ2FyZHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbWdbaV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcblxyXG4gICAgaWYgKCFmaW5kSW1nW2ldLmhhc0F0dHJpYnV0ZShcImNsYXNzXCIpKSB7XHJcbiAgICAgIGZpbmRJbWdbaV0uY2xhc3NMaXN0LmFkZChyZW1vdmVUaGVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbWdbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHN0b3JhZ2UucHVzaChldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgaWYgKHN0b3JhZ2UubGVuZ3RoID4gMikge1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc3RvcmFnZS5sZW5ndGggPSAwO1xyXG4gICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3RvcmFnZVswXSA9PT0gc3RvcmFnZVsxXSkge1xyXG4gICAgICAgIHN0b3JhZ2UgPSBzdG9yYWdlLnNsaWNlKDAsIC0xKTtcclxuICAgICAgfSBlbHNlIGlmIChzdG9yYWdlLmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKSkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSArIFwiLnBuZ1wiICk7XHJcblxyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3RvcmFnZS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjYXJkQ2hlY2s7XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZUNoYXQoKSB7XHJcblxyXG4gIHZhciBmaW5kU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWJtaXRcIik7XHJcbiAgdmFyIGZpbmRUZXh0QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1tZXNzXCIpO1xyXG4gIHZhciBmaW5kTmlja1N1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWNjZXB0LW5hbWVcIik7XHJcbiAgdmFyIGZpbmROaWNrQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcclxuICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XHJcbiAgdmFyIGVudGVyZWRNZXNzYWdlID0gXCJcIjtcclxuICB2YXIgdGhlTWVzc2FnZSA9IFwiXCI7XHJcblxyXG5cclxuICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kVGV4dEFyZWFbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAvL0hpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlXHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtpIC0gMV0udmFsdWU7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZmluZFN1Ym1pdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgZGF0YVtcImRhdGFcIl0gPSBmaW5kVGV4dEFyZWFbaSAtIDFdLnZhbHVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXHJcbiAgICBcImRhdGFcIiA6IHRoZU1lc3NhZ2UsXHJcbiAgICBcInVzZXJuYW1lXCI6IFwiXCIsXHJcbiAgICBcImNoYW5uZWxcIjogXCJcIixcclxuICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxyXG4gIH07XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBmaW5kU3VibWl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICBmaW5kVGV4dEFyZWFbaSAtIDFdLnZhbHVlID0gXCJcIjtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIHBUYWdVc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgcFRhZ01lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcclxuICAgIHZhciBkaXZUYWdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcclxuICAgIC8vIHZhciBiclRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCUlwiKTtcclxuICAgIHZhciBjaGF0RGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGF0YTtcclxuICAgIHZhciBjaGF0VXNlciA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkudXNlcm5hbWU7XHJcbiAgICB2YXIgY3JlYXRlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXREYXRhKTtcclxuICAgIHZhciBjcmVhdGVVc2VyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdFVzZXIpO1xyXG4gICAgcFRhZ1VzZXIuYXBwZW5kQ2hpbGQoY3JlYXRlVXNlcik7XHJcbiAgICAvLyBwVGFnLmFwcGVuZENoaWxkKGJyVGFnKTtcclxuICAgIHBUYWdNZXNzLmFwcGVuZENoaWxkKGNyZWF0ZVRleHQpO1xyXG4gICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnVXNlcik7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgaWYgKGNoYXRVc2VyICE9PSBcIlwiICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5hcHBlbmRDaGlsZChkaXZUYWdUZXh0KTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbFRvcCA9IHRleHRDb250YWluZXJbaV0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICB9KTtcclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XHJcblxyXG4gIHZhciBsb2FkQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkQ2FyZHNcIik7XHJcbiAgbG9hZENhcmRzLmNhcmRzKDQsIDQpO1xyXG5cclxuICB2YXIgY2FyZENoZWNrID0gcmVxdWlyZShcIi4vY2FyZENoZWNrXCIpO1xyXG4gIGNhcmRDaGVjay5jaGVjaygpO1xyXG5cclxuICB2YXIgcGFpckNoZWNrID0gcmVxdWlyZShcIi4vcGFpckNoZWNrXCIpO1xyXG4gIHBhaXJDaGVjay5wYWlyKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gbG9hZENhcmRzKHJvd3MsIGNhcmRzKSB7XHJcblxyXG4gIHZhciBqID0gMDtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIC8vIHZhciBjYXJkU29ydCA9IC0xO1xyXG5cclxuICB2YXIgY3JlYXRlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgY3JlYXRlQ2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZFwiKTtcclxuICB2YXIgZmluZENhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcm93czsgaSArPSAxKSB7XHJcbiAgICB2YXIgY2FyZFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICBjYXJkUm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgY2FyZHM7IGogKz0gMSkge1xyXG4gICAgICB2YXIgY3JlYXRlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJBXCIpO1xyXG4gICAgICBjcmVhdGVDYXJkLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICB2YXIgY3JlYXRlSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIklNR1wiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZFwiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5hcHBlbmRDaGlsZChjcmVhdGVJbWcpO1xyXG4gICAgICBjYXJkUm93LmFwcGVuZENoaWxkKGNyZWF0ZUNhcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoayA9IDA7IGsgPCBmaW5kQ2FyZENvbnRhaW5lci5sZW5ndGg7IGsgKz0gMSkge1xyXG4gICAgICBmaW5kQ2FyZENvbnRhaW5lcltrXS5hcHBlbmRDaGlsZChjYXJkUm93KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB2YXIgZmluZEFsbENhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuXHJcbi8vRm9yIGxhdGVyIHVzZVxyXG4gIC8vIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoICUgMiAhPT0gMCkge1xyXG4gIC8vICAgdGhyb3cgbmV3IEVycm9yKFwibm9cIik7XHJcbiAgLy8gfSBlbHNlIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoID4gMTYpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55XCIpO1xyXG4gIC8vIH0gZWxzZSBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCA8IDQpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBmZXdcIik7XHJcbiAgLy8gfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2FyZHMgPSBsb2FkQ2FyZHM7XHJcbiIsImZ1bmN0aW9uIG1vdmFibGUoKSB7XHJcblxyXG5cclxuICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGZpbmRXaW5kb3dzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZVVwKGV2ZW50KSB7XHJcbiAgICAgIC8vV2hlbiByZWxlYXNpbmcgbW91c2UuXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgICAvLyBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjk5OFwiO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgLy9TYXZpbmcgY29vcmRpbmF0ZXMgb24gY2xpY2suXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJ0b3BcIikge1xyXG4gICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XHJcbiAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcclxuICAgICAgc2F2ZVRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuXHJcbiAgICAgIC8vUnVucyBtb3VzZW1vdmUgLSBpZiBkcmFnZ2luZyBvbiB0aGUgcmlnaHQgcGxhY2VcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcclxuICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xyXG5cclxuICB9XHJcblxyXG4gIGFkZExpc3RlbmVycygpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLm1vdmUgPSBtb3ZhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHBhaXJDaGVjaygpIHtcclxuICB2YXIgZmluZFRoZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICB2YXIgZmluZENvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcclxuICB2YXIgY2xpY2tDb3VudGluZyA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBvbkhhbmRBcnIgPSBbXTtcclxuICB2YXIgdGhlQ2hlY2tBcnIgPSBbXTtcclxuXHJcbiAgdmFyIHNldEFzRnVuY3Rpb25UZXN0ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICBjbGlja0NvdW50aW5nICs9IDE7XHJcblxyXG4gICAgdGhlQ2hlY2tBcnIucHVzaChldmVudC50YXJnZXQpO1xyXG4gICAgb25IYW5kQXJyLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuXHJcblxyXG4gICAgaWYgKHRoZUNoZWNrQXJyWzBdICYmIHRoZUNoZWNrQXJyWzFdKSB7XHJcblxyXG4gICAgICBpZiAodGhlQ2hlY2tBcnJbMF0gIT09IHRoZUNoZWNrQXJyWzFdKSB7XHJcblxyXG4gICAgICAgICAgaWYgKG9uSGFuZEFyclswXSAmJiBvbkhhbmRBcnJbMV0pIHtcclxuICAgICAgICAgICAgaWYgKG9uSGFuZEFyclsyXSAhPT0gdW5kZWZpbmVkICYmIG9uSGFuZEFyclsyXSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIG9uSGFuZEFyciA9IG9uSGFuZEFyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0gIT09IHVuZGVmaW5lZCAmJiBvbkhhbmRBcnJbMV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0uY2xhc3NOYW1lID09PSBvbkhhbmRBcnJbMV0uY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG9uSGFuZEFyclswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICAgIC8vIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIHRoZUNoZWNrQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgLy8gfSwgMTAwMSk7XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgcGFpclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMF0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyclsxXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG9uSGFuZEFyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhlQ2hlY2tBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgLy8gfSwgMTAwMSk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9uSGFuZEFyciA9IG9uSGFuZEFyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJZb3UncmUgcHVzaGluZyB0aGUgc2FtZSBvdmVyIGFuZCBvdmVyIGFnYWluLlwiKTtcclxuICAgICAgICB0aGVDaGVja0FyciA9IHRoZUNoZWNrQXJyLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBjbGlja0NvdW50aW5nIC09IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZpbmRDb3VudGVyLnRleHRDb250ZW50ID0gY2xpY2tDb3VudGluZztcclxuICB9O1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kVGhlQ2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgZmluZFRoZUNhcmRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZXRBc0Z1bmN0aW9uVGVzdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnBhaXIgPSBwYWlyQ2hlY2s7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyV2luZG93KGV2ZW50KSB7XHJcblxyXG4gIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcclxuICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xyXG4gIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9jcmVhdGVNZW1vcnlcIik7XHJcbiAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jcmVhdGVDaGF0XCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG51bWJlciA9IFwiXCI7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xyXG4gICAgdmFyIGZpbmROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmljb24xXCIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsxXSkge1xyXG4gICAgICAgIHJlbmRlck1lbSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcbiAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBmaW5kQWxsV2luZG93c1tpXS5jbGFzc0xpc3QuYWRkKFwid2luZG93LVwiICsgaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ2hhdC5jaGF0KCk7XHJcbiAgICAgICAgbW92YWJsZS5tb3ZlKCk7XHJcbiAgICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXJNZW0oKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xyXG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xyXG4gICAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgZmluZEFsbFdpbmRvd3NbaV0uY2xhc3NMaXN0LmFkZChcIndpbmRvdy1cIiArIGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XHJcbiAgICAgICAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgICAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlciA9IHJlbmRlcldpbmRvdztcclxuIiwiZnVuY3Rpb24gdGFza2JhcigpIHtcclxuICB2YXIgZmluZFRhc2tiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmJyaW5nRm9ydGggPSB0YXNrYmFyO1xyXG4iLCJmdW5jdGlvbiB3aW5kb3dEZXN0cm95ZXIoKSB7XHJcbiAgdmFyIGZpbmRFeGl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leGl0XCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZEV4aXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGZpbmRFeGl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSB3aW5kb3dEZXN0cm95ZXI7XHJcbiJdfQ==
