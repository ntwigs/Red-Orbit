(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

// var memory = require("./memory");
// memory.create();

},{"./renderWindow":10,"./taskbar":11}],2:[function(require,module,exports){
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
function chatSettings(event) {
  var changeButton = document.querySelectorAll(".nick-changer");
  var nameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var brawski = 0;
  var j = 0;
  var newArr = [];

  for (j = 0; j < changeButton.length; j += 1) {
    brawski++;
  }

  console.log(brawski);


  function findAndSet(event) {
    console.log("hey");

      if (event.target.parentElement.parentElement.children[1].classList.contains("name-field-gone")) {
        event.target.parentElement.parentElement.children[1].classList.remove("name-field-gone");
        event.target.parentElement.parentElement.children[2].classList.remove("text-container-after");
      } else {
        event.target.parentElement.parentElement.children[1].classList.add("name-field-gone");
        event.target.parentElement.parentElement.children[2].classList.add("text-container-after");
      }

  }


  changeButton[brawski - 1].addEventListener("click", findAndSet);

  // for(i = 0; i < changeButton.length; i += 1) {
  //     changeButton[i].addEventListener("click", findAndSet, true);
  // }

}

module.exports.change = chatSettings;

},{}],4:[function(require,module,exports){
function checkNick() {

  var nickInput = document.querySelectorAll(".name-field");
  var changeButton = document.querySelectorAll(".name-field");

  var i = 0;
  var nickname = "";

  if (localStorage.getItem("nickname") !== null) {
    nickname = localStorage.getItem("nickname");
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.add("name-field-gone");
    }

  } else {
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.remove("name-field-gone");
    }
  }

}

module.exports.check = checkNick;

},{}],5:[function(require,module,exports){
function createChat() {

  var findSubmit = document.querySelectorAll(".submit");
  var findTextArea = document.querySelectorAll(".text-mess");
  var findNickSubmit = document.querySelectorAll(".accept-name");
  var findNickArea = document.querySelectorAll(".enter-nick");
  var textContainer = document.querySelectorAll(".text-container");
  var findNameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var enteredMessage = "";
  var checkNick = require("./checkNick");
  var chatSettings = require("./chatSettings");

  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
  chatSettings.change();
  for (var i = 0; i < findSubmit.length; i += 1) {
    checkNick.check();
    findNickSubmit[i].addEventListener("click", function() {
      // *Hide after use - send to local storage  -> *Ish
      if (findNickArea[i - 1].value !== "") {
        data["username"] = findNickArea[i - 1].value;
        localStorage.setItem("nickname", findNickArea[i - 1].value);
        for (var j = 0; j < textContainer.length; j += 1) {
          //test
          findNameField[j].classList.add("name-field-gone");
          textContainer[j].classList.add("text-container-after");
        }
      }
    });

    findSubmit[i].addEventListener("click", function() {
      if (localStorage.nickname !== "") {
        data["username"] = localStorage.getItem("nickname");
        data["data"] = findTextArea[i - 1].value;
      }
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
    var chatData = JSON.parse(event.data).data;
    var chatUser = JSON.parse(event.data).username;
    var createText = document.createTextNode(chatData);
    var createUser = document.createTextNode(chatUser);
    pTagUser.appendChild(createUser);
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

},{"./chatSettings":3,"./checkNick":4}],6:[function(require,module,exports){
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

},{"./cardCheck":2,"./loadCards":7,"./pairCheck":9}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
    // for (i = 0; i < findAllWindows.length; i += 1) {
    //   findAllWindows[i].classList.add("window-" + i);
    // }

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

},{"./createChat":5,"./createMemory":6,"./movable":8,"./windowDestroyer":12}],11:[function(require,module,exports){
function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hlY2tOaWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2xvYWRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbW92YWJsZS5qcyIsImNsaWVudC9zb3VyY2UvanMvcGFpckNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcclxucmVuZGVyV2luZG93LnJlbmRlcigpO1xyXG5cclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xyXG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcclxuXHJcbi8vIHZhciBtZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnlcIik7XHJcbi8vIG1lbW9yeS5jcmVhdGUoKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjYXJkQ2hlY2soKSB7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY2FyZEFyciA9IFtdO1xyXG5cclxuXHJcbiAgdmFyIGZpbmRJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xyXG4gIHZhciBmaW5kSW1nSW5zaWRlV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3cgaW1nXCIpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGNhcmRBcnIpO1xyXG4gIGZ1bmN0aW9uIHJhbmRvbWl6aW5nKCkge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNhbGN1bGF0aW5nQ2FyZHMvMjsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRBcnIucHVzaChpKzEpO1xyXG4gICAgICBjYXJkQXJyLnB1c2goaSsxKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbSA9IGNhcmRBcnIubGVuZ3RoLCB0LCBpO1xyXG5cclxuICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXHJcbiAgICB3aGlsZSAobSkge1xyXG5cclxuICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW504oCmXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtLS0pO1xyXG5cclxuICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICB0ID0gY2FyZEFyclttXTtcclxuICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XHJcbiAgICAgIGNhcmRBcnJbaV0gPSB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhcmRBcnI7XHJcbiAgfVxyXG5cclxuICB2YXIgc3RvcmFnZSA9IFtdO1xyXG4gIHZhciByYW5kb21pemVyID0gMDtcclxuICB2YXIgcmVtb3ZlVGhlTnVtYmVyID0gMDtcclxuICB2YXIgYWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gIHZhciB0aGVDYXJkcyA9IFtdO1xyXG5cclxuICBjb25zb2xlLmxvZyhcIi0tLS1cIik7XHJcblxyXG4gIC8vIGNvbnNvbGUubG9nKGZpbmRJbWcubGVuZ3RoL2FsbFdpbmRvd3MubGVuZ3RoKTtcclxuICB2YXIgY2FsY3VsYXRpbmdDYXJkcyA9IGZpbmRJbWcubGVuZ3RoL2FsbFdpbmRvd3MubGVuZ3RoO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgZmluZEltZ0luc2lkZVdpbmRvdy5sZW5ndGg7IGkgKz0gMSkge1xyXG5cclxuICAgIHRoZUNhcmRzID0gcmFuZG9taXppbmcoKTtcclxuXHJcbiAgICBpZiAodGhlQ2FyZHNbaV0gIT09IDApIHtcclxuICAgICAgcmVtb3ZlVGhlTnVtYmVyID0gdGhlQ2FyZHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbWdbaV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcblxyXG4gICAgaWYgKCFmaW5kSW1nW2ldLmhhc0F0dHJpYnV0ZShcImNsYXNzXCIpKSB7XHJcbiAgICAgIGZpbmRJbWdbaV0uY2xhc3NMaXN0LmFkZChyZW1vdmVUaGVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbWdbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHN0b3JhZ2UucHVzaChldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgaWYgKHN0b3JhZ2UubGVuZ3RoID4gMikge1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc3RvcmFnZS5sZW5ndGggPSAwO1xyXG4gICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3RvcmFnZVswXSA9PT0gc3RvcmFnZVsxXSkge1xyXG4gICAgICAgIHN0b3JhZ2UgPSBzdG9yYWdlLnNsaWNlKDAsIC0xKTtcclxuICAgICAgfSBlbHNlIGlmIChzdG9yYWdlLmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKSkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSArIFwiLnBuZ1wiICk7XHJcblxyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3RvcmFnZS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjYXJkQ2hlY2s7XHJcbiIsImZ1bmN0aW9uIGNoYXRTZXR0aW5ncyhldmVudCkge1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5pY2stY2hhbmdlclwiKTtcclxuICB2YXIgbmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgYnJhd3NraSA9IDA7XHJcbiAgdmFyIGogPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuXHJcbiAgZm9yIChqID0gMDsgaiA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgYnJhd3NraSsrO1xyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2coYnJhd3NraSk7XHJcblxyXG5cclxuICBmdW5jdGlvbiBmaW5kQW5kU2V0KGV2ZW50KSB7XHJcbiAgICBjb25zb2xlLmxvZyhcImhleVwiKTtcclxuXHJcbiAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcIm5hbWUtZmllbGQtZ29uZVwiKSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbiAgY2hhbmdlQnV0dG9uW2JyYXdza2kgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XHJcblxyXG4gIC8vIGZvcihpID0gMDsgaSA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGkgKz0gMSkge1xyXG4gIC8vICAgICBjaGFuZ2VCdXR0b25baV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZpbmRBbmRTZXQsIHRydWUpO1xyXG4gIC8vIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IGNoYXRTZXR0aW5ncztcclxuIiwiZnVuY3Rpb24gY2hlY2tOaWNrKCkge1xyXG5cclxuICB2YXIgbmlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgbmlja25hbWUgPSBcIlwiO1xyXG5cclxuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xyXG4gICAgbmlja25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xyXG4gICAgZm9yIChpID0gMDsgaSA8IG5pY2tJbnB1dC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBuaWNrSW5wdXRbaV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgIH1cclxuXHJcbiAgfSBlbHNlIHtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgbmlja0lucHV0W2ldLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja05pY2s7XHJcbiIsImZ1bmN0aW9uIGNyZWF0ZUNoYXQoKSB7XHJcblxyXG4gIHZhciBmaW5kU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWJtaXRcIik7XHJcbiAgdmFyIGZpbmRUZXh0QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1tZXNzXCIpO1xyXG4gIHZhciBmaW5kTmlja1N1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWNjZXB0LW5hbWVcIik7XHJcbiAgdmFyIGZpbmROaWNrQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcclxuICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XHJcbiAgdmFyIGZpbmROYW1lRmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBlbnRlcmVkTWVzc2FnZSA9IFwiXCI7XHJcbiAgdmFyIGNoZWNrTmljayA9IHJlcXVpcmUoXCIuL2NoZWNrTmlja1wiKTtcclxuICB2YXIgY2hhdFNldHRpbmdzID0gcmVxdWlyZShcIi4vY2hhdFNldHRpbmdzXCIpO1xyXG5cclxuICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XHJcbiAgY2hhdFNldHRpbmdzLmNoYW5nZSgpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY2hlY2tOaWNrLmNoZWNrKCk7XHJcbiAgICBmaW5kTmlja1N1Ym1pdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxyXG4gICAgICBpZiAoZmluZE5pY2tBcmVhW2kgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtpIC0gMV0udmFsdWU7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbaSAtIDFdLnZhbHVlKTtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRleHRDb250YWluZXIubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAgIC8vdGVzdFxyXG4gICAgICAgICAgZmluZE5hbWVGaWVsZFtqXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgICAgdGV4dENvbnRhaW5lcltqXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmaW5kU3VibWl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICAgICAgZGF0YVtcImRhdGFcIl0gPSBmaW5kVGV4dEFyZWFbaSAtIDFdLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZhciBkYXRhID0ge1xyXG4gICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxyXG4gICAgXCJkYXRhXCIgOiBcIlwiLFxyXG4gICAgXCJ1c2VybmFtZVwiOiBcIlwiLFxyXG4gICAgXCJjaGFubmVsXCI6IFwiXCIsXHJcbiAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCJcclxuICB9O1xyXG5cclxuICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgZmluZFN1Ym1pdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcbiAgICAgICAgZmluZFRleHRBcmVhW2kgLSAxXS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XHJcbiAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xyXG4gICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XHJcbiAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcclxuICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xyXG4gICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dENvbnRhaW5lci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBpZiAoY2hhdFVzZXIgIT09IFwiXCIgJiYgY2hhdERhdGEgIT09IFwiXCIpIHtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLmFwcGVuZENoaWxkKGRpdlRhZ1RleHQpO1xyXG4gICAgICAgIHRleHRDb250YWluZXJbaV0uc2Nyb2xsVG9wID0gdGV4dENvbnRhaW5lcltpXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoYXQgPSBjcmVhdGVDaGF0O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1lbW9yeSgpIHtcclxuXHJcbiAgdmFyIGxvYWRDYXJkcyA9IHJlcXVpcmUoXCIuL2xvYWRDYXJkc1wiKTtcclxuICBsb2FkQ2FyZHMuY2FyZHMoNCwgNCk7XHJcblxyXG4gIHZhciBjYXJkQ2hlY2sgPSByZXF1aXJlKFwiLi9jYXJkQ2hlY2tcIik7XHJcbiAgY2FyZENoZWNrLmNoZWNrKCk7XHJcblxyXG4gIHZhciBwYWlyQ2hlY2sgPSByZXF1aXJlKFwiLi9wYWlyQ2hlY2tcIik7XHJcbiAgcGFpckNoZWNrLnBhaXIoKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZU1lbW9yeTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBsb2FkQ2FyZHMocm93cywgY2FyZHMpIHtcclxuXHJcbiAgdmFyIGogPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgayA9IDA7XHJcbiAgLy8gdmFyIGNhcmRTb3J0ID0gLTE7XHJcblxyXG4gIHZhciBjcmVhdGVDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcclxuICBjcmVhdGVDYXJkLmNsYXNzTGlzdC5hZGQoXCJjYXJkXCIpO1xyXG4gIHZhciBmaW5kQ2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCByb3dzOyBpICs9IDEpIHtcclxuICAgIHZhciBjYXJkUm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcclxuICAgIGNhcmRSb3cuY2xhc3NMaXN0LmFkZChcInJvd1wiKTtcclxuICAgIGZvciAoaiA9IDA7IGogPCBjYXJkczsgaiArPSAxKSB7XHJcbiAgICAgIHZhciBjcmVhdGVDYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkFcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBcIiNcIik7XHJcbiAgICAgIHZhciBjcmVhdGVJbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiSU1HXCIpO1xyXG4gICAgICBjcmVhdGVDYXJkLmNsYXNzTGlzdC5hZGQoXCJjYXJkXCIpO1xyXG4gICAgICBjcmVhdGVDYXJkLmFwcGVuZENoaWxkKGNyZWF0ZUltZyk7XHJcbiAgICAgIGNhcmRSb3cuYXBwZW5kQ2hpbGQoY3JlYXRlQ2FyZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChrID0gMDsgayA8IGZpbmRDYXJkQ29udGFpbmVyLmxlbmd0aDsgayArPSAxKSB7XHJcbiAgICAgIGZpbmRDYXJkQ29udGFpbmVyW2tdLmFwcGVuZENoaWxkKGNhcmRSb3cpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG4gIHZhciBmaW5kQWxsQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcblxyXG5cclxuLy9Gb3IgbGF0ZXIgdXNlXHJcbiAgLy8gaWYgKGZpbmRBbGxDYXJkcy5sZW5ndGggJSAyICE9PSAwKSB7XHJcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoXCJub1wiKTtcclxuICAvLyB9IGVsc2UgaWYgKGZpbmRBbGxDYXJkcy5sZW5ndGggPiAxNikge1xyXG4gIC8vICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIG1hbnlcIik7XHJcbiAgLy8gfSBlbHNlIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoIDwgNCkge1xyXG4gIC8vICAgdGhyb3cgbmV3IEVycm9yKFwiVG9vIGZld1wiKTtcclxuICAvLyB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jYXJkcyA9IGxvYWRDYXJkcztcclxuIiwiZnVuY3Rpb24gbW92YWJsZSgpIHtcclxuXHJcblxyXG4gIHZhciBmaW5kV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xyXG5cclxuICAgICAgLy9Mb29rIGZvciB0aGUgd2luZG93IGFuZCBhZGQgbW91c2Vkb3duICsgYW5kIG1vdXNldXBcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgZmluZFdpbmRvd3NbaV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZURvd24sIGZhbHNlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXAsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlVXAoZXZlbnQpIHtcclxuICAgICAgLy9XaGVuIHJlbGVhc2luZyBtb3VzZS5cclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICAgIC8vIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnpJbmRleCA9IFwiOTk4XCI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZURvd24oZXZlbnQpIHtcclxuXHJcbiAgICAvL1NhdmluZyBjb29yZGluYXRlcyBvbiBjbGljay5cclxuICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lID09PSBcInRvcFwiKSB7XHJcbiAgICAgIGFWYXJZID0gZXZlbnQub2Zmc2V0WTtcclxuICAgICAgYVZhclggPSBldmVudC5vZmZzZXRYO1xyXG4gICAgICBzYXZlVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG5cclxuICAgICAgLy9SdW5zIG1vdXNlbW92ZSAtIGlmIGRyYWdnaW5nIG9uIHRoZSByaWdodCBwbGFjZVxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRpdk1vdmUoZXZlbnQpIHtcclxuXHJcbiAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gZXZlbnQueSAtIGFWYXJZICsgXCJweFwiO1xyXG4gICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBldmVudC54IC0gYVZhclggKyBcInB4XCI7XHJcblxyXG4gIH1cclxuXHJcbiAgYWRkTGlzdGVuZXJzKCk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcGFpckNoZWNrKCkge1xyXG4gIHZhciBmaW5kVGhlQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xyXG4gIHZhciBmaW5kQ291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xpY2tDb3VudGVyXCIpO1xyXG4gIHZhciBjbGlja0NvdW50aW5nID0gMDtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG9uSGFuZEFyciA9IFtdO1xyXG4gIHZhciB0aGVDaGVja0FyciA9IFtdO1xyXG5cclxuICB2YXIgc2V0QXNGdW5jdGlvblRlc3QgPSBmdW5jdGlvbihldmVudCkge1xyXG5cclxuICAgIGNsaWNrQ291bnRpbmcgKz0gMTtcclxuXHJcbiAgICB0aGVDaGVja0Fyci5wdXNoKGV2ZW50LnRhcmdldCk7XHJcbiAgICBvbkhhbmRBcnIucHVzaChldmVudC50YXJnZXQpO1xyXG5cclxuXHJcbiAgICBpZiAodGhlQ2hlY2tBcnJbMF0gJiYgdGhlQ2hlY2tBcnJbMV0pIHtcclxuXHJcbiAgICAgIGlmICh0aGVDaGVja0FyclswXSAhPT0gdGhlQ2hlY2tBcnJbMV0pIHtcclxuXHJcbiAgICAgICAgICBpZiAob25IYW5kQXJyWzBdICYmIG9uSGFuZEFyclsxXSkge1xyXG4gICAgICAgICAgICBpZiAob25IYW5kQXJyWzJdICE9PSB1bmRlZmluZWQgJiYgb25IYW5kQXJyWzJdICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgb25IYW5kQXJyID0gb25IYW5kQXJyLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgaWYgKG9uSGFuZEFyclswXSAhPT0gdW5kZWZpbmVkICYmIG9uSGFuZEFyclsxXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgaWYgKG9uSGFuZEFyclswXS5jbGFzc05hbWUgPT09IG9uSGFuZEFyclsxXS5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFpclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgb25IYW5kQXJyWzBdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcclxuICAgICAgICAgICAgICAgIG9uSGFuZEFyclsxXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgICAgLy8gfSwgMTAwMCk7XHJcblxyXG4gICAgICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgdGhlQ2hlY2tBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAvLyB9LCAxMDAxKTtcclxuXHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm5vdCBwYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyclswXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyWzFdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gfSwgNTAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgb25IYW5kQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGVDaGVja0Fyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAvLyB9LCAxMDAxKTtcclxuXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCAxMDAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb25IYW5kQXJyID0gb25IYW5kQXJyLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIllvdSdyZSBwdXNoaW5nIHRoZSBzYW1lIG92ZXIgYW5kIG92ZXIgYWdhaW4uXCIpO1xyXG4gICAgICAgIHRoZUNoZWNrQXJyID0gdGhlQ2hlY2tBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIGNsaWNrQ291bnRpbmcgLT0gMTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgZmluZENvdW50ZXIudGV4dENvbnRlbnQgPSBjbGlja0NvdW50aW5nO1xyXG4gIH07XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRUaGVDYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBmaW5kVGhlQ2FyZHNbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHNldEFzRnVuY3Rpb25UZXN0KTtcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMucGFpciA9IHBhaXJDaGVjaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiByZW5kZXJXaW5kb3coZXZlbnQpIHtcclxuXHJcbiAgdmFyIG1vdmFibGUgPSByZXF1aXJlKFwiLi9tb3ZhYmxlXCIpO1xyXG4gIHZhciB3aW5kb3dEZXN0cm95ZXIgPSByZXF1aXJlKFwiLi93aW5kb3dEZXN0cm95ZXJcIik7XHJcbiAgdmFyIGNyZWF0ZU1lbW9yeSA9IHJlcXVpcmUoXCIuL2NyZWF0ZU1lbW9yeVwiKTtcclxuICB2YXIgY3JlYXRlQ2hhdCA9IHJlcXVpcmUoXCIuL2NyZWF0ZUNoYXRcIik7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgbnVtYmVyID0gXCJcIjtcclxuXHJcbiAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XHJcbiAgICB2YXIgZmluZE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaWNvbjFcIik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcbiAgICBmaW5kTmF2W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzBdKSB7XHJcbiAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzFdKSB7XHJcbiAgICAgICAgcmVuZGVyTWVtKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5hdkNsaWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcclxuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcbiAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gICAgLy8gZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAvLyAgIGZpbmRBbGxXaW5kb3dzW2ldLmNsYXNzTGlzdC5hZGQoXCJ3aW5kb3ctXCIgKyBpKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBjcmVhdGVDaGF0LmNoYXQoKTtcclxuICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiByZW5kZXJNZW0oKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xyXG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xyXG4gICAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgZmluZEFsbFdpbmRvd3NbaV0uY2xhc3NMaXN0LmFkZChcIndpbmRvdy1cIiArIGkpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XHJcbiAgICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xyXG4gIH1cclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XHJcbiIsImZ1bmN0aW9uIHRhc2tiYXIoKSB7XHJcbiAgdmFyIGZpbmRUYXNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgZmluZFRhc2tiYXIuY2xhc3NMaXN0LmFkZChcInRhc2stYXBwZWFyXCIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcclxuIiwiZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xyXG4gIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xyXG4iXX0=
