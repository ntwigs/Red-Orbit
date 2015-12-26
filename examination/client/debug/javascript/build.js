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
function checkNick() {

  var nickInput = document.querySelectorAll(".name-field");

  var i = 0;
  var nickname = "";

  if (localStorage.getItem("nickname") !== null) {
    nickname = localStorage.getItem("nickname");
    console.log("not empty");
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.add("name-field-gone");
    }

  } else {
    console.log("very empty");
    for (i = 0; i < nickInput.length; i += 1) {
      nickInput[i].classList.remove("name-field-gone");
    }
  }

  console.log(nickname);
  return nickname;

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

  checkNick.check();

  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
  for (var i = 0; i < findSubmit.length; i += 1) {
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

},{"./checkNick":4}],6:[function(require,module,exports){
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

},{"./chatSettings":3,"./createChat":5,"./createMemory":6,"./movable":8,"./windowDestroyer":12}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hlY2tOaWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2xvYWRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbW92YWJsZS5qcyIsImNsaWVudC9zb3VyY2UvanMvcGFpckNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcclxucmVuZGVyV2luZG93LnJlbmRlcigpO1xyXG5cclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xyXG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcclxuXHJcbi8vIHZhciBtZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnlcIik7XHJcbi8vIG1lbW9yeS5jcmVhdGUoKTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjYXJkQ2hlY2soKSB7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY2FyZEFyciA9IFtdO1xyXG5cclxuXHJcbiAgdmFyIGZpbmRJbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiaW1nXCIpO1xyXG4gIHZhciBmaW5kSW1nSW5zaWRlV2luZG93ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3cgaW1nXCIpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGNhcmRBcnIpO1xyXG4gIGZ1bmN0aW9uIHJhbmRvbWl6aW5nKCkge1xyXG4gICAgZm9yIChpID0gMDsgaSA8IGNhbGN1bGF0aW5nQ2FyZHMvMjsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRBcnIucHVzaChpKzEpO1xyXG4gICAgICBjYXJkQXJyLnB1c2goaSsxKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbSA9IGNhcmRBcnIubGVuZ3RoLCB0LCBpO1xyXG5cclxuICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXHJcbiAgICB3aGlsZSAobSkge1xyXG5cclxuICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW504oCmXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtLS0pO1xyXG5cclxuICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICB0ID0gY2FyZEFyclttXTtcclxuICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XHJcbiAgICAgIGNhcmRBcnJbaV0gPSB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNhcmRBcnI7XHJcbiAgfVxyXG5cclxuICB2YXIgc3RvcmFnZSA9IFtdO1xyXG4gIHZhciByYW5kb21pemVyID0gMDtcclxuICB2YXIgcmVtb3ZlVGhlTnVtYmVyID0gMDtcclxuICB2YXIgYWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gIHZhciB0aGVDYXJkcyA9IFtdO1xyXG5cclxuICBjb25zb2xlLmxvZyhcIi0tLS1cIik7XHJcblxyXG4gIC8vIGNvbnNvbGUubG9nKGZpbmRJbWcubGVuZ3RoL2FsbFdpbmRvd3MubGVuZ3RoKTtcclxuICB2YXIgY2FsY3VsYXRpbmdDYXJkcyA9IGZpbmRJbWcubGVuZ3RoL2FsbFdpbmRvd3MubGVuZ3RoO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgZmluZEltZ0luc2lkZVdpbmRvdy5sZW5ndGg7IGkgKz0gMSkge1xyXG5cclxuICAgIHRoZUNhcmRzID0gcmFuZG9taXppbmcoKTtcclxuXHJcbiAgICBpZiAodGhlQ2FyZHNbaV0gIT09IDApIHtcclxuICAgICAgcmVtb3ZlVGhlTnVtYmVyID0gdGhlQ2FyZHMuc3BsaWNlKDAsIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbWdbaV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcblxyXG4gICAgaWYgKCFmaW5kSW1nW2ldLmhhc0F0dHJpYnV0ZShcImNsYXNzXCIpKSB7XHJcbiAgICAgIGZpbmRJbWdbaV0uY2xhc3NMaXN0LmFkZChyZW1vdmVUaGVOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRJbWdbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHN0b3JhZ2UucHVzaChldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgaWYgKHN0b3JhZ2UubGVuZ3RoID4gMikge1xyXG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgc3RvcmFnZS5sZW5ndGggPSAwO1xyXG4gICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc3RvcmFnZVswXSA9PT0gc3RvcmFnZVsxXSkge1xyXG4gICAgICAgIHN0b3JhZ2UgPSBzdG9yYWdlLnNsaWNlKDAsIC0xKTtcclxuICAgICAgfSBlbHNlIGlmIChzdG9yYWdlLmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5oYXNBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKSkge1xyXG4gICAgICAgICAgZXZlbnQudGFyZ2V0LnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlL1wiICsgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSArIFwiLnBuZ1wiICk7XHJcblxyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc3RvcmFnZS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjYXJkQ2hlY2s7XHJcbiIsImZ1bmN0aW9uIGNoYXRTZXR0aW5ncygpIHtcclxuICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaWNrLWNoYW5nZXJcIik7XHJcbiAgdmFyIG5hbWVGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XHJcbiAgdmFyIGkgPSAwO1xyXG5cclxuICBmb3IoaSA9IDA7IGkgPCBjaGFuZ2VCdXR0b24ubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNoYW5nZUJ1dHRvbltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIG5hbWVGaWVsZFtpIC0gMV0uY2xhc3NMaXN0LnRvZ2dsZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgdGV4dENvbnRhaW5lcltpIC0gMV0uY2xhc3NMaXN0LnRvZ2dsZShcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XHJcbiIsImZ1bmN0aW9uIGNoZWNrTmljaygpIHtcclxuXHJcbiAgdmFyIG5pY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBuaWNrbmFtZSA9IFwiXCI7XHJcblxyXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XHJcbiAgICBuaWNrbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICBjb25zb2xlLmxvZyhcIm5vdCBlbXB0eVwiKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgbmlja0lucHV0W2ldLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICB9XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmxvZyhcInZlcnkgZW1wdHlcIik7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgbmlja0lucHV0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIG5pY2tJbnB1dFtpXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc29sZS5sb2cobmlja25hbWUpO1xyXG4gIHJldHVybiBuaWNrbmFtZTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tOaWNrO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xyXG5cclxuICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xyXG4gIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcclxuICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xyXG4gIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZW50ZXJlZE1lc3NhZ2UgPSBcIlwiO1xyXG4gIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XHJcblxyXG4gIGNoZWNrTmljay5jaGVjaygpO1xyXG5cclxuICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kTmlja1N1Ym1pdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxyXG4gICAgICBpZiAoZmluZE5pY2tBcmVhW2kgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtpIC0gMV0udmFsdWU7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbaSAtIDFdLnZhbHVlKTtcclxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHRleHRDb250YWluZXIubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAgIC8vdGVzdFxyXG4gICAgICAgICAgZmluZE5hbWVGaWVsZFtqXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgICAgdGV4dENvbnRhaW5lcltqXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBmaW5kU3VibWl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICAgICAgZGF0YVtcImRhdGFcIl0gPSBmaW5kVGV4dEFyZWFbaSAtIDFdLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgIFwiZGF0YVwiIDogXCJcIixcclxuICAgIFwidXNlcm5hbWVcIjogXCJcIixcclxuICAgIFwiY2hhbm5lbFwiOiBcIlwiLFxyXG4gICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXHJcbiAgfTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRTdWJtaXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgIGZpbmRUZXh0QXJlYVtpIC0gMV0udmFsdWUgPSBcIlwiO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgcFRhZ1VzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcclxuICAgIHZhciBwVGFnTWVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIGRpdlRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gICAgLy8gdmFyIGJyVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJSXCIpO1xyXG4gICAgdmFyIGNoYXREYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5kYXRhO1xyXG4gICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcclxuICAgIHZhciBjcmVhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdERhdGEpO1xyXG4gICAgdmFyIGNyZWF0ZVVzZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0VXNlcik7XHJcbiAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcclxuICAgIC8vIHBUYWcuYXBwZW5kQ2hpbGQoYnJUYWcpO1xyXG4gICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dENvbnRhaW5lci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBpZiAoY2hhdFVzZXIgIT09IFwiXCIgJiYgY2hhdERhdGEgIT09IFwiXCIpIHtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLmFwcGVuZENoaWxkKGRpdlRhZ1RleHQpO1xyXG4gICAgICAgIHRleHRDb250YWluZXJbaV0uc2Nyb2xsVG9wID0gdGV4dENvbnRhaW5lcltpXS5zY3JvbGxIZWlnaHQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hhdCA9IGNyZWF0ZUNoYXQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xyXG5cclxuICB2YXIgbG9hZENhcmRzID0gcmVxdWlyZShcIi4vbG9hZENhcmRzXCIpO1xyXG4gIGxvYWRDYXJkcy5jYXJkcyg0LCA0KTtcclxuXHJcbiAgdmFyIGNhcmRDaGVjayA9IHJlcXVpcmUoXCIuL2NhcmRDaGVja1wiKTtcclxuICBjYXJkQ2hlY2suY2hlY2soKTtcclxuXHJcbiAgdmFyIHBhaXJDaGVjayA9IHJlcXVpcmUoXCIuL3BhaXJDaGVja1wiKTtcclxuICBwYWlyQ2hlY2sucGFpcigpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlTWVtb3J5O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGxvYWRDYXJkcyhyb3dzLCBjYXJkcykge1xyXG5cclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBrID0gMDtcclxuICAvLyB2YXIgY2FyZFNvcnQgPSAtMTtcclxuXHJcbiAgdmFyIGNyZWF0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gIGNyZWF0ZUNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XHJcbiAgdmFyIGZpbmRDYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IHJvd3M7IGkgKz0gMSkge1xyXG4gICAgdmFyIGNhcmRSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gICAgY2FyZFJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xyXG4gICAgZm9yIChqID0gMDsgaiA8IGNhcmRzOyBqICs9IDEpIHtcclxuICAgICAgdmFyIGNyZWF0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQVwiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgdmFyIGNyZWF0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJJTUdcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuYXBwZW5kQ2hpbGQoY3JlYXRlSW1nKTtcclxuICAgICAgY2FyZFJvdy5hcHBlbmRDaGlsZChjcmVhdGVDYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGsgPSAwOyBrIDwgZmluZENhcmRDb250YWluZXIubGVuZ3RoOyBrICs9IDEpIHtcclxuICAgICAgZmluZENhcmRDb250YWluZXJba10uYXBwZW5kQ2hpbGQoY2FyZFJvdyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdmFyIGZpbmRBbGxDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcclxuXHJcblxyXG4vL0ZvciBsYXRlciB1c2VcclxuICAvLyBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCAlIDIgIT09IDApIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIm5vXCIpO1xyXG4gIC8vIH0gZWxzZSBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCA+IDE2KSB7XHJcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueVwiKTtcclxuICAvLyB9IGVsc2UgaWYgKGZpbmRBbGxDYXJkcy5sZW5ndGggPCA0KSB7XHJcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gZmV3XCIpO1xyXG4gIC8vIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNhcmRzID0gbG9hZENhcmRzO1xyXG4iLCJmdW5jdGlvbiBtb3ZhYmxlKCkge1xyXG5cclxuXHJcbiAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGkgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBmaW5kV2luZG93c1tpXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcCwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VVcChldmVudCkge1xyXG4gICAgICAvL1doZW4gcmVsZWFzaW5nIG1vdXNlLlxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcclxuICAgICAgLy8gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCI5OThcIjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xyXG5cclxuICAgIC8vU2F2aW5nIGNvb3JkaW5hdGVzIG9uIGNsaWNrLlxyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09IFwidG9wXCIpIHtcclxuICAgICAgYVZhclkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgICBhVmFyWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XHJcblxyXG4gICAgICAvL1J1bnMgbW91c2Vtb3ZlIC0gaWYgZHJhZ2dpbmcgb24gdGhlIHJpZ2h0IHBsYWNlXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZGl2TW92ZShldmVudCkge1xyXG5cclxuICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBldmVudC55IC0gYVZhclkgKyBcInB4XCI7XHJcbiAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnggLSBhVmFyWCArIFwicHhcIjtcclxuXHJcbiAgfVxyXG5cclxuICBhZGRMaXN0ZW5lcnMoKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tb3ZlID0gbW92YWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBwYWlyQ2hlY2soKSB7XHJcbiAgdmFyIGZpbmRUaGVDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcbiAgdmFyIGZpbmRDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XHJcbiAgdmFyIGNsaWNrQ291bnRpbmcgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgb25IYW5kQXJyID0gW107XHJcbiAgdmFyIHRoZUNoZWNrQXJyID0gW107XHJcblxyXG4gIHZhciBzZXRBc0Z1bmN0aW9uVGVzdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgY2xpY2tDb3VudGluZyArPSAxO1xyXG5cclxuICAgIHRoZUNoZWNrQXJyLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuICAgIG9uSGFuZEFyci5wdXNoKGV2ZW50LnRhcmdldCk7XHJcblxyXG5cclxuICAgIGlmICh0aGVDaGVja0FyclswXSAmJiB0aGVDaGVja0FyclsxXSkge1xyXG5cclxuICAgICAgaWYgKHRoZUNoZWNrQXJyWzBdICE9PSB0aGVDaGVja0FyclsxXSkge1xyXG5cclxuICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0gJiYgb25IYW5kQXJyWzFdKSB7XHJcbiAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMl0gIT09IHVuZGVmaW5lZCAmJiBvbkhhbmRBcnJbMl0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBvbkhhbmRBcnIgPSBvbkhhbmRBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAob25IYW5kQXJyWzBdICE9PSB1bmRlZmluZWQgJiYgb25IYW5kQXJyWzFdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpZiAob25IYW5kQXJyWzBdLmNsYXNzTmFtZSA9PT0gb25IYW5kQXJyWzFdLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMF0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgb25IYW5kQXJyWzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcclxuICAgICAgICAgICAgICAvLyB9LCAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICB0aGVDaGVja0Fyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgIC8vIH0sIDEwMDEpO1xyXG5cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IHBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyWzBdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkhhbmRBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoZUNoZWNrQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIC8vIH0sIDEwMDEpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvbkhhbmRBcnIgPSBvbkhhbmRBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiWW91J3JlIHB1c2hpbmcgdGhlIHNhbWUgb3ZlciBhbmQgb3ZlciBhZ2Fpbi5cIik7XHJcbiAgICAgICAgdGhlQ2hlY2tBcnIgPSB0aGVDaGVja0Fyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgY2xpY2tDb3VudGluZyAtPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmaW5kQ291bnRlci50ZXh0Q29udGVudCA9IGNsaWNrQ291bnRpbmc7XHJcbiAgfTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFRoZUNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRUaGVDYXJkc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2V0QXNGdW5jdGlvblRlc3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYWlyID0gcGFpckNoZWNrO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcldpbmRvdyhldmVudCkge1xyXG5cclxuICB2YXIgbW92YWJsZSA9IHJlcXVpcmUoXCIuL21vdmFibGVcIik7XHJcbiAgdmFyIHdpbmRvd0Rlc3Ryb3llciA9IHJlcXVpcmUoXCIuL3dpbmRvd0Rlc3Ryb3llclwiKTtcclxuICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZShcIi4vY3JlYXRlTWVtb3J5XCIpO1xyXG4gIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY3JlYXRlQ2hhdFwiKTtcclxuICB2YXIgY2hhdFNldHRpbmdzID0gcmVxdWlyZShcIi4vY2hhdFNldHRpbmdzXCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG51bWJlciA9IFwiXCI7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xyXG4gICAgdmFyIGZpbmROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmljb24xXCIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsxXSkge1xyXG4gICAgICAgIHJlbmRlck1lbSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcbiAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBmaW5kQWxsV2luZG93c1tpXS5jbGFzc0xpc3QuYWRkKFwid2luZG93LVwiICsgaSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ2hhdC5jaGF0KCk7XHJcbiAgICBjaGF0U2V0dGluZ3MuY2hhbmdlKCk7XHJcbiAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcclxuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuICAgICAgdmFyIGZpbmRBbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGZpbmRBbGxXaW5kb3dzW2ldLmNsYXNzTGlzdC5hZGQoXCJ3aW5kb3ctXCIgKyBpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY3JlYXRlTWVtb3J5LmNyZWF0ZSgpO1xyXG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG5cclxuICB9XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xyXG4iLCJmdW5jdGlvbiB0YXNrYmFyKCkge1xyXG4gIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGZpbmRUYXNrYmFyLmNsYXNzTGlzdC5hZGQoXCJ0YXNrLWFwcGVhclwiKTtcclxuICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYnJpbmdGb3J0aCA9IHRhc2tiYXI7XHJcbiIsImZ1bmN0aW9uIHdpbmRvd0Rlc3Ryb3llcigpIHtcclxuICB2YXIgZmluZEV4aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4aXRcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kRXhpdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgZmluZEV4aXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZGVzdHJveSA9IHdpbmRvd0Rlc3Ryb3llcjtcclxuIl19
