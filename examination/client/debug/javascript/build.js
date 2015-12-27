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
  var nicking = document.querySelectorAll(".enter-nick");
  var k = 0;
  var j = 0;
  var newArr = [];

  for (j = 0; j < changeButton.length; j += 1) {
    k++;
  }

  function findAndSet(event) {
    
      nicking[k - 1].setAttribute("placeholder", localStorage.getItem("nickname"));

      if (event.target.parentElement.parentElement.children[1].classList.contains("name-field-gone")) {
        event.target.parentElement.parentElement.children[1].classList.remove("name-field-gone");
        event.target.parentElement.parentElement.children[2].classList.remove("text-container-after");
      } else {
        event.target.parentElement.parentElement.children[1].classList.add("name-field-gone");
        event.target.parentElement.parentElement.children[2].classList.add("text-container-after");
      }

  }

  changeButton[k - 1].addEventListener("click", findAndSet);

}

module.exports.change = chatSettings;

},{}],4:[function(require,module,exports){
function checkNick() {

  var nickInput = document.querySelectorAll(".name-field");
  var changeButton = document.querySelectorAll(".name-field");

  var i = 0;
  var k = 0;
  var nickname = "";

  for (i = 0; i < nickInput.length; i += 1) {
    k++;
  }

  if (localStorage.getItem("nickname") !== null) {
    nickname = localStorage.getItem("nickname");
    nickInput[k - 1].classList.add("name-field-gone");

  } else {
      nickInput[k - 1].classList.remove("name-field-gone");
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
  var noRepeatCounter = 0;

  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
  chatSettings.change();
  for (var i = 0; i < findSubmit.length; i += 1) {
      checkNick.check();
      noRepeatCounter++;
  }

  findNickSubmit[noRepeatCounter - 1].addEventListener("click", function() {
    // *Hide after use - send to local storage  -> *Ish
    if (findNickArea[noRepeatCounter - 1].value !== "") {
      data["username"] = findNickArea[noRepeatCounter - 1].value;
      localStorage.setItem("nickname", findNickArea[noRepeatCounter - 1].value);
      // for (var j = 0; j < textContainer.length; j += 1) {
        //test
        findNameField[noRepeatCounter - 1].classList.add("name-field-gone");
        textContainer[noRepeatCounter - 1].classList.add("text-container-after");
      // }
    }
  });

  findSubmit[noRepeatCounter - 1].addEventListener("click", function() {
    if (localStorage.nickname !== "") {
      data["username"] = localStorage.getItem("nickname");
      data["data"] = findTextArea[noRepeatCounter - 1].value;
    }
  });

  var data = {
    "type": "message",
    "data" : "",
    "username": "",
    "channel": "",
    "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
  };

  socket.addEventListener("open", function (event) {
    var i = 0;
    var counter = 0;

    for (i = 0; i < findSubmit.length; i += 1) {
      counter++;
    }

    findSubmit[counter - 1].addEventListener("click", function(event) {
      socket.send(JSON.stringify(data));
      findTextArea[counter - 1].value = "";
      event.preventDefault();
    });

    findTextArea[counter - 1].addEventListener("keypress", function(event) {
      if (event.keyCode == 13) {
        findSubmit[counter - 1].click();
        event.preventDefault();
      }

    });
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

          if (chatUser === localStorage.getItem("nickname")) {
            divTagText.classList.add("user-sent");
          }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hlY2tOaWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2xvYWRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbW92YWJsZS5qcyIsImNsaWVudC9zb3VyY2UvanMvcGFpckNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XHJcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcclxuXHJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcclxudGFza2Jhci5icmluZ0ZvcnRoKCk7XHJcblxyXG4vLyB2YXIgbWVtb3J5ID0gcmVxdWlyZShcIi4vbWVtb3J5XCIpO1xyXG4vLyBtZW1vcnkuY3JlYXRlKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY2FyZENoZWNrKCkge1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGNhcmRBcnIgPSBbXTtcclxuXHJcblxyXG4gIHZhciBmaW5kSW1nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICB2YXIgZmluZEltZ0luc2lkZVdpbmRvdyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93IGltZ1wiKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhjYXJkQXJyKTtcclxuICBmdW5jdGlvbiByYW5kb21pemluZygpIHtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBjYWxjdWxhdGluZ0NhcmRzLzI7IGkgKz0gMSkge1xyXG4gICAgICBjYXJkQXJyLnB1c2goaSsxKTtcclxuICAgICAgY2FyZEFyci5wdXNoKGkrMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aCwgdCwgaTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxyXG4gICAgd2hpbGUgKG0pIHtcclxuXHJcbiAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxyXG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbS0tKTtcclxuXHJcbiAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgdCA9IGNhcmRBcnJbbV07XHJcbiAgICAgIGNhcmRBcnJbbV0gPSBjYXJkQXJyW2ldO1xyXG4gICAgICBjYXJkQXJyW2ldID0gdDtcclxuICAgIH1cclxuICAgIHJldHVybiBjYXJkQXJyO1xyXG4gIH1cclxuXHJcbiAgdmFyIHN0b3JhZ2UgPSBbXTtcclxuICB2YXIgcmFuZG9taXplciA9IDA7XHJcbiAgdmFyIHJlbW92ZVRoZU51bWJlciA9IDA7XHJcbiAgdmFyIGFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgdGhlQ2FyZHMgPSBbXTtcclxuXHJcbiAgY29uc29sZS5sb2coXCItLS0tXCIpO1xyXG5cclxuICAvLyBjb25zb2xlLmxvZyhmaW5kSW1nLmxlbmd0aC9hbGxXaW5kb3dzLmxlbmd0aCk7XHJcbiAgdmFyIGNhbGN1bGF0aW5nQ2FyZHMgPSBmaW5kSW1nLmxlbmd0aC9hbGxXaW5kb3dzLmxlbmd0aDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGZpbmRJbWdJbnNpZGVXaW5kb3cubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcbiAgICB0aGVDYXJkcyA9IHJhbmRvbWl6aW5nKCk7XHJcblxyXG4gICAgaWYgKHRoZUNhcmRzW2ldICE9PSAwKSB7XHJcbiAgICAgIHJlbW92ZVRoZU51bWJlciA9IHRoZUNhcmRzLnNwbGljZSgwLCAxKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW1nW2ldLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG5cclxuICAgIGlmICghZmluZEltZ1tpXS5oYXNBdHRyaWJ1dGUoXCJjbGFzc1wiKSkge1xyXG4gICAgICBmaW5kSW1nW2ldLmNsYXNzTGlzdC5hZGQocmVtb3ZlVGhlTnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kSW1nW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzdG9yYWdlLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuXHJcbiAgICAgIGlmIChzdG9yYWdlLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHN0b3JhZ2UubGVuZ3RoID0gMDtcclxuICAgICAgICB9LCAxMDAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHN0b3JhZ2VbMF0gPT09IHN0b3JhZ2VbMV0pIHtcclxuICAgICAgICBzdG9yYWdlID0gc3RvcmFnZS5zbGljZSgwLCAtMSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoc3RvcmFnZS5sZW5ndGggPD0gMikge1xyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuaGFzQXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIikpIHtcclxuICAgICAgICAgIGV2ZW50LnRhcmdldC5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS9cIiArIGV2ZW50LnRhcmdldC5jbGFzc05hbWUgKyBcIi5wbmdcIiApO1xyXG5cclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHN0b3JhZ2UubGVuZ3RoID0gMDtcclxuICAgICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2FyZENoZWNrO1xyXG4iLCJmdW5jdGlvbiBjaGF0U2V0dGluZ3MoZXZlbnQpIHtcclxuICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaWNrLWNoYW5nZXJcIik7XHJcbiAgdmFyIG5hbWVGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XHJcbiAgdmFyIG5pY2tpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIHZhciBqID0gMDtcclxuICB2YXIgbmV3QXJyID0gW107XHJcblxyXG4gIGZvciAoaiA9IDA7IGogPCBjaGFuZ2VCdXR0b24ubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgIGsrKztcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGZpbmRBbmRTZXQoZXZlbnQpIHtcclxuICAgIFxyXG4gICAgICBuaWNraW5nW2sgLSAxXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKTtcclxuXHJcbiAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcIm5hbWUtZmllbGQtZ29uZVwiKSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VCdXR0b25bayAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmaW5kQW5kU2V0KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IGNoYXRTZXR0aW5ncztcclxuIiwiZnVuY3Rpb24gY2hlY2tOaWNrKCkge1xyXG5cclxuICB2YXIgbmlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgayA9IDA7XHJcbiAgdmFyIG5pY2tuYW1lID0gXCJcIjtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IG5pY2tJbnB1dC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaysrO1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcclxuICAgIG5pY2tuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKTtcclxuICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuXHJcbiAgfSBlbHNlIHtcclxuICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tOaWNrO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xyXG5cclxuICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xyXG4gIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcclxuICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xyXG4gIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZW50ZXJlZE1lc3NhZ2UgPSBcIlwiO1xyXG4gIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XHJcbiAgdmFyIGNoYXRTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NoYXRTZXR0aW5nc1wiKTtcclxuICB2YXIgbm9SZXBlYXRDb3VudGVyID0gMDtcclxuXHJcbiAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXR0ZXh0XCIpO1xyXG4gIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2hlY2tOaWNrLmNoZWNrKCk7XHJcbiAgICAgIG5vUmVwZWF0Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gKkhpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlICAtPiAqSXNoXHJcbiAgICBpZiAoZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUpO1xyXG4gICAgICAvLyBmb3IgKHZhciBqID0gMDsgaiA8IHRleHRDb250YWluZXIubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAvL3Rlc3RcclxuICAgICAgICBmaW5kTmFtZUZpZWxkW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZmluZFN1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLm5pY2tuYW1lICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICAgIGRhdGFbXCJkYXRhXCJdID0gZmluZFRleHRBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgIFwiZGF0YVwiIDogXCJcIixcclxuICAgIFwidXNlcm5hbWVcIjogXCJcIixcclxuICAgIFwiY2hhbm5lbFwiOiBcIlwiLFxyXG4gICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXHJcbiAgfTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlID0gXCJcIjtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uY2xpY2soKTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XHJcbiAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xyXG4gICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XHJcbiAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcclxuICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xyXG4gICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xyXG5cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgaWYgKGNoYXRVc2VyICE9PSBcIlwiICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKSB7XHJcbiAgICAgICAgICAgIGRpdlRhZ1RleHQuY2xhc3NMaXN0LmFkZChcInVzZXItc2VudFwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5hcHBlbmRDaGlsZChkaXZUYWdUZXh0KTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbFRvcCA9IHRleHRDb250YWluZXJbaV0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XHJcblxyXG4gIHZhciBsb2FkQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkQ2FyZHNcIik7XHJcbiAgbG9hZENhcmRzLmNhcmRzKDQsIDQpO1xyXG5cclxuICB2YXIgY2FyZENoZWNrID0gcmVxdWlyZShcIi4vY2FyZENoZWNrXCIpO1xyXG4gIGNhcmRDaGVjay5jaGVjaygpO1xyXG5cclxuICB2YXIgcGFpckNoZWNrID0gcmVxdWlyZShcIi4vcGFpckNoZWNrXCIpO1xyXG4gIHBhaXJDaGVjay5wYWlyKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gbG9hZENhcmRzKHJvd3MsIGNhcmRzKSB7XHJcblxyXG4gIHZhciBqID0gMDtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIC8vIHZhciBjYXJkU29ydCA9IC0xO1xyXG5cclxuICB2YXIgY3JlYXRlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgY3JlYXRlQ2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZFwiKTtcclxuICB2YXIgZmluZENhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgcm93czsgaSArPSAxKSB7XHJcbiAgICB2YXIgY2FyZFJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICBjYXJkUm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XHJcbiAgICBmb3IgKGogPSAwOyBqIDwgY2FyZHM7IGogKz0gMSkge1xyXG4gICAgICB2YXIgY3JlYXRlQ2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJBXCIpO1xyXG4gICAgICBjcmVhdGVDYXJkLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgXCIjXCIpO1xyXG4gICAgICB2YXIgY3JlYXRlSW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIklNR1wiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5jbGFzc0xpc3QuYWRkKFwiY2FyZFwiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5hcHBlbmRDaGlsZChjcmVhdGVJbWcpO1xyXG4gICAgICBjYXJkUm93LmFwcGVuZENoaWxkKGNyZWF0ZUNhcmQpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoayA9IDA7IGsgPCBmaW5kQ2FyZENvbnRhaW5lci5sZW5ndGg7IGsgKz0gMSkge1xyXG4gICAgICBmaW5kQ2FyZENvbnRhaW5lcltrXS5hcHBlbmRDaGlsZChjYXJkUm93KTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICB2YXIgZmluZEFsbENhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuXHJcbi8vRm9yIGxhdGVyIHVzZVxyXG4gIC8vIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoICUgMiAhPT0gMCkge1xyXG4gIC8vICAgdGhyb3cgbmV3IEVycm9yKFwibm9cIik7XHJcbiAgLy8gfSBlbHNlIGlmIChmaW5kQWxsQ2FyZHMubGVuZ3RoID4gMTYpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBtYW55XCIpO1xyXG4gIC8vIH0gZWxzZSBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCA8IDQpIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIlRvbyBmZXdcIik7XHJcbiAgLy8gfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2FyZHMgPSBsb2FkQ2FyZHM7XHJcbiIsImZ1bmN0aW9uIG1vdmFibGUoKSB7XHJcblxyXG5cclxuICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGZpbmRXaW5kb3dzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZVVwKGV2ZW50KSB7XHJcbiAgICAgIC8vV2hlbiByZWxlYXNpbmcgbW91c2UuXHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgICAvLyBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS56SW5kZXggPSBcIjk5OFwiO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgLy9TYXZpbmcgY29vcmRpbmF0ZXMgb24gY2xpY2suXHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJ0b3BcIikge1xyXG4gICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XHJcbiAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcclxuICAgICAgc2F2ZVRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuXHJcbiAgICAgIC8vUnVucyBtb3VzZW1vdmUgLSBpZiBkcmFnZ2luZyBvbiB0aGUgcmlnaHQgcGxhY2VcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcclxuICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xyXG5cclxuICB9XHJcblxyXG4gIGFkZExpc3RlbmVycygpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLm1vdmUgPSBtb3ZhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHBhaXJDaGVjaygpIHtcclxuICB2YXIgZmluZFRoZUNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImltZ1wiKTtcclxuICB2YXIgZmluZENvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcclxuICB2YXIgY2xpY2tDb3VudGluZyA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBvbkhhbmRBcnIgPSBbXTtcclxuICB2YXIgdGhlQ2hlY2tBcnIgPSBbXTtcclxuXHJcbiAgdmFyIHNldEFzRnVuY3Rpb25UZXN0ID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHJcbiAgICBjbGlja0NvdW50aW5nICs9IDE7XHJcblxyXG4gICAgdGhlQ2hlY2tBcnIucHVzaChldmVudC50YXJnZXQpO1xyXG4gICAgb25IYW5kQXJyLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuXHJcblxyXG4gICAgaWYgKHRoZUNoZWNrQXJyWzBdICYmIHRoZUNoZWNrQXJyWzFdKSB7XHJcblxyXG4gICAgICBpZiAodGhlQ2hlY2tBcnJbMF0gIT09IHRoZUNoZWNrQXJyWzFdKSB7XHJcblxyXG4gICAgICAgICAgaWYgKG9uSGFuZEFyclswXSAmJiBvbkhhbmRBcnJbMV0pIHtcclxuICAgICAgICAgICAgaWYgKG9uSGFuZEFyclsyXSAhPT0gdW5kZWZpbmVkICYmIG9uSGFuZEFyclsyXSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgIG9uSGFuZEFyciA9IG9uSGFuZEFyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0gIT09IHVuZGVmaW5lZCAmJiBvbkhhbmRBcnJbMV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0uY2xhc3NOYW1lID09PSBvbkhhbmRBcnJbMV0uY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIG9uSGFuZEFyclswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICAgIC8vIH0sIDEwMDApO1xyXG5cclxuICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIHRoZUNoZWNrQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgLy8gfSwgMTAwMSk7XHJcblxyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJub3QgcGFpclwiKTtcclxuICAgICAgICAgICAgICAgIC8vIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMF0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyclsxXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcclxuICAgICAgICAgICAgICAgIC8vIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgIG9uSGFuZEFyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGhlQ2hlY2tBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgLy8gfSwgMTAwMSk7XHJcblxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9uSGFuZEFyciA9IG9uSGFuZEFyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJZb3UncmUgcHVzaGluZyB0aGUgc2FtZSBvdmVyIGFuZCBvdmVyIGFnYWluLlwiKTtcclxuICAgICAgICB0aGVDaGVja0FyciA9IHRoZUNoZWNrQXJyLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICBjbGlja0NvdW50aW5nIC09IDE7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGZpbmRDb3VudGVyLnRleHRDb250ZW50ID0gY2xpY2tDb3VudGluZztcclxuICB9O1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kVGhlQ2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgZmluZFRoZUNhcmRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzZXRBc0Z1bmN0aW9uVGVzdCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnBhaXIgPSBwYWlyQ2hlY2s7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyV2luZG93KGV2ZW50KSB7XHJcblxyXG4gIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcclxuICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xyXG4gIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9jcmVhdGVNZW1vcnlcIik7XHJcbiAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jcmVhdGVDaGF0XCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG51bWJlciA9IFwiXCI7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xyXG4gICAgdmFyIGZpbmROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmljb24xXCIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsxXSkge1xyXG4gICAgICAgIHJlbmRlck1lbSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcbiAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgIC8vIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgLy8gICBmaW5kQWxsV2luZG93c1tpXS5jbGFzc0xpc3QuYWRkKFwid2luZG93LVwiICsgaSk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgY3JlYXRlQ2hhdC5jaGF0KCk7XHJcbiAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcclxuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuICAgICAgdmFyIGZpbmRBbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGZpbmRBbGxXaW5kb3dzW2ldLmNsYXNzTGlzdC5hZGQoXCJ3aW5kb3ctXCIgKyBpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY3JlYXRlTWVtb3J5LmNyZWF0ZSgpO1xyXG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG5cclxuICB9XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xyXG4iLCJmdW5jdGlvbiB0YXNrYmFyKCkge1xyXG4gIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGZpbmRUYXNrYmFyLmNsYXNzTGlzdC5hZGQoXCJ0YXNrLWFwcGVhclwiKTtcclxuICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYnJpbmdGb3J0aCA9IHRhc2tiYXI7XHJcbiIsImZ1bmN0aW9uIHdpbmRvd0Rlc3Ryb3llcigpIHtcclxuICB2YXIgZmluZEV4aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4aXRcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kRXhpdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgZmluZEV4aXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZGVzdHJveSA9IHdpbmRvd0Rlc3Ryb3llcjtcclxuIl19
