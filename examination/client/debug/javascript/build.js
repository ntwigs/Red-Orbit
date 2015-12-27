(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();


//Idag ska du fixa dina kort
//Fixa så att fönstrena placeras bättre när det kommer till världen.

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
    var counter = 0;

    for (i = 0; i < findAllWindows.length; i += 1) {
      counter++;
    }

    findAllWindows[counter - 1].style.top = "" + 30 * counter + "px";
    findAllWindows[counter - 1].style.left = "" + 30 * counter + "px";

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jYXJkQ2hlY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hlY2tOaWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVDaGF0LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL2xvYWRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbW92YWJsZS5qcyIsImNsaWVudC9zb3VyY2UvanMvcGFpckNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcmVuZGVyV2luZG93ID0gcmVxdWlyZShcIi4vcmVuZGVyV2luZG93XCIpO1xyXG5yZW5kZXJXaW5kb3cucmVuZGVyKCk7XHJcblxyXG52YXIgdGFza2JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XHJcbnRhc2tiYXIuYnJpbmdGb3J0aCgpO1xyXG5cclxuXHJcbi8vSWRhZyBza2EgZHUgZml4YSBkaW5hIGtvcnRcclxuLy9GaXhhIHPDpSBhdHQgZsO2bnN0cmVuYSBwbGFjZXJhcyBiw6R0dHJlIG7DpHIgZGV0IGtvbW1lciB0aWxsIHbDpHJsZGVuLlxyXG5cclxuLy8gdmFyIG1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeVwiKTtcclxuLy8gbWVtb3J5LmNyZWF0ZSgpO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGNhcmRDaGVjaygpIHtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBjYXJkQXJyID0gW107XHJcblxyXG5cclxuICB2YXIgZmluZEltZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcbiAgdmFyIGZpbmRJbWdJbnNpZGVXaW5kb3cgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvdyBpbWdcIik7XHJcblxyXG4gICAgY29uc29sZS5sb2coY2FyZEFycik7XHJcbiAgZnVuY3Rpb24gcmFuZG9taXppbmcoKSB7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2FsY3VsYXRpbmdDYXJkcy8yOyBpICs9IDEpIHtcclxuICAgICAgY2FyZEFyci5wdXNoKGkrMSk7XHJcbiAgICAgIGNhcmRBcnIucHVzaChpKzEpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtID0gY2FyZEFyci5sZW5ndGgsIHQsIGk7XHJcblxyXG4gICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGXigKZcclxuICAgIHdoaWxlIChtKSB7XHJcblxyXG4gICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnTigKZcclxuICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG0tLSk7XHJcblxyXG4gICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXHJcbiAgICAgIHQgPSBjYXJkQXJyW21dO1xyXG4gICAgICBjYXJkQXJyW21dID0gY2FyZEFycltpXTtcclxuICAgICAgY2FyZEFycltpXSA9IHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2FyZEFycjtcclxuICB9XHJcblxyXG4gIHZhciBzdG9yYWdlID0gW107XHJcbiAgdmFyIHJhbmRvbWl6ZXIgPSAwO1xyXG4gIHZhciByZW1vdmVUaGVOdW1iZXIgPSAwO1xyXG4gIHZhciBhbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIHRoZUNhcmRzID0gW107XHJcblxyXG4gIGNvbnNvbGUubG9nKFwiLS0tLVwiKTtcclxuXHJcbiAgLy8gY29uc29sZS5sb2coZmluZEltZy5sZW5ndGgvYWxsV2luZG93cy5sZW5ndGgpO1xyXG4gIHZhciBjYWxjdWxhdGluZ0NhcmRzID0gZmluZEltZy5sZW5ndGgvYWxsV2luZG93cy5sZW5ndGg7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBmaW5kSW1nSW5zaWRlV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgdGhlQ2FyZHMgPSByYW5kb21pemluZygpO1xyXG5cclxuICAgIGlmICh0aGVDYXJkc1tpXSAhPT0gMCkge1xyXG4gICAgICByZW1vdmVUaGVOdW1iZXIgPSB0aGVDYXJkcy5zcGxpY2UoMCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEltZ1tpXS5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgXCJpbWFnZS8wLnBuZ1wiKTtcclxuXHJcbiAgICBpZiAoIWZpbmRJbWdbaV0uaGFzQXR0cmlidXRlKFwiY2xhc3NcIikpIHtcclxuICAgICAgZmluZEltZ1tpXS5jbGFzc0xpc3QuYWRkKHJlbW92ZVRoZU51bWJlcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEltZ1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc3RvcmFnZS5wdXNoKGV2ZW50LnRhcmdldCk7XHJcblxyXG4gICAgICBpZiAoc3RvcmFnZS5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICBzdG9yYWdlLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgfSwgMTAwMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzdG9yYWdlWzBdID09PSBzdG9yYWdlWzFdKSB7XHJcbiAgICAgICAgc3RvcmFnZSA9IHN0b3JhZ2Uuc2xpY2UoMCwgLTEpO1xyXG4gICAgICB9IGVsc2UgaWYgKHN0b3JhZ2UubGVuZ3RoIDw9IDIpIHtcclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lmhhc0F0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpKSB7XHJcbiAgICAgICAgICBldmVudC50YXJnZXQuc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvXCIgKyBldmVudC50YXJnZXQuY2xhc3NOYW1lICsgXCIucG5nXCIgKTtcclxuXHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzdG9yYWdlLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICB9LCAxMDAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNhcmRDaGVjaztcclxuIiwiZnVuY3Rpb24gY2hhdFNldHRpbmdzKGV2ZW50KSB7XHJcbiAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmljay1jaGFuZ2VyXCIpO1xyXG4gIHZhciBuYW1lRmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBuaWNraW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xyXG4gIHZhciBrID0gMDtcclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIG5ld0FyciA9IFtdO1xyXG5cclxuICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlQnV0dG9uLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICBrKys7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaW5kQW5kU2V0KGV2ZW50KSB7XHJcbiAgICBcclxuICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XHJcblxyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY2hhbmdlQnV0dG9uW2sgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XHJcbiIsImZ1bmN0aW9uIGNoZWNrTmljaygpIHtcclxuXHJcbiAgdmFyIG5pY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIHZhciBuaWNrbmFtZSA9IFwiXCI7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGsrKztcclxuICB9XHJcblxyXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XHJcbiAgICBuaWNrbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcblxyXG4gIH0gZWxzZSB7XHJcbiAgICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrTmljaztcclxuIiwiZnVuY3Rpb24gY3JlYXRlQ2hhdCgpIHtcclxuXHJcbiAgdmFyIGZpbmRTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1Ym1pdFwiKTtcclxuICB2YXIgZmluZFRleHRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LW1lc3NcIik7XHJcbiAgdmFyIGZpbmROaWNrU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY2NlcHQtbmFtZVwiKTtcclxuICB2YXIgZmluZE5pY2tBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZmluZE5hbWVGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XHJcbiAgdmFyIGVudGVyZWRNZXNzYWdlID0gXCJcIjtcclxuICB2YXIgY2hlY2tOaWNrID0gcmVxdWlyZShcIi4vY2hlY2tOaWNrXCIpO1xyXG4gIHZhciBjaGF0U2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jaGF0U2V0dGluZ3NcIik7XHJcbiAgdmFyIG5vUmVwZWF0Q291bnRlciA9IDA7XHJcblxyXG4gIHZhciBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIiwgXCJjaGF0dGV4dFwiKTtcclxuICBjaGF0U2V0dGluZ3MuY2hhbmdlKCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNoZWNrTmljay5jaGVjaygpO1xyXG4gICAgICBub1JlcGVhdENvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIGZpbmROaWNrU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxyXG4gICAgaWYgKGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICBkYXRhW1widXNlcm5hbWVcIl0gPSBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmlja25hbWVcIiwgZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlKTtcclxuICAgICAgLy8gZm9yICh2YXIgaiA9IDA7IGogPCB0ZXh0Q29udGFpbmVyLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICAgICAgLy90ZXN0XHJcbiAgICAgICAgZmluZE5hbWVGaWVsZFtub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIHRleHRDb250YWluZXJbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZpbmRTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xyXG4gICAgICBkYXRhW1widXNlcm5hbWVcIl0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xyXG4gICAgICBkYXRhW1wiZGF0YVwiXSA9IGZpbmRUZXh0QXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXHJcbiAgICBcImRhdGFcIiA6IFwiXCIsXHJcbiAgICBcInVzZXJuYW1lXCI6IFwiXCIsXHJcbiAgICBcImNoYW5uZWxcIjogXCJcIixcclxuICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIlxyXG4gIH07XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PSAxMykge1xyXG4gICAgICAgIGZpbmRTdWJtaXRbY291bnRlciAtIDFdLmNsaWNrKCk7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICB2YXIgcFRhZ1VzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcclxuICAgIHZhciBwVGFnTWVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIGRpdlRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gICAgdmFyIGNoYXREYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5kYXRhO1xyXG4gICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcclxuICAgIHZhciBjcmVhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdERhdGEpO1xyXG4gICAgdmFyIGNyZWF0ZVVzZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0VXNlcik7XHJcbiAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcclxuICAgIHBUYWdNZXNzLmFwcGVuZENoaWxkKGNyZWF0ZVRleHQpO1xyXG4gICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnVXNlcik7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcclxuXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Q29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGlmIChjaGF0VXNlciAhPT0gXCJcIiAmJiBjaGF0RGF0YSAhPT0gXCJcIikge1xyXG5cclxuICAgICAgICAgIGlmIChjaGF0VXNlciA9PT0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSkge1xyXG4gICAgICAgICAgICBkaXZUYWdUZXh0LmNsYXNzTGlzdC5hZGQoXCJ1c2VyLXNlbnRcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRleHRDb250YWluZXJbaV0uYXBwZW5kQ2hpbGQoZGl2VGFnVGV4dCk7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5zY3JvbGxUb3AgPSB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbEhlaWdodDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hhdCA9IGNyZWF0ZUNoYXQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xyXG5cclxuICB2YXIgbG9hZENhcmRzID0gcmVxdWlyZShcIi4vbG9hZENhcmRzXCIpO1xyXG4gIGxvYWRDYXJkcy5jYXJkcyg0LCA0KTtcclxuXHJcbiAgdmFyIGNhcmRDaGVjayA9IHJlcXVpcmUoXCIuL2NhcmRDaGVja1wiKTtcclxuICBjYXJkQ2hlY2suY2hlY2soKTtcclxuXHJcbiAgdmFyIHBhaXJDaGVjayA9IHJlcXVpcmUoXCIuL3BhaXJDaGVja1wiKTtcclxuICBwYWlyQ2hlY2sucGFpcigpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlTWVtb3J5O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGxvYWRDYXJkcyhyb3dzLCBjYXJkcykge1xyXG5cclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBrID0gMDtcclxuICAvLyB2YXIgY2FyZFNvcnQgPSAtMTtcclxuXHJcbiAgdmFyIGNyZWF0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gIGNyZWF0ZUNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XHJcbiAgdmFyIGZpbmRDYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IHJvd3M7IGkgKz0gMSkge1xyXG4gICAgdmFyIGNhcmRSb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gICAgY2FyZFJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xyXG4gICAgZm9yIChqID0gMDsgaiA8IGNhcmRzOyBqICs9IDEpIHtcclxuICAgICAgdmFyIGNyZWF0ZUNhcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQVwiKTtcclxuICAgICAgY3JlYXRlQ2FyZC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiI1wiKTtcclxuICAgICAgdmFyIGNyZWF0ZUltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJJTUdcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuY2xhc3NMaXN0LmFkZChcImNhcmRcIik7XHJcbiAgICAgIGNyZWF0ZUNhcmQuYXBwZW5kQ2hpbGQoY3JlYXRlSW1nKTtcclxuICAgICAgY2FyZFJvdy5hcHBlbmRDaGlsZChjcmVhdGVDYXJkKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGsgPSAwOyBrIDwgZmluZENhcmRDb250YWluZXIubGVuZ3RoOyBrICs9IDEpIHtcclxuICAgICAgZmluZENhcmRDb250YWluZXJba10uYXBwZW5kQ2hpbGQoY2FyZFJvdyk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgdmFyIGZpbmRBbGxDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcclxuXHJcblxyXG4vL0ZvciBsYXRlciB1c2VcclxuICAvLyBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCAlIDIgIT09IDApIHtcclxuICAvLyAgIHRocm93IG5ldyBFcnJvcihcIm5vXCIpO1xyXG4gIC8vIH0gZWxzZSBpZiAoZmluZEFsbENhcmRzLmxlbmd0aCA+IDE2KSB7XHJcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueVwiKTtcclxuICAvLyB9IGVsc2UgaWYgKGZpbmRBbGxDYXJkcy5sZW5ndGggPCA0KSB7XHJcbiAgLy8gICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gZmV3XCIpO1xyXG4gIC8vIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNhcmRzID0gbG9hZENhcmRzO1xyXG4iLCJmdW5jdGlvbiBtb3ZhYmxlKCkge1xyXG5cclxuXHJcbiAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGkgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBmaW5kV2luZG93c1tpXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcCwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VVcChldmVudCkge1xyXG4gICAgICAvL1doZW4gcmVsZWFzaW5nIG1vdXNlLlxyXG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcclxuICAgICAgLy8gZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUuekluZGV4ID0gXCI5OThcIjtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xyXG5cclxuICAgIC8vU2F2aW5nIGNvb3JkaW5hdGVzIG9uIGNsaWNrLlxyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09IFwidG9wXCIpIHtcclxuICAgICAgYVZhclkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgICBhVmFyWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XHJcblxyXG4gICAgICAvL1J1bnMgbW91c2Vtb3ZlIC0gaWYgZHJhZ2dpbmcgb24gdGhlIHJpZ2h0IHBsYWNlXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZGl2TW92ZShldmVudCkge1xyXG5cclxuICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBldmVudC55IC0gYVZhclkgKyBcInB4XCI7XHJcbiAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnggLSBhVmFyWCArIFwicHhcIjtcclxuXHJcbiAgfVxyXG5cclxuICBhZGRMaXN0ZW5lcnMoKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tb3ZlID0gbW92YWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBwYWlyQ2hlY2soKSB7XHJcbiAgdmFyIGZpbmRUaGVDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCJpbWdcIik7XHJcbiAgdmFyIGZpbmRDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XHJcbiAgdmFyIGNsaWNrQ291bnRpbmcgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgb25IYW5kQXJyID0gW107XHJcbiAgdmFyIHRoZUNoZWNrQXJyID0gW107XHJcblxyXG4gIHZhciBzZXRBc0Z1bmN0aW9uVGVzdCA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblxyXG4gICAgY2xpY2tDb3VudGluZyArPSAxO1xyXG5cclxuICAgIHRoZUNoZWNrQXJyLnB1c2goZXZlbnQudGFyZ2V0KTtcclxuICAgIG9uSGFuZEFyci5wdXNoKGV2ZW50LnRhcmdldCk7XHJcblxyXG5cclxuICAgIGlmICh0aGVDaGVja0FyclswXSAmJiB0aGVDaGVja0FyclsxXSkge1xyXG5cclxuICAgICAgaWYgKHRoZUNoZWNrQXJyWzBdICE9PSB0aGVDaGVja0FyclsxXSkge1xyXG5cclxuICAgICAgICAgIGlmIChvbkhhbmRBcnJbMF0gJiYgb25IYW5kQXJyWzFdKSB7XHJcbiAgICAgICAgICAgIGlmIChvbkhhbmRBcnJbMl0gIT09IHVuZGVmaW5lZCAmJiBvbkhhbmRBcnJbMl0gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBvbkhhbmRBcnIgPSBvbkhhbmRBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBpZiAob25IYW5kQXJyWzBdICE9PSB1bmRlZmluZWQgJiYgb25IYW5kQXJyWzFdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBpZiAob25IYW5kQXJyWzBdLmNsYXNzTmFtZSA9PT0gb25IYW5kQXJyWzFdLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJwYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMF0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICAgICAgb25IYW5kQXJyWzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcclxuICAgICAgICAgICAgICAvLyB9LCAxMDAwKTtcclxuXHJcbiAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgIG9uSGFuZEFyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgICB0aGVDaGVja0Fyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgIC8vIH0sIDEwMDEpO1xyXG5cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibm90IHBhaXJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgb25IYW5kQXJyWzBdLnNldEF0dHJpYnV0ZShcInNyY1wiLCBcImltYWdlLzAucG5nXCIpO1xyXG4gICAgICAgICAgICAgICAgICBvbkhhbmRBcnJbMV0uc2V0QXR0cmlidXRlKFwic3JjXCIsIFwiaW1hZ2UvMC5wbmdcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgLy8gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkhhbmRBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgIHRoZUNoZWNrQXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIC8vIH0sIDEwMDEpO1xyXG5cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIDEwMDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBvbkhhbmRBcnIgPSBvbkhhbmRBcnIuc2xpY2UoMCwgLTEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiWW91J3JlIHB1c2hpbmcgdGhlIHNhbWUgb3ZlciBhbmQgb3ZlciBhZ2Fpbi5cIik7XHJcbiAgICAgICAgdGhlQ2hlY2tBcnIgPSB0aGVDaGVja0Fyci5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgY2xpY2tDb3VudGluZyAtPSAxO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmaW5kQ291bnRlci50ZXh0Q29udGVudCA9IGNsaWNrQ291bnRpbmc7XHJcbiAgfTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFRoZUNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRUaGVDYXJkc1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgc2V0QXNGdW5jdGlvblRlc3QpO1xyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wYWlyID0gcGFpckNoZWNrO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcldpbmRvdyhldmVudCkge1xyXG5cclxuICB2YXIgbW92YWJsZSA9IHJlcXVpcmUoXCIuL21vdmFibGVcIik7XHJcbiAgdmFyIHdpbmRvd0Rlc3Ryb3llciA9IHJlcXVpcmUoXCIuL3dpbmRvd0Rlc3Ryb3llclwiKTtcclxuICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZShcIi4vY3JlYXRlTWVtb3J5XCIpO1xyXG4gIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY3JlYXRlQ2hhdFwiKTtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBudW1iZXIgPSBcIlwiO1xyXG5cclxuICBmdW5jdGlvbiBuYXZDbGljaygpIHtcclxuICAgIHZhciBmaW5kTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pY29uMVwiKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZE5hdi5sZW5ndGg7IGkgKz0gMSkge1xyXG5cclxuICAgIGZpbmROYXZbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMF0pIHtcclxuICAgICAgICByZW5kZXIoKTtcclxuICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMV0pIHtcclxuICAgICAgICByZW5kZXJNZW0oKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcbiAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZEFsbFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgMzAgKiBjb3VudGVyICsgXCJweFwiO1xyXG4gICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgMzAgKiBjb3VudGVyICsgXCJweFwiO1xyXG5cclxuICAgIGNyZWF0ZUNoYXQuY2hhdCgpO1xyXG4gICAgbW92YWJsZS5tb3ZlKCk7XHJcbiAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlck1lbSgpIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3ctdGVtcGxhdGVcIik7XHJcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcbiAgICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZEFsbFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBmaW5kQWxsV2luZG93c1tpXS5jbGFzc0xpc3QuYWRkKFwid2luZG93LVwiICsgaSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNyZWF0ZU1lbW9yeS5jcmVhdGUoKTtcclxuICAgICAgbW92YWJsZS5tb3ZlKCk7XHJcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlciA9IHJlbmRlcldpbmRvdztcclxuIiwiZnVuY3Rpb24gdGFza2JhcigpIHtcclxuICB2YXIgZmluZFRhc2tiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmJyaW5nRm9ydGggPSB0YXNrYmFyO1xyXG4iLCJmdW5jdGlvbiB3aW5kb3dEZXN0cm95ZXIoKSB7XHJcbiAgdmFyIGZpbmRFeGl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leGl0XCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZEV4aXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGZpbmRFeGl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSB3aW5kb3dEZXN0cm95ZXI7XHJcbiJdfQ==
