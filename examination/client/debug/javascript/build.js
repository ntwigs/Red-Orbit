(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

},{"./renderWindow":13,"./taskbar":15}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./chatSettings":2,"./checkNick":3}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
  var pairCounter = 0;
  var windows = document.querySelectorAll(".window");
  var winCheck = require("./winCheck");

  for (i = 0; i < container.length; i += 1) {
    counter++;
  }

  var cardsInWindow = container[counter - 1].querySelectorAll(".card");
  var counterInWindow = container[counter - 1].parentElement.querySelector(".clickCounter");

  for (i = 0; i < cardsInWindow.length; i += 1) {
  cardsInWindow[i].addEventListener("keypress", function() {
      if (event.keyCode === 13) {
        this.click();
      }
          event.preventDefault();
  });
      cardsInWindow[i].addEventListener("click", listener);
  }

  function listener(event) {

  if (clicks < 2) {

  clicks += 1;

  tries += 1;

  if (localStorage.theme !== "") {
    var lastTheme = localStorage.getItem("theme");
    this.style.backgroundImage = "url('../image/" + lastTheme + "/" + this.parentElement.className + ".png')";
  } else {
    this.style.backgroundImage = "url('../image/plain/0.png')";
  }

  //Här ska man kunna ändra vilken bilden ska vara.

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
      pairCounter = pairCounter -= 1;
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
            pairCounter += 1;
            if (pairCounter >= 8) {
              winCheck.win(counterInWindow);
            }
            }, 1000);
        } else {
          setTimeout(function() {

            if (localStorage.theme !== "") {
              var lastTheme = localStorage.getItem("theme");
              saveTarget[0].style.backgroundImage = "url('../image/" + lastTheme + "/0.png')";
              saveTarget[1].style.backgroundImage = "url('../image/" + lastTheme + "/0.png')";
            } else {
              saveTarget[0].style.backgroundImage = "url('../image/plain/0.png')";
              saveTarget[1].style.backgroundImage = "url('../image/plain/0.png')";
            }

            //Samma som grunden.
            console.log("NOT A PAIR");
            clicks = 0;
            }, 1000);
        }
      }
    }
  }
}
}



module.exports.check = checkPair;

},{"./winCheck":11}],7:[function(require,module,exports){
"use strict";

function createMemory() {

  var loadingCards = require("./loadingCards");
  loadingCards.load();

  var themeChanger = require("./themeChanger");
  themeChanger.change();

  var setCards = require("./setCards");
  setCards.set();

  var cardRandomizer = require("./cardRandomizer");
  cardRandomizer.run();

  var checkPair = require("./checkPair");
  checkPair.check();

}

module.exports.create = createMemory;

},{"./cardRandomizer":5,"./checkPair":6,"./loadingCards":8,"./setCards":9,"./themeChanger":10}],8:[function(require,module,exports){
function loadingCards() {
  var i = 0;
  var counter = 0;
  var windows = document.querySelectorAll(".window");
  var template = document.querySelector("#memory-template");
  var clone = document.importNode(template.content, true);
  var clickCounter = document.querySelectorAll(".clickCounter");

  for (i = 0; i < windows.length; i += 1) {
    counter++;
  }

  document.querySelectorAll(".window")[counter - 1].insertBefore(clone, clickCounter[counter - 1]);

}

module.exports.load = loadingCards;

},{}],9:[function(require,module,exports){
function setCards() {
  var cards = document.querySelectorAll(".card");
  var memWindows = document.querySelectorAll(".card-container");
  var counter = 0;
  var i = 0;

  for (i = 0; i < cards.length; i += 1) {
    if (window.getComputedStyle(cards[i]).getPropertyValue("background-image") === "none") {
      if (localStorage.theme !== "") {
        var lastTheme = localStorage.getItem("theme");
        cards[i].style.backgroundImage = "url('../image/" + lastTheme + "/0.png')";
      } else {
        cards[i].style.backgroundImage = "url('../image/plain/0.png')";
      }
      //Här kan man ändra grunden.
    }
  }

}

module.exports.set = setCards;

},{}],10:[function(require,module,exports){
function themeChanger() {
  var hasCards = document.querySelectorAll(".theme-selector");
  var themes = document.querySelectorAll(".picker-container");
  var counter = 0;
  var i = 0;

  for (i = 0; i < hasCards.length; i += 1) {
    counter++;
  }

  var cards = document.querySelectorAll(".card-container")[counter - 1].querySelectorAll(".card");

  hasCards[counter - 1].querySelectorAll(".picker-container")[0].addEventListener("click", function() {

    localStorage.setItem("theme", "plain");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/plain/0.png')";
    }

  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[1].addEventListener("click", function() {

    localStorage.setItem("theme", "red");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/red/0.png')";
    }

  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[2].addEventListener("click", function() {

    localStorage.setItem("theme", "blue");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/blue/0.png')";
    }
  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[3].addEventListener("click", function() {

    localStorage.setItem("theme", "green");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/green/0.png')";
    }
  });


  var themeButton = hasCards[counter - 1].parentElement.firstElementChild.firstElementChild;


  themeButton.addEventListener("click", bringTheme);


  function bringTheme(event) {

      if (event.target.parentElement.parentElement.children[1].classList.contains("theme-field-gone")) {
        event.target.parentElement.parentElement.children[1].classList.remove("theme-field-gone");
        event.target.parentElement.parentElement.children[2].classList.remove("card-container-after");
      } else {
        event.target.parentElement.parentElement.children[1].classList.add("theme-field-gone");
        event.target.parentElement.parentElement.children[2].classList.add("card-container-after");
      }

  }

}

module.exports.change = themeChanger;

},{}],11:[function(require,module,exports){
function winCheck(currentWindow, container) {
  var youWin = document.createTextNode("YOU WIN!");
  var breaking = document.createElement("BR");
  var ptag = document.createElement("P");
  ptag.appendChild(youWin);
  ptag.classList.add("winning-message");
  currentWindow.appendChild(breaking);
  currentWindow.appendChild(ptag);
  currentWindow.classList.add("present-click");
}

module.exports.win = winCheck;

},{}],12:[function(require,module,exports){
function movable() {


  var findWindows = document.querySelectorAll(".window");
  var i = 0;
  var counter = 0;

  function addListeners() {

      //Look for the window and add mousedown + and mouseup
      for (i = 0; i < findWindows.length; i += 1) {
        counter++;
      }

      findWindows[counter - 1].addEventListener("mousedown", mouseDown, false);

      window.addEventListener("mouseup", mouseUp, false);
  }

  function mouseDown(event) {

      if (event.target.className === "top") {
        aVarY = event.offsetY;
        aVarX = event.offsetX;
        saveTarget = event.target;
        window.addEventListener("mousemove", divMove, true);
        saveTarget.parentElement.style.opacity = 0.85;
      }
  }

  function mouseUp(event) {

    for (i = 0; i < findWindows.length; i += 1) {
      findWindows[i].style.opacity = 1;
    }

    window.removeEventListener("mousemove", divMove, true);
    
  }

  function divMove(event) {

    saveTarget.parentElement.style.top = event.y - aVarY + "px";
    saveTarget.parentElement.style.left = event.x - aVarX + "px";

  }

  addListeners();

};

module.exports.move = movable;

},{}],13:[function(require,module,exports){
"use strict";

function renderWindow(event) {

  var movable = require("./movable");
  var windowDestroyer = require("./windowDestroyer");
  var createMemory = require("./memory/createMemory");
  var createChat = require("./chat/createChat");
  var windowPlacement = require("./windowPlacement");
  var setZ = require("./setZ");

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

    windowPlacement.place();
    createChat.chat();
    movable.move();
    windowDestroyer.destroy();
    setZ.set();

  }

  function renderMem() {
      var template = document.querySelector("#window-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      windowPlacement.place();
      createMemory.create();
      movable.move();
      windowDestroyer.destroy();
      setZ.set();
  }


  }


module.exports.render = renderWindow;

},{"./chat/createChat":4,"./memory/createMemory":7,"./movable":12,"./setZ":14,"./windowDestroyer":16,"./windowPlacement":17}],14:[function(require,module,exports){
function setZ() {
  var windows = document.querySelectorAll(".window");
  var counter = 0;
  var i = 0;
  var j = 0;
  var newCounter = 0;
  var newArr = [];

  function higestZ(theWindows) {

    var glassSquare = document.querySelectorAll(theWindows);
    var highest = 0;

    for (var i = 0; i < glassSquare.length; i++) {
      var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");
      
      if ((zindex > highest) && (zindex !== "auto")) {
        highest = zindex;
      }

    }

    return highest;

  }

settingNe();

  function settingNe() {

    for (i = 0; i < windows.length; i += 1) {
      counter++;
    }

      windows[counter - 1].addEventListener("mousedown", function() {
        this.style.zIndex = parseInt(higestZ(".window")) + 1;
      });

  }

}

module.exports.set = setZ;

},{}],15:[function(require,module,exports){
function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],16:[function(require,module,exports){
function windowDestroyer() {
  var findExit = document.querySelectorAll(".exit");
  for (var i = 0; i < findExit.length; i += 1) {
    findExit[i].addEventListener("click", function(event) {
      event.target.parentElement.parentElement.parentElement.remove();
    });
  }
}

module.exports.destroy = windowDestroyer;

},{}],17:[function(require,module,exports){
function windowPlacement() {

  function whereToPlace() {
    var findAllWindows = document.querySelectorAll(".window");
    var counter = 0;

    for (i = 0; i < findAllWindows.length; i += 1) {
      counter++;
    }

    findAllWindows[counter - 1].style.top = "" + 30 * counter + "px";
    findAllWindows[counter - 1].style.left = "" + 30 * counter + "px";
  }

  whereToPlace();

  

}

module.exports.place = windowPlacement;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L2NhcmRSYW5kb21pemVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2hlY2tQYWlyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY3JlYXRlTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvbG9hZGluZ0NhcmRzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvc2V0Q2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS90aGVtZUNoYW5nZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS93aW5DaGVjay5qcyIsImNsaWVudC9zb3VyY2UvanMvbW92YWJsZS5qcyIsImNsaWVudC9zb3VyY2UvanMvcmVuZGVyV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9zZXRaLmpzIiwiY2xpZW50L3NvdXJjZS9qcy90YXNrYmFyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3dEZXN0cm95ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd1BsYWNlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XHJcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcclxuXHJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcclxudGFza2Jhci5icmluZ0ZvcnRoKCk7XHJcbiIsImZ1bmN0aW9uIGNoYXRTZXR0aW5ncyhldmVudCkge1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5pY2stY2hhbmdlclwiKTtcclxuICB2YXIgbmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgbmlja2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcclxuICB2YXIgayA9IDA7XHJcbiAgdmFyIGogPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuXHJcbiAgZm9yIChqID0gMDsgaiA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgaysrO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmluZEFuZFNldChldmVudCkge1xyXG5cclxuICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XHJcblxyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY2hhbmdlQnV0dG9uW2sgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XHJcbiIsImZ1bmN0aW9uIGNoZWNrTmljaygpIHtcclxuXHJcbiAgdmFyIG5pY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIHZhciBuaWNrbmFtZSA9IFwiXCI7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGsrKztcclxuICB9XHJcblxyXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XHJcbiAgICBuaWNrbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tOaWNrO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xyXG5cclxuICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xyXG4gIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcclxuICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xyXG4gIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZW50ZXJlZE1lc3NhZ2UgPSBcIlwiO1xyXG4gIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XHJcbiAgdmFyIGNoYXRTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NoYXRTZXR0aW5nc1wiKTtcclxuICB2YXIgbm9SZXBlYXRDb3VudGVyID0gMDtcclxuXHJcbiAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXR0ZXh0XCIpO1xyXG4gIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2hlY2tOaWNrLmNoZWNrKCk7XHJcbiAgICAgIG5vUmVwZWF0Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gKkhpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlICAtPiAqSXNoXHJcbiAgICBpZiAoZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUpO1xyXG4gICAgICAvLyBmb3IgKHZhciBqID0gMDsgaiA8IHRleHRDb250YWluZXIubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAvL3Rlc3RcclxuICAgICAgICBmaW5kTmFtZUZpZWxkW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZmluZFN1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLm5pY2tuYW1lICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICAgIGRhdGFbXCJkYXRhXCJdID0gZmluZFRleHRBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgIFwiZGF0YVwiIDogXCJcIixcclxuICAgIFwidXNlcm5hbWVcIjogXCJcIixcclxuICAgIFwiY2hhbm5lbFwiOiBcIlwiLFxyXG4gICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXHJcbiAgfTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlID0gXCJcIjtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uY2xpY2soKTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XHJcbiAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xyXG4gICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XHJcbiAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcclxuICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xyXG4gICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xyXG5cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgaWYgKGNoYXRVc2VyICE9PSBcIlwiICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKSB7XHJcbiAgICAgICAgICAgIGRpdlRhZ1RleHQuY2xhc3NMaXN0LmFkZChcInVzZXItc2VudFwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5hcHBlbmRDaGlsZChkaXZUYWdUZXh0KTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbFRvcCA9IHRleHRDb250YWluZXJbaV0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcclxuIiwiZnVuY3Rpb24gY2FyZFJhbmRvbWl6ZXIoKSB7XHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGNhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIGNhcmRBcnIgPSBbXTtcclxuICB2YXIgbmV3TnVtYmVyID0gMDtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcclxuICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcclxuICAgICAgY2FyZEFyci5wdXNoKGkgKyAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNodWZmbGUoY2FyZEFycikge1xyXG4gICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aCwgdCwgaTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxyXG4gICAgd2hpbGUgKG0pIHtcclxuXHJcbiAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxyXG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbS0tKTtcclxuXHJcbiAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgdCA9IGNhcmRBcnJbbV07XHJcbiAgICAgIGNhcmRBcnJbbV0gPSBjYXJkQXJyW2ldO1xyXG4gICAgICBjYXJkQXJyW2ldID0gdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZEFycjtcclxufVxyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgbmV3Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tQW5kU2V0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJhbmRvbUFuZFNldCgpIHtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgIHZhciB3aW5kb3dDb3VudCA9IDA7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgd2luZG93Q291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FyZHNJbldpbmRvd3MgPSB3aW5kb3dzW3dpbmRvd0NvdW50IC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XHJcbiAgICAgIG5ld051bWJlciA9IHNodWZmbGUoY2FyZEFycikuc3BsaWNlKDAsIDEpO1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICAgIGNhcmRzSW5XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQobmV3TnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMucnVuID0gY2FyZFJhbmRvbWl6ZXI7XHJcbiIsImZ1bmN0aW9uIGNoZWNrUGFpcigpIHtcclxuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuICB2YXIgdGFyZ2V0QXJyID0gW107XHJcbiAgdmFyIHNhdmVUYXJnZXQgPSBbXTtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcbiAgdmFyIGNsaWNrcyA9IDA7XHJcbiAgdmFyIHRyaWVzID0gMDtcclxuICB2YXIgcGFpckNvdW50ZXIgPSAwO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIHdpbkNoZWNrID0gcmVxdWlyZShcIi4vd2luQ2hlY2tcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBjb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIHZhciBjYXJkc0luV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcbiAgdmFyIGNvdW50ZXJJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGNhcmRzSW5XaW5kb3cubGVuZ3RoOyBpICs9IDEpIHtcclxuICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgICB9XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH0pO1xyXG4gICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsaXN0ZW5lcihldmVudCkge1xyXG5cclxuICBpZiAoY2xpY2tzIDwgMikge1xyXG5cclxuICBjbGlja3MgKz0gMTtcclxuXHJcbiAgdHJpZXMgKz0gMTtcclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGxhc3RUaGVtZSArIFwiL1wiICsgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSArIFwiLnBuZycpXCI7XHJcbiAgfSBlbHNlIHtcclxuICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcclxuICB9XHJcblxyXG4gIC8vSMOkciBza2EgbWFuIGt1bm5hIMOkbmRyYSB2aWxrZW4gYmlsZGVuIHNrYSB2YXJhLlxyXG5cclxuICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoID49IDIpIHtcclxuICAgICAgdGFyZ2V0QXJyLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEFyci5sZW5ndGggPCAyKSB7XHJcbiAgICAgIHRhcmdldEFyci5wdXNoKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRBcnJbMF0gPT09IHRhcmdldEFyclsxXSkge1xyXG4gICAgICB0YXJnZXRBcnIgPSB0YXJnZXRBcnIuc3BsaWNlKDAsIDEpO1xyXG4gICAgICBjbGlja3MgPSBjbGlja3MgLT0gMTtcclxuICAgICAgdHJpZXMgPSB0cmllcyAtPSAxO1xyXG4gICAgICBwYWlyQ291bnRlciA9IHBhaXJDb3VudGVyIC09IDE7XHJcbiAgICB9XHJcblxyXG4gICAgY291bnRlckluV2luZG93LnRleHRDb250ZW50ID0gdHJpZXM7XHJcblxyXG4gICAgICBpZiAodGFyZ2V0QXJyWzBdICE9PSB0YXJnZXRBcnJbMV0pIHtcclxuICAgICAgICBpZiAobmV3QXJyLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xyXG4gICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA8IDIpIHtcclxuICAgICAgICAgIGlmKHRhcmdldEFyclswXSAmJiB0YXJnZXRBcnJbMV0pIHtcclxuICAgICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucHVzaCh0aGlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKG5ld0Fyci5sZW5ndGggPj0gMikge1xyXG4gICAgICAgICAgICBuZXdBcnIubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldC5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgaWYgKG5ld0FyclswXSAmJiBuZXdBcnJbMV0pIHtcclxuICAgICAgICBpZiAobmV3QXJyWzBdID09PSBuZXdBcnJbMV0pIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQQUlSXCIpO1xyXG4gICAgICAgICAgICBjbGlja3MgPSAwO1xyXG4gICAgICAgICAgICBwYWlyQ291bnRlciArPSAxO1xyXG4gICAgICAgICAgICBpZiAocGFpckNvdW50ZXIgPj0gOCkge1xyXG4gICAgICAgICAgICAgIHdpbkNoZWNrLndpbihjb3VudGVySW5XaW5kb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgIHZhciBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vU2FtbWEgc29tIGdydW5kZW4uXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTk9UIEEgUEFJUlwiKTtcclxuICAgICAgICAgICAgY2xpY2tzID0gMDtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja1BhaXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xyXG5cclxuICB2YXIgbG9hZGluZ0NhcmRzID0gcmVxdWlyZShcIi4vbG9hZGluZ0NhcmRzXCIpO1xyXG4gIGxvYWRpbmdDYXJkcy5sb2FkKCk7XHJcblxyXG4gIHZhciB0aGVtZUNoYW5nZXIgPSByZXF1aXJlKFwiLi90aGVtZUNoYW5nZXJcIik7XHJcbiAgdGhlbWVDaGFuZ2VyLmNoYW5nZSgpO1xyXG5cclxuICB2YXIgc2V0Q2FyZHMgPSByZXF1aXJlKFwiLi9zZXRDYXJkc1wiKTtcclxuICBzZXRDYXJkcy5zZXQoKTtcclxuXHJcbiAgdmFyIGNhcmRSYW5kb21pemVyID0gcmVxdWlyZShcIi4vY2FyZFJhbmRvbWl6ZXJcIik7XHJcbiAgY2FyZFJhbmRvbWl6ZXIucnVuKCk7XHJcblxyXG4gIHZhciBjaGVja1BhaXIgPSByZXF1aXJlKFwiLi9jaGVja1BhaXJcIik7XHJcbiAgY2hlY2tQYWlyLmNoZWNrKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsImZ1bmN0aW9uIGxvYWRpbmdDYXJkcygpIHtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnktdGVtcGxhdGVcIik7XHJcbiAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICB2YXIgY2xpY2tDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jbGlja0NvdW50ZXJcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKVtjb3VudGVyIC0gMV0uaW5zZXJ0QmVmb3JlKGNsb25lLCBjbGlja0NvdW50ZXJbY291bnRlciAtIDFdKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkaW5nQ2FyZHM7XHJcbiIsImZ1bmN0aW9uIHNldENhcmRzKCkge1xyXG4gIHZhciBjYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcclxuICB2YXIgbWVtV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoY2FyZHNbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpID09PSBcIm5vbmVcIikge1xyXG4gICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICAgIH1cclxuICAgICAgLy9Iw6RyIGthbiBtYW4gw6RuZHJhIGdydW5kZW4uXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Q2FyZHM7XHJcbiIsImZ1bmN0aW9uIHRoZW1lQ2hhbmdlcigpIHtcclxuICB2YXIgaGFzQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRoZW1lLXNlbGVjdG9yXCIpO1xyXG4gIHZhciB0aGVtZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGhhc0NhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcblxyXG4gIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJwbGFpblwiKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcbiAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVsxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcInJlZFwiKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcmVkLzAucG5nJylcIjtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG4gIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJibHVlXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9ibHVlLzAucG5nJylcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVszXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcImdyZWVuXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9ncmVlbi8wLnBuZycpXCI7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxuICB2YXIgdGhlbWVCdXR0b24gPSBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcblxyXG4gIHRoZW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBicmluZ1RoZW1lKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGJyaW5nVGhlbWUoZXZlbnQpIHtcclxuXHJcbiAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcInRoZW1lLWZpZWxkLWdvbmVcIikpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0aGVtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnJlbW92ZShcImNhcmQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmFkZChcInRoZW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hhbmdlID0gdGhlbWVDaGFuZ2VyO1xyXG4iLCJmdW5jdGlvbiB3aW5DaGVjayhjdXJyZW50V2luZG93LCBjb250YWluZXIpIHtcclxuICB2YXIgeW91V2luID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJZT1UgV0lOIVwiKTtcclxuICB2YXIgYnJlYWtpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlJcIik7XHJcbiAgdmFyIHB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcclxuICBwdGFnLmFwcGVuZENoaWxkKHlvdVdpbik7XHJcbiAgcHRhZy5jbGFzc0xpc3QuYWRkKFwid2lubmluZy1tZXNzYWdlXCIpO1xyXG4gIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQoYnJlYWtpbmcpO1xyXG4gIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQocHRhZyk7XHJcbiAgY3VycmVudFdpbmRvdy5jbGFzc0xpc3QuYWRkKFwicHJlc2VudC1jbGlja1wiKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMud2luID0gd2luQ2hlY2s7XHJcbiIsImZ1bmN0aW9uIG1vdmFibGUoKSB7XHJcblxyXG5cclxuICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZpbmRXaW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xyXG5cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXAsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xyXG5cclxuICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUgPT09IFwidG9wXCIpIHtcclxuICAgICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XHJcbiAgICAgICAgYVZhclggPSBldmVudC5vZmZzZXRYO1xyXG4gICAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwLjg1O1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZVVwKGV2ZW50KSB7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRXaW5kb3dzW2ldLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XHJcblxyXG4gICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcclxuICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xyXG5cclxuICB9XHJcblxyXG4gIGFkZExpc3RlbmVycygpO1xyXG5cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzLm1vdmUgPSBtb3ZhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHJlbmRlcldpbmRvdyhldmVudCkge1xyXG5cclxuICB2YXIgbW92YWJsZSA9IHJlcXVpcmUoXCIuL21vdmFibGVcIik7XHJcbiAgdmFyIHdpbmRvd0Rlc3Ryb3llciA9IHJlcXVpcmUoXCIuL3dpbmRvd0Rlc3Ryb3llclwiKTtcclxuICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZShcIi4vbWVtb3J5L2NyZWF0ZU1lbW9yeVwiKTtcclxuICB2YXIgY3JlYXRlQ2hhdCA9IHJlcXVpcmUoXCIuL2NoYXQvY3JlYXRlQ2hhdFwiKTtcclxuICB2YXIgd2luZG93UGxhY2VtZW50ID0gcmVxdWlyZShcIi4vd2luZG93UGxhY2VtZW50XCIpO1xyXG4gIHZhciBzZXRaID0gcmVxdWlyZShcIi4vc2V0WlwiKTtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBudW1iZXIgPSBcIlwiO1xyXG5cclxuICBmdW5jdGlvbiBuYXZDbGljaygpIHtcclxuICAgIHZhciBmaW5kTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pY29uMVwiKTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZE5hdi5sZW5ndGg7IGkgKz0gMSkge1xyXG5cclxuICAgIGZpbmROYXZbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMF0pIHtcclxuICAgICAgICByZW5kZXIoKTtcclxuICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMV0pIHtcclxuICAgICAgICByZW5kZXJNZW0oKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcblxyXG4gICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XHJcbiAgICBjcmVhdGVDaGF0LmNoYXQoKTtcclxuICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICAgIHNldFouc2V0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcclxuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuXHJcbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xyXG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XHJcbiAgICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xyXG4gICAgICBzZXRaLnNldCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIH1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XHJcbiIsImZ1bmN0aW9uIHNldFooKSB7XHJcbiAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBqID0gMDtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcbiAgdmFyIG5ld0FyciA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiBoaWdlc3RaKHRoZVdpbmRvd3MpIHtcclxuXHJcbiAgICB2YXIgZ2xhc3NTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoZVdpbmRvd3MpO1xyXG4gICAgdmFyIGhpZ2hlc3QgPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2xhc3NTcXVhcmUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHppbmRleCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGdsYXNzU3F1YXJlW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiei1pbmRleFwiKTtcclxuICAgICAgXHJcbiAgICAgIGlmICgoemluZGV4ID4gaGlnaGVzdCkgJiYgKHppbmRleCAhPT0gXCJhdXRvXCIpKSB7XHJcbiAgICAgICAgaGlnaGVzdCA9IHppbmRleDtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gaGlnaGVzdDtcclxuXHJcbiAgfVxyXG5cclxuc2V0dGluZ05lKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHNldHRpbmdOZSgpIHtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIikpICsgMTtcclxuICAgICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldFo7XHJcbiIsImZ1bmN0aW9uIHRhc2tiYXIoKSB7XHJcbiAgdmFyIGZpbmRUYXNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgZmluZFRhc2tiYXIuY2xhc3NMaXN0LmFkZChcInRhc2stYXBwZWFyXCIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcclxuIiwiZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xyXG4gIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xyXG4iLCJmdW5jdGlvbiB3aW5kb3dQbGFjZW1lbnQoKSB7XHJcblxyXG4gIGZ1bmN0aW9uIHdoZXJlVG9QbGFjZSgpIHtcclxuICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gICAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyAzMCAqIGNvdW50ZXIgKyBcInB4XCI7XHJcbiAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyAzMCAqIGNvdW50ZXIgKyBcInB4XCI7XHJcbiAgfVxyXG5cclxuICB3aGVyZVRvUGxhY2UoKTtcclxuXHJcbiAgXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wbGFjZSA9IHdpbmRvd1BsYWNlbWVudDtcclxuIl19
