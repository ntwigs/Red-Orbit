(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

},{"./renderWindow":16,"./taskbar":18}],2:[function(require,module,exports){
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
function colorSchemeer() {

  var loadScheme = require("./loadScheme");
  loadScheme.load();

  var fetchColor = require("./fetchColor");
  fetchColor.fetch();

}

module.exports.initialize = colorSchemeer;

},{"./fetchColor":6,"./loadScheme":7}],6:[function(require,module,exports){
function fetchColor() {
  var hexSquare = document.querySelectorAll(".color-row input");
  var hexContain = document.querySelectorAll(".color-container");
  var counter = 0;
  var newCounter = 0;
  var i = 0;

  for (i = 0; i < hexContain.length; i += 1) {
    counter++;
  }

  var hexIn = hexContain[counter - 1].querySelectorAll(".color-row input");

  for (i = 0; i < hexIn.length; i += 1) {
    // if (hexIn[i].value.length === 5) {
    //   hexIn[i].parentElement.children[0].style.backgroundColor = "#" + this.value + "0";
    // }

    newCounter++;


    hexIn[i].addEventListener("keydown", function() {

        this.addEventListener("keyup", function() {

          if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {
            this.value = "#" + this.value;
            this.parentElement.children[0].style.backgroundColor = this.value;
          } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {
              this.parentElement.children[0].style.backgroundColor = this.value;
          } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {
              this.value = "#" + this.value.slice(0, -1);
          }

          //Check if entered text is valid hex.
          var reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

          if (this.value.length === 7) {

            if (!reg.test(this.value)) {
              this.style.backgroundColor = "red";
            } else {
              this.style.backgroundColor = "green";
            }

          } else if (this.value.length < 7) {

            this.style.backgroundColor = "white";

          }

        });

    });
  }

}

module.exports.fetch = fetchColor;

},{}],7:[function(require,module,exports){
function loadScheme() {
  // var findSquare = document.querySelectorAll(".design-square");
  // var counter = 0;
  // var i = 0;
  //
  // for (i = 0; i < findSquare.length; i += 1) {
  //   counter++;
  // }
  //
  // findSquare[counter - 1].

}

module.exports.load = loadScheme;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

  var getWindow = this.parentElement.parentElement.parentElement.parentElement;
  var currentTheme = getWindow.getAttribute("data-theme");

  // if (localStorage.theme !== "") {
    this.style.backgroundImage = "url('../image/" + currentTheme + "/" + this.parentElement.className + ".png')";
  // } else {
  //   this.style.backgroundImage = "url('../image/plain/0.png')";
  // }

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
              // var lastTheme = localStorage.getItem("theme");
              saveTarget[0].style.backgroundImage = "url('../image/" + currentTheme + "/0.png')";
              saveTarget[1].style.backgroundImage = "url('../image/" + currentTheme + "/0.png')";
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

},{"./winCheck":14}],10:[function(require,module,exports){
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

},{"./cardRandomizer":8,"./checkPair":9,"./loadingCards":11,"./setCards":12,"./themeChanger":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
function setCards() {
  var cards = document.querySelectorAll(".card");
  var memWindows = document.querySelectorAll(".card-container");
  var counter = 0;
  var i = 0;

  for (i = 0; i < memWindows.length; i += 1) {
    counter++;
  }

  if (localStorage.theme !== "") {
    var lastTheme = localStorage.getItem("theme");
    memWindows[counter - 1].parentElement.setAttribute("data-theme", lastTheme);
  } else {
    memWindows[counter - 1].parentElement.setAttribute("data-theme", "plain");
  }



  for (i = 0; i < cards.length; i += 1) {
    if (window.getComputedStyle(cards[i]).getPropertyValue("background-image") === "none") {
      if (localStorage.theme !== "") {
        lastTheme = localStorage.getItem("theme");
        cards[i].style.backgroundImage = "url('../image/" + lastTheme + "/0.png')";
      } else {
        cards[i].style.backgroundImage = "url('../image/plain/0.png')";
      }
      //Här kan man ändra grunden.
    }
  }

}

module.exports.set = setCards;

},{}],13:[function(require,module,exports){
function themeChanger() {
  var hasCards = document.querySelectorAll(".theme-selector");
  var themes = document.querySelectorAll(".picker-container");
  var allCards = document.querySelectorAll(".card");
  var counter = 0;
  var i = 0;

  for (i = 0; i < hasCards.length; i += 1) {
    counter++;
  }

  var cards = document.querySelectorAll(".card-container")[counter - 1].querySelectorAll(".card");

  hasCards[counter - 1].querySelectorAll(".picker-container")[0].addEventListener("click", function() {

    localStorage.setItem("theme", "plain");

    this.parentElement.parentElement.setAttribute("data-theme", "plain");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/plain/0.png')";
    }

  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[1].addEventListener("click", function() {

    localStorage.setItem("theme", "red");

    this.parentElement.parentElement.setAttribute("data-theme", "red");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/red/0.png')";
    }

  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[2].addEventListener("click", function() {

    localStorage.setItem("theme", "blue");

    this.parentElement.parentElement.setAttribute("data-theme", "blue");

    for (i = 0; cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/blue/0.png')";
    }
  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[3].addEventListener("click", function() {

    localStorage.setItem("theme", "green");

    this.parentElement.parentElement.setAttribute("data-theme", "green");

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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
"use strict";

function renderWindow(event) {

  var movable = require("./movable");
  var windowDestroyer = require("./windowDestroyer");
  var createMemory = require("./memory/createMemory");
  var createChat = require("./chat/createChat");
  var colorSchemeer = require("./colorSchemeer/colorSchemeer");
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
      } else if (event.target === findNav[2]) {
        renderSchemee();
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

  function renderSchemee() {
      var template = document.querySelector("#schemee-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      windowPlacement.place();
      colorSchemeer.initialize();
      movable.move();
      windowDestroyer.destroy();
      setZ.set();
  }


  }


module.exports.render = renderWindow;

},{"./chat/createChat":4,"./colorSchemeer/colorSchemeer":5,"./memory/createMemory":10,"./movable":15,"./setZ":17,"./windowDestroyer":19,"./windowPlacement":20}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],19:[function(require,module,exports){
function windowDestroyer() {
  var findExit = document.querySelectorAll(".exit");
  for (var i = 0; i < findExit.length; i += 1) {
    findExit[i].addEventListener("click", function(event) {
      event.target.parentElement.parentElement.parentElement.remove();
    });
  }
}

module.exports.destroy = windowDestroyer;

},{}],20:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L2NhcmRSYW5kb21pemVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2hlY2tQYWlyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY3JlYXRlTWVtb3J5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvbG9hZGluZ0NhcmRzLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvc2V0Q2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS90aGVtZUNoYW5nZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS93aW5DaGVjay5qcyIsImNsaWVudC9zb3VyY2UvanMvbW92YWJsZS5qcyIsImNsaWVudC9zb3VyY2UvanMvcmVuZGVyV2luZG93LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9zZXRaLmpzIiwiY2xpZW50L3NvdXJjZS9qcy90YXNrYmFyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy93aW5kb3dEZXN0cm95ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd1BsYWNlbWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XHJcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcclxuXHJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcclxudGFza2Jhci5icmluZ0ZvcnRoKCk7XHJcbiIsImZ1bmN0aW9uIGNoYXRTZXR0aW5ncyhldmVudCkge1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5pY2stY2hhbmdlclwiKTtcclxuICB2YXIgbmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgbmlja2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcclxuICB2YXIgayA9IDA7XHJcbiAgdmFyIGogPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuXHJcbiAgZm9yIChqID0gMDsgaiA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgaysrO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmluZEFuZFNldChldmVudCkge1xyXG5cclxuICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XHJcblxyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY2hhbmdlQnV0dG9uW2sgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XHJcbiIsImZ1bmN0aW9uIGNoZWNrTmljaygpIHtcclxuXHJcbiAgdmFyIG5pY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGsgPSAwO1xyXG4gIHZhciBuaWNrbmFtZSA9IFwiXCI7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGsrKztcclxuICB9XHJcblxyXG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XHJcbiAgICBuaWNrbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgfSBlbHNlIHtcclxuICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tOaWNrO1xyXG4iLCJmdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xyXG5cclxuICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xyXG4gIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcclxuICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xyXG4gIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZW50ZXJlZE1lc3NhZ2UgPSBcIlwiO1xyXG4gIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XHJcbiAgdmFyIGNoYXRTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NoYXRTZXR0aW5nc1wiKTtcclxuICB2YXIgbm9SZXBlYXRDb3VudGVyID0gMDtcclxuXHJcbiAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXR0ZXh0XCIpO1xyXG4gIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2hlY2tOaWNrLmNoZWNrKCk7XHJcbiAgICAgIG5vUmVwZWF0Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gKkhpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlICAtPiAqSXNoXHJcbiAgICBpZiAoZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUpO1xyXG4gICAgICAvLyBmb3IgKHZhciBqID0gMDsgaiA8IHRleHRDb250YWluZXIubGVuZ3RoOyBqICs9IDEpIHtcclxuICAgICAgICAvL3Rlc3RcclxuICAgICAgICBmaW5kTmFtZUZpZWxkW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZmluZFN1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLm5pY2tuYW1lICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICAgIGRhdGFbXCJkYXRhXCJdID0gZmluZFRleHRBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgIFwiZGF0YVwiIDogXCJcIixcclxuICAgIFwidXNlcm5hbWVcIjogXCJcIixcclxuICAgIFwiY2hhbm5lbFwiOiBcIlwiLFxyXG4gICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiXHJcbiAgfTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlID0gXCJcIjtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uY2xpY2soKTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XHJcbiAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xyXG4gICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XHJcbiAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcclxuICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xyXG4gICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xyXG5cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgaWYgKGNoYXRVc2VyICE9PSBcIlwiICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKSB7XHJcbiAgICAgICAgICAgIGRpdlRhZ1RleHQuY2xhc3NMaXN0LmFkZChcInVzZXItc2VudFwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5hcHBlbmRDaGlsZChkaXZUYWdUZXh0KTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbFRvcCA9IHRleHRDb250YWluZXJbaV0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcclxuIiwiZnVuY3Rpb24gY29sb3JTY2hlbWVlcigpIHtcclxuXHJcbiAgdmFyIGxvYWRTY2hlbWUgPSByZXF1aXJlKFwiLi9sb2FkU2NoZW1lXCIpO1xyXG4gIGxvYWRTY2hlbWUubG9hZCgpO1xyXG5cclxuICB2YXIgZmV0Y2hDb2xvciA9IHJlcXVpcmUoXCIuL2ZldGNoQ29sb3JcIik7XHJcbiAgZmV0Y2hDb2xvci5mZXRjaCgpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGNvbG9yU2NoZW1lZXI7XHJcbiIsImZ1bmN0aW9uIGZldGNoQ29sb3IoKSB7XHJcbiAgdmFyIGhleFNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xyXG4gIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jb2xvci1jb250YWluZXJcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBuZXdDb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBoZXhDb250YWluLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICB2YXIgaGV4SW4gPSBoZXhDb250YWluW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLXJvdyBpbnB1dFwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGhleEluLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAvLyBpZiAoaGV4SW5baV0udmFsdWUubGVuZ3RoID09PSA1KSB7XHJcbiAgICAvLyAgIGhleEluW2ldLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjXCIgKyB0aGlzLnZhbHVlICsgXCIwXCI7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgbmV3Q291bnRlcisrO1xyXG5cclxuXHJcbiAgICBoZXhJbltpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA2ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA+PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZS5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxyXG4gICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVnLnRlc3QodGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmVkXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcImdyZWVuXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5mZXRjaCA9IGZldGNoQ29sb3I7XHJcbiIsImZ1bmN0aW9uIGxvYWRTY2hlbWUoKSB7XHJcbiAgLy8gdmFyIGZpbmRTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRlc2lnbi1zcXVhcmVcIik7XHJcbiAgLy8gdmFyIGNvdW50ZXIgPSAwO1xyXG4gIC8vIHZhciBpID0gMDtcclxuICAvL1xyXG4gIC8vIGZvciAoaSA9IDA7IGkgPCBmaW5kU3F1YXJlLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgLy8gICBjb3VudGVyKys7XHJcbiAgLy8gfVxyXG4gIC8vXHJcbiAgLy8gZmluZFNxdWFyZVtjb3VudGVyIC0gMV0uXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcclxuIiwiZnVuY3Rpb24gY2FyZFJhbmRvbWl6ZXIoKSB7XHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGNhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIGNhcmRBcnIgPSBbXTtcclxuICB2YXIgbmV3TnVtYmVyID0gMDtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcclxuICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcclxuICAgICAgY2FyZEFyci5wdXNoKGkgKyAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNodWZmbGUoY2FyZEFycikge1xyXG4gICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aCwgdCwgaTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxyXG4gICAgd2hpbGUgKG0pIHtcclxuXHJcbiAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxyXG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbS0tKTtcclxuXHJcbiAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgdCA9IGNhcmRBcnJbbV07XHJcbiAgICAgIGNhcmRBcnJbbV0gPSBjYXJkQXJyW2ldO1xyXG4gICAgICBjYXJkQXJyW2ldID0gdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZEFycjtcclxufVxyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgbmV3Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tQW5kU2V0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJhbmRvbUFuZFNldCgpIHtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgIHZhciB3aW5kb3dDb3VudCA9IDA7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgd2luZG93Q291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FyZHNJbldpbmRvd3MgPSB3aW5kb3dzW3dpbmRvd0NvdW50IC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XHJcbiAgICAgIG5ld051bWJlciA9IHNodWZmbGUoY2FyZEFycikuc3BsaWNlKDAsIDEpO1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICAgIGNhcmRzSW5XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQobmV3TnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMucnVuID0gY2FyZFJhbmRvbWl6ZXI7XHJcbiIsImZ1bmN0aW9uIGNoZWNrUGFpcigpIHtcclxuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuICB2YXIgdGFyZ2V0QXJyID0gW107XHJcbiAgdmFyIHNhdmVUYXJnZXQgPSBbXTtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcbiAgdmFyIGNsaWNrcyA9IDA7XHJcbiAgdmFyIHRyaWVzID0gMDtcclxuICB2YXIgcGFpckNvdW50ZXIgPSAwO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIHdpbkNoZWNrID0gcmVxdWlyZShcIi4vd2luQ2hlY2tcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBjb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIHZhciBjYXJkc0luV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcbiAgdmFyIGNvdW50ZXJJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGNhcmRzSW5XaW5kb3cubGVuZ3RoOyBpICs9IDEpIHtcclxuICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgdGhpcy5jbGljaygpO1xyXG4gICAgICB9XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIH0pO1xyXG4gICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBsaXN0ZW5lcihldmVudCkge1xyXG5cclxuICBpZiAoY2xpY2tzIDwgMikge1xyXG5cclxuICBjbGlja3MgKz0gMTtcclxuXHJcbiAgdHJpZXMgKz0gMTtcclxuXHJcbiAgdmFyIGdldFdpbmRvdyA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICB2YXIgY3VycmVudFRoZW1lID0gZ2V0V2luZG93LmdldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIik7XHJcblxyXG4gIC8vIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcclxuICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvXCIgKyB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lICsgXCIucG5nJylcIjtcclxuICAvLyB9IGVsc2Uge1xyXG4gIC8vICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xyXG4gIC8vIH1cclxuXHJcbiAgLy9Iw6RyIHNrYSBtYW4ga3VubmEgw6RuZHJhIHZpbGtlbiBiaWxkZW4gc2thIHZhcmEuXHJcblxyXG4gICAgaWYgKHRhcmdldEFyci5sZW5ndGggPj0gMikge1xyXG4gICAgICB0YXJnZXRBcnIubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA8IDIpIHtcclxuICAgICAgdGFyZ2V0QXJyLnB1c2godGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEFyclswXSA9PT0gdGFyZ2V0QXJyWzFdKSB7XHJcbiAgICAgIHRhcmdldEFyciA9IHRhcmdldEFyci5zcGxpY2UoMCwgMSk7XHJcbiAgICAgIGNsaWNrcyA9IGNsaWNrcyAtPSAxO1xyXG4gICAgICB0cmllcyA9IHRyaWVzIC09IDE7XHJcbiAgICAgIHBhaXJDb3VudGVyID0gcGFpckNvdW50ZXIgLT0gMTtcclxuICAgIH1cclxuXHJcbiAgICBjb3VudGVySW5XaW5kb3cudGV4dENvbnRlbnQgPSB0cmllcztcclxuXHJcbiAgICAgIGlmICh0YXJnZXRBcnJbMF0gIT09IHRhcmdldEFyclsxXSkge1xyXG4gICAgICAgIGlmIChuZXdBcnIubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XHJcbiAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgaWYodGFyZ2V0QXJyWzBdICYmIHRhcmdldEFyclsxXSkge1xyXG4gICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgIG5ld0Fyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICBpZiAobmV3QXJyWzBdICYmIG5ld0FyclsxXSkge1xyXG4gICAgICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBBSVJcIik7XHJcbiAgICAgICAgICAgIGNsaWNrcyA9IDA7XHJcbiAgICAgICAgICAgIHBhaXJDb3VudGVyICs9IDE7XHJcbiAgICAgICAgICAgIGlmIChwYWlyQ291bnRlciA+PSA4KSB7XHJcbiAgICAgICAgICAgICAgd2luQ2hlY2sud2luKGNvdW50ZXJJbldpbmRvdyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgLy8gdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi8wLnBuZycpXCI7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi8wLnBuZycpXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9TYW1tYSBzb20gZ3J1bmRlbi5cclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJOT1QgQSBQQUlSXCIpO1xyXG4gICAgICAgICAgICBjbGlja3MgPSAwO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxufVxyXG5cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrUGFpcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XHJcblxyXG4gIHZhciBsb2FkaW5nQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkaW5nQ2FyZHNcIik7XHJcbiAgbG9hZGluZ0NhcmRzLmxvYWQoKTtcclxuXHJcbiAgdmFyIHRoZW1lQ2hhbmdlciA9IHJlcXVpcmUoXCIuL3RoZW1lQ2hhbmdlclwiKTtcclxuICB0aGVtZUNoYW5nZXIuY2hhbmdlKCk7XHJcblxyXG4gIHZhciBzZXRDYXJkcyA9IHJlcXVpcmUoXCIuL3NldENhcmRzXCIpO1xyXG4gIHNldENhcmRzLnNldCgpO1xyXG5cclxuICB2YXIgY2FyZFJhbmRvbWl6ZXIgPSByZXF1aXJlKFwiLi9jYXJkUmFuZG9taXplclwiKTtcclxuICBjYXJkUmFuZG9taXplci5ydW4oKTtcclxuXHJcbiAgdmFyIGNoZWNrUGFpciA9IHJlcXVpcmUoXCIuL2NoZWNrUGFpclwiKTtcclxuICBjaGVja1BhaXIuY2hlY2soKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZU1lbW9yeTtcclxuIiwiZnVuY3Rpb24gbG9hZGluZ0NhcmRzKCkge1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeS10ZW1wbGF0ZVwiKTtcclxuICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gIHZhciBjbGlja0NvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNsaWNrQ291bnRlclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIGNsaWNrQ291bnRlcltjb3VudGVyIC0gMV0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRpbmdDYXJkcztcclxuIiwiZnVuY3Rpb24gc2V0Q2FyZHMoKSB7XHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciBtZW1XaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgbWVtV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICBtZW1XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgbGFzdFRoZW1lKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbWVtV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwicGxhaW5cIik7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhcmRzW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1pbWFnZVwiKSA9PT0gXCJub25lXCIpIHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICAgIH1cclxuICAgICAgLy9Iw6RyIGthbiBtYW4gw6RuZHJhIGdydW5kZW4uXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Q2FyZHM7XHJcbiIsImZ1bmN0aW9uIHRoZW1lQ2hhbmdlcigpIHtcclxuICB2YXIgaGFzQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRoZW1lLXNlbGVjdG9yXCIpO1xyXG4gIHZhciB0aGVtZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIik7XHJcbiAgdmFyIGFsbENhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciBjb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBoYXNDYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKVtjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwicGxhaW5cIik7XHJcblxyXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwicmVkXCIpO1xyXG5cclxuICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJyZWRcIik7XHJcblxyXG4gICAgZm9yIChpID0gMDsgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3JlZC8wLnBuZycpXCI7XHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwiYmx1ZVwiKTtcclxuXHJcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiYmx1ZVwiKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvYmx1ZS8wLnBuZycpXCI7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbM10uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJncmVlblwiKTtcclxuXHJcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiZ3JlZW5cIik7XHJcblxyXG4gICAgZm9yIChpID0gMDsgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL2dyZWVuLzAucG5nJylcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcblxyXG4gIHZhciB0aGVtZUJ1dHRvbiA9IGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuXHJcbiAgdGhlbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJyaW5nVGhlbWUpO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gYnJpbmdUaGVtZShldmVudCkge1xyXG5cclxuICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwidGhlbWUtZmllbGQtZ29uZVwiKSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcInRoZW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwidGhlbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5hZGQoXCJjYXJkLWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSB0aGVtZUNoYW5nZXI7XHJcbiIsImZ1bmN0aW9uIHdpbkNoZWNrKGN1cnJlbnRXaW5kb3csIGNvbnRhaW5lcikge1xyXG4gIHZhciB5b3VXaW4gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllPVSBXSU4hXCIpO1xyXG4gIHZhciBicmVha2luZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCUlwiKTtcclxuICB2YXIgcHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gIHB0YWcuYXBwZW5kQ2hpbGQoeW91V2luKTtcclxuICBwdGFnLmNsYXNzTGlzdC5hZGQoXCJ3aW5uaW5nLW1lc3NhZ2VcIik7XHJcbiAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChicmVha2luZyk7XHJcbiAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChwdGFnKTtcclxuICBjdXJyZW50V2luZG93LmNsYXNzTGlzdC5hZGQoXCJwcmVzZW50LWNsaWNrXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy53aW4gPSB3aW5DaGVjaztcclxuIiwiZnVuY3Rpb24gbW92YWJsZSgpIHtcclxuXHJcblxyXG4gIHZhciBmaW5kV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY291bnRlciA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcclxuXHJcbiAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXHJcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgfVxyXG5cclxuICAgICAgZmluZFdpbmRvd3NbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XHJcblxyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcCwgZmFsc2UpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XHJcblxyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSA9PT0gXCJ0b3BcIikge1xyXG4gICAgICAgIGFWYXJZID0gZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICBhVmFyWCA9IGV2ZW50Lm9mZnNldFg7XHJcbiAgICAgICAgc2F2ZVRhcmdldCA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcclxuICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDAuODU7XHJcbiAgICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlVXAoZXZlbnQpIHtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgZmluZFdpbmRvd3NbaV0uc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRpdk1vdmUoZXZlbnQpIHtcclxuXHJcbiAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gZXZlbnQueSAtIGFWYXJZICsgXCJweFwiO1xyXG4gICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBldmVudC54IC0gYVZhclggKyBcInB4XCI7XHJcblxyXG4gIH1cclxuXHJcbiAgYWRkTGlzdGVuZXJzKCk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyV2luZG93KGV2ZW50KSB7XHJcblxyXG4gIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcclxuICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xyXG4gIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnkvY3JlYXRlTWVtb3J5XCIpO1xyXG4gIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY2hhdC9jcmVhdGVDaGF0XCIpO1xyXG4gIHZhciBjb2xvclNjaGVtZWVyID0gcmVxdWlyZShcIi4vY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyXCIpO1xyXG4gIHZhciB3aW5kb3dQbGFjZW1lbnQgPSByZXF1aXJlKFwiLi93aW5kb3dQbGFjZW1lbnRcIik7XHJcbiAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG51bWJlciA9IFwiXCI7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xyXG4gICAgdmFyIGZpbmROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmljb24xXCIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsxXSkge1xyXG4gICAgICAgIHJlbmRlck1lbSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsyXSkge1xyXG4gICAgICAgIHJlbmRlclNjaGVtZWUoKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcblxyXG4gICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XHJcbiAgICBjcmVhdGVDaGF0LmNoYXQoKTtcclxuICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICAgIHNldFouc2V0KCk7XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcclxuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuXHJcbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xyXG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XHJcbiAgICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xyXG4gICAgICBzZXRaLnNldCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyU2NoZW1lZSgpIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY2hlbWVlLXRlbXBsYXRlXCIpO1xyXG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xyXG5cclxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XHJcbiAgICAgIGNvbG9yU2NoZW1lZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICAgICAgc2V0Wi5zZXQoKTtcclxuICB9XHJcblxyXG5cclxuICB9XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xyXG4iLCJmdW5jdGlvbiBzZXRaKCkge1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIG5ld0NvdW50ZXIgPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuXHJcbiAgZnVuY3Rpb24gaGlnZXN0Wih0aGVXaW5kb3dzKSB7XHJcblxyXG4gICAgdmFyIGdsYXNzU3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGVXaW5kb3dzKTtcclxuICAgIHZhciBoaWdoZXN0ID0gMDtcclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdsYXNzU3F1YXJlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciB6aW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShnbGFzc1NxdWFyZVtpXSkuZ2V0UHJvcGVydHlWYWx1ZShcInotaW5kZXhcIik7XHJcbiAgICAgIFxyXG4gICAgICBpZiAoKHppbmRleCA+IGhpZ2hlc3QpICYmICh6aW5kZXggIT09IFwiYXV0b1wiKSkge1xyXG4gICAgICAgIGhpZ2hlc3QgPSB6aW5kZXg7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGhpZ2hlc3Q7XHJcblxyXG4gIH1cclxuXHJcbnNldHRpbmdOZSgpO1xyXG5cclxuICBmdW5jdGlvbiBzZXR0aW5nTmUoKSB7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgICAgd2luZG93c1tjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIpKSArIDE7XHJcbiAgICAgIH0pO1xyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRaO1xyXG4iLCJmdW5jdGlvbiB0YXNrYmFyKCkge1xyXG4gIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGZpbmRUYXNrYmFyLmNsYXNzTGlzdC5hZGQoXCJ0YXNrLWFwcGVhclwiKTtcclxuICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYnJpbmdGb3J0aCA9IHRhc2tiYXI7XHJcbiIsImZ1bmN0aW9uIHdpbmRvd0Rlc3Ryb3llcigpIHtcclxuICB2YXIgZmluZEV4aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4aXRcIik7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kRXhpdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgZmluZEV4aXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZGVzdHJveSA9IHdpbmRvd0Rlc3Ryb3llcjtcclxuIiwiZnVuY3Rpb24gd2luZG93UGxhY2VtZW50KCkge1xyXG5cclxuICBmdW5jdGlvbiB3aGVyZVRvUGxhY2UoKSB7XHJcbiAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZEFsbFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY291bnRlcisrO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgMzAgKiBjb3VudGVyICsgXCJweFwiO1xyXG4gICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgMzAgKiBjb3VudGVyICsgXCJweFwiO1xyXG4gIH1cclxuXHJcbiAgd2hlcmVUb1BsYWNlKCk7XHJcblxyXG4gIFxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMucGxhY2UgPSB3aW5kb3dQbGFjZW1lbnQ7XHJcbiJdfQ==
