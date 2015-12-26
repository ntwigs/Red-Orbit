(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

// var memory = require("./memory");
// memory.create();

},{"./renderWindow":9,"./taskbar":10}],2:[function(require,module,exports){
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
function chatSettings() {
  var changeButton = document.querySelectorAll(".nick-changer");
  var nameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var i = 0;

  for(i = 0; i < changeButton.length; i += 1) {
    changeButton[i].addEventListener("click", function() {
      nameField[i - 1].classList.toggle("name-field-gone");
      textContainer[i - 1].classList.toggle("text-container-after");
    });
  }
}

module.exports.change = chatSettings;

},{}],4:[function(require,module,exports){
function createChat() {

  var findSubmit = document.querySelectorAll(".submit");
  var findTextArea = document.querySelectorAll(".text-mess");
  var findNickSubmit = document.querySelectorAll(".accept-name");
  var findNickArea = document.querySelectorAll(".enter-nick");
  var textContainer = document.querySelectorAll(".text-container");
  var findNameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var enteredMessage = "";

  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
  for (var i = 0; i < findSubmit.length; i += 1) {
    findNickSubmit[i].addEventListener("click", function() {
      // *Hide after use - send to local storage  -> *Ish
      if (findNickArea[i - 1].value !== "") {
        data["username"] = findNickArea[i - 1].value;
        findNameField[i - 1].classList.add("name-field-gone");
        textContainer[i - 1].classList.add("text-container-after");
      }
    });

    findSubmit[i].addEventListener("click", function() {
        data["data"] = findTextArea[i - 1].value;
    });
  }


  var data = {
    "type": "message",
    "data" : "",
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

},{}],5:[function(require,module,exports){
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

},{"./cardCheck":2,"./loadCards":6,"./pairCheck":8}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

function renderWindow(event) {

  var movable = require("./movable");
  var windowDestroyer = require("./windowDestroyer");
  var createMemory = require("./createMemory");
  var createChat = require("./createChat");
  var chatSettings = require("./chatSettings");

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
    chatSettings.change();
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

},{"./chatSettings":3,"./createChat":4,"./createMemory":5,"./movable":7,"./windowDestroyer":11}],10:[function(require,module,exports){
function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY3JlYXRlTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9sb2FkQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21vdmFibGUuanMiLCJjbGllbnQvc291cmNlL2pzL3BhaXJDaGVjay5qcyIsImNsaWVudC9zb3VyY2UvanMvcmVuZGVyV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy90YXNrYmFyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3dEZXN0cm95ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XHJcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcclxuXHJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcclxudGFza2Jhci5icmluZ0ZvcnRoKCk7XHJcblxyXG4vLyB2YXIgbWVtb3J5ID0gcmVxdWlyZShcIi4vbWVtb3J5XCIpO1xyXG4vLyBtZW1vcnkuY3JlYXRlKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY2FyZENoZWNrKCkge1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGNhcmRBcnIgPSBbXTtcclxuXHJcblxyXG4gIHZhciBmaW5kSW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICB2YXIgZmluZEltZ0luc2lkZVdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93IGltZ1wiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjYXJkQXJyKTtcclxuICBmdW5jdGlvbiByYW5kb21pemluZygpIHtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBjYWxjdWxhdGluZ0NhcmRzLzI7IGkgKz0gMSkge1xyXG4gICAgICBjYXJkQXJyLnB1c2goaSsxKTtcclxuICAgICAgY2FyZEFyci5wdXNoKGkrMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aCwgdCwgaTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxyXG4gICAgd2hpbGUgKG0pIHtcclxuXHJcbiAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxyXG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbS0tKTtcclxuXHJcbiAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgdCA9IGNhcmRBcnJbbV07XHJcbiAgICAgIGNhcmRBcnJbbV0gPSBjYXJkQXJyW2ldO1xyXG4gICAgICBjYXJkQXJyW2ldID0gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXJkQXJyO1xyXG4gIH1cclxuXHJcbiAgdmFyIHN0b3JhZ2UgPSBbXTtcclxuICB2YXIgcmFuZG9taXplciA9IDA7XHJcbiAgdmFyIHJlbW92ZVRoZU51bWJlciA9IDA7XHJcbiAgdmFyIGFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgdGhlQ2FyZHMgPSBbXTtcclxuXHJcbiAgY29uc29sZS5sb2coXCItLS0tXCIpO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhmaW5kSW1nLmxlbmd0aC9hbGxXaW5kb3dzLmxlbmd0aCk7XHJcbiAgdmFyIGNhbGN1bGF0aW5nQ2FyZHMgPSBmaW5kSW1nLmxlbmd0aC9hbGxXaW5kb3dzLmxlbmd0aDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGZpbmRJbWdJbnNpZGVXaW5kb3cubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcbiAgICB0aGVDYXJkcyA9IHJhbmRvbWl6aW5nKCk7XHJcblxyXG4gICAgaWYgKHRoZUNhcmRzW2ldICE9PSAwKSB7XHJcbiAgICAgIHJlbW92ZVRoZU51bWJlciA9IHRoZUNhcmRzLnNwbGljZSgwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW1nW2ldLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG5cclxuICAgIGlmICghZmluZEltZ1tpXS5oYXNBdHRyaWJ1dGUoXCJjbGFzc1wiKSkge1xyXG4gICAgICBmaW5kSW1nW2ldLmNsYXNzTGlzdC5hZGQocmVtb3ZlVGhlTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW1nW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzdG9yYWdlLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgICAgIGlmIChzdG9yYWdlLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHN0b3JhZ2UubGVuZ3RoID0gMDtcclxuICAgICAgICB9LCAxMDAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHN0b3JhZ2VbMF0gPT09IHN0b3JhZ2VbMV0pIHtcclxuICAgICAgICBzdG9yYWdlID0gc3RvcmFnZS5zbGljZSgwLCAtMSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RvcmFnZS5sZW5ndGggPD0gMikge1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIikpIHtcclxuICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9cIiArIGV2ZW50LnRhcmdldC5jbGFzc05hbWUgKyBcIi5wbmdcIiApO1xyXG5cclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHN0b3JhZ2UubGVuZ3RoID0gMDtcclxuICAgICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2FyZENoZWNrO1xyXG4iLCJmdW5jdGlvbiBjaGF0U2V0dGluZ3MoKSB7XHJcbiAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmljay1jaGFuZ2VyXCIpO1xyXG4gIHZhciBuYW1lRmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZm9yKGkgPSAwOyBpIDwgY2hhbmdlQnV0dG9uLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjaGFuZ2VCdXR0b25baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBuYW1lRmllbGRbaSAtIDFdLmNsYXNzTGlzdC50b2dnbGUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgIHRleHRDb250YWluZXJbaSAtIDFdLmNsYXNzTGlzdC50b2dnbGUoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hhbmdlID0gY2hhdFNldHRpbmdzO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xyXG5cclxuICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xyXG4gIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcclxuICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xyXG4gIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZW50ZXJlZE1lc3NhZ2UgPSBcIlwiO1xyXG5cclxuICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kTmlja1N1Ym1pdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxyXG4gICAgICBpZiAoZmluZE5pY2tBcmVhW2kgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtpIC0gMV0udmFsdWU7XHJcbiAgICAgICAgZmluZE5hbWVGaWVsZFtpIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2kgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGZpbmRTdWJtaXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGRhdGFbXCJkYXRhXCJdID0gZmluZFRleHRBcmVhW2kgLSAxXS52YWx1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIHZhciBkYXRhID0ge1xyXG4gICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxyXG4gICAgXCJkYXRhXCIgOiBcIlwiLFxyXG4gICAgXCJ1c2VybmFtZVwiOiBcIlwiLFxyXG4gICAgXCJjaGFubmVsXCI6IFwiXCIsXHJcbiAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICB9O1xyXG5cclxuICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgZmluZFN1Ym1pdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgZmluZFRleHRBcmVhW2kgLSAxXS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICAvLyB2YXIgYnJUYWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlJcIik7XHJcbiAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XHJcbiAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xyXG4gICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XHJcbiAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcclxuICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xyXG4gICAgLy8gcFRhZy5hcHBlbmRDaGlsZChiclRhZyk7XHJcbiAgICBwVGFnTWVzcy5hcHBlbmRDaGlsZChjcmVhdGVUZXh0KTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ1VzZXIpO1xyXG4gICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnTWVzcyk7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Q29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGlmIChjaGF0VXNlciAhPT0gXCJcIiAmJiBjaGF0RGF0YSAhPT0gXCJcIikge1xyXG4gICAgICAgIHRleHRDb250YWluZXJbaV0uYXBwZW5kQ2hpbGQoZGl2VGFnVGV4dCk7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5zY3JvbGxUb3AgPSB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbEhlaWdodDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XHJcblxyXG4gIHZhciBsb2FkQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkQ2FyZHNcIik7XHJcbiAgbG9hZENhcmRzLmNhcmRzKDQsIDQpO1xyXG5cclxuICB2YXIgY2FyZENoZWNrID0gcmVxdWlyZShcIi4vY2FyZENoZWNrXCIpO1xyXG4gIGNhcmRDaGVjay5jaGVjaygpO1xyXG5cclxuICB2YXIgcGFpckNoZWNrID0gcmVxdWlyZShcIi4vcGFpckNoZWNrXCIpO1xyXG4gIHBhaXJDaGVjay5wYWlyKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gbG9hZENhcmRzKHJvd3MsIGNhcmRzKSB7XHJcblxyXG4gIHZhciBqID0gMDtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIC8vIHZhciBjYXJkU29ydCA9IC0xO1xyXG5cclxuICB2YXIgY3JlYXRlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgY3JlYXRlQ2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZFwiKTtcclxuICB2YXIgZmluZENhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcm93czsgaSArPSAxKSB7XHJcbiAgICB2YXIgY2FyZFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICBjYXJkUm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgY2FyZHM7IGogKz0gMSkge1xyXG4gICAgICB2YXIgY3JlYXRlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJBXCIpO1xyXG4gICAgICBjcmVhdGVDYXJkLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICB2YXIgY3JlYXRlSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIklNR1wiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZFwiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5hcHBlbmRDaGlsZChjcmVhdGVJbWcpO1xyXG4gICAgICBjYXJkUm93LmFwcGVuZENoaWxkKGNyZWF0ZUNhcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoayA9IDA7IGsgPCBmaW5kQ2FyZENvbnRhaW5lci5sZW5ndGg7IGsgKz0gMSkge1xyXG4gICAgICBmaW5kQ2FyZENvbnRhaW5lcltrXS5hcHBlbmRDaGlsZChjYXJkUm93KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB2YXIgZmluZEFsbENhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuXHJcbi8vRm9yIGxhdGVyIHVzZVxyXG4gIC8vIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoICUgMiAhPT0gMCkge1xyXG4gIC8vICAgdGhyb3cgbmV3IEVycm9yKFwibm9cIik7XHJcbiAgLy8gfSBlbHNlIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoID4gMTYpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55XCIpO1xyXG4gIC8vIH0gZWxzZSBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCA8IDQpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBmZXdcIik7XHJcbiAgLy8gfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2FyZHMgPSBsb2FkQ2FyZHM7XHJcbiIsImZ1bmN0aW9uIG1vdmFibGUoKSB7XHJcblxyXG5cclxuICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGZpbmRXaW5kb3dzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZVVwKGV2ZW50KSB7XHJcbiAgICAgIC8vV2hlbiByZWxlYXNpbmcgbW91c2UuXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgICAvLyBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjk5OFwiO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgLy9TYXZpbmcgY29vcmRpbmF0ZXMgb24gY2xpY2suXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJ0b3BcIikge1xyXG4gICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XHJcbiAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcclxuICAgICAgc2F2ZVRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuXHJcbiAgICAgIC8vUnVucyBtb3VzZW1vdmUgLSBpZiBkcmFnZ2luZyBvbiB0aGUgcmlnaHQgcGxhY2VcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcclxuICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xyXG5cclxuICB9XHJcblxyXG4gIGFkZExpc3RlbmVycygpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLm1vdmUgPSBtb3ZhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHBhaXJDaGVjaygpIHtcclxuICB2YXIgZmluZFRoZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICB2YXIgZmluZENvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcclxuICB2YXIgY2xpY2tDb3VudGluZyA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBvbkhhbmRBcnIgPSBbXTtcclxuICB2YXIgdGhlQ2hlY2tBcnIgPSBbXTtcclxuXHJcbiAgdmFyIHNldEFzRnVuY3Rpb25UZXN0ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICBjbGlja0NvdW50aW5nICs9IDE7XHJcblxyXG4gICAgdGhlQ2hlY2tBcnIucHVzaChldmVudC50YXJnZXQpO1xyXG4gICAgb25IYW5kQXJyLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuXHJcblxyXG4gICAgaWYgKHRoZUNoZWNrQXJyWzBdICYmIHRoZUNoZWNrQXJyWzFdKSB7XHJcblxyXG4gICAgICBpZiAodGhlQ2hlY2tBcnJbMF0gIT09IHRoZUNoZWNrQXJyWzFdKSB7XHJcblxyXG4gICAgICAgICAgaWYgKG9uSGFuZEFyclswXSAmJiBvbkhhbmRBcnJbMV0pIHtcclxuICAgICAgICAgICAgaWYgKG9uSGFuZEFyclsyXSAhPT0gdW5kZWZpbmVkICYmIG9uSGFuZEFyclsyXSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIG9uSGFuZEFyciA9IG9uSGFuZEFyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0gIT09IHVuZGVmaW5lZCAmJiBvbkhhbmRBcnJbMV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0uY2xhc3NOYW1lID09PSBvbkhhbmRBcnJbMV0uY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG9uSGFuZEFyclswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICAgIC8vIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIHRoZUNoZWNrQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgLy8gfSwgMTAwMSk7XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgcGFpclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMF0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyclsxXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG9uSGFuZEFyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhlQ2hlY2tBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgLy8gfSwgMTAwMSk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9uSGFuZEFyciA9IG9uSGFuZEFyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJZb3UncmUgcHVzaGluZyB0aGUgc2FtZSBvdmVyIGFuZCBvdmVyIGFnYWluLlwiKTtcclxuICAgICAgICB0aGVDaGVja0FyciA9IHRoZUNoZWNrQXJyLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBjbGlja0NvdW50aW5nIC09IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZpbmRDb3VudGVyLnRleHRDb250ZW50ID0gY2xpY2tDb3VudGluZztcclxuICB9O1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kVGhlQ2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgZmluZFRoZUNhcmRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZXRBc0Z1bmN0aW9uVGVzdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnBhaXIgPSBwYWlyQ2hlY2s7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyV2luZG93KGV2ZW50KSB7XHJcblxyXG4gIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcclxuICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xyXG4gIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9jcmVhdGVNZW1vcnlcIik7XHJcbiAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jcmVhdGVDaGF0XCIpO1xyXG4gIHZhciBjaGF0U2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jaGF0U2V0dGluZ3NcIik7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgbnVtYmVyID0gXCJcIjtcclxuXHJcbiAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XHJcbiAgICB2YXIgZmluZE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaWNvbjFcIik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcbiAgICBmaW5kTmF2W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzBdKSB7XHJcbiAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzFdKSB7XHJcbiAgICAgICAgcmVuZGVyTWVtKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5hdkNsaWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcclxuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcbiAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRBbGxXaW5kb3dzW2ldLmNsYXNzTGlzdC5hZGQoXCJ3aW5kb3ctXCIgKyBpKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDaGF0LmNoYXQoKTtcclxuICAgIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcclxuICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXJNZW0oKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xyXG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xyXG4gICAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgZmluZEFsbFdpbmRvd3NbaV0uY2xhc3NMaXN0LmFkZChcIndpbmRvdy1cIiArIGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XHJcbiAgICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xyXG4gIH1cclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XHJcbiIsImZ1bmN0aW9uIHRhc2tiYXIoKSB7XHJcbiAgdmFyIGZpbmRUYXNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgZmluZFRhc2tiYXIuY2xhc3NMaXN0LmFkZChcInRhc2stYXBwZWFyXCIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcclxuIiwiZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xyXG4gIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xyXG4iXX0=
