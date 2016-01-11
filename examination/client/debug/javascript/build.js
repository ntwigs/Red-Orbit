(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

var preloading = require("./preloading");
preloading.loading();

},{"./preloading":17,"./renderWindow":18,"./taskbar":20}],2:[function(require,module,exports){
"use strict";

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
      event.target.classList.toggle("nick-cog-rotate");
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
"use strict";

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
"use strict";

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
        findNameField[noRepeatCounter - 1].classList.add("name-field-gone");
        textContainer[noRepeatCounter - 1].classList.add("text-container-after");
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
    "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd",
    "superMegaAwesomeOscar": "userSent"
  };

  socket.addEventListener("open", function (event) {
    var i = 0;
    var counter = 0;

    for (i = 0; i < findSubmit.length; i += 1) {
      counter++;
    }

    findSubmit[counter - 1].addEventListener("click", function(event) {
      if (findTextArea[counter - 1].value !== "" && localStorage.getItem("nickname") !== null) {
        // this.removeAttribute("disabled");
        socket.send(JSON.stringify(data));
        findTextArea[counter - 1].value = "";
      }

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
    var isMe = JSON.parse(event.data).superMegaAwesomeOscar;
    var chatData = JSON.parse(event.data).data;
    var chatUser = JSON.parse(event.data).username;
    var createText = document.createTextNode(chatData);
    var createUser = document.createTextNode(chatUser);
    pTagUser.appendChild(createUser);
    pTagMess.appendChild(createText);
    divTagText.appendChild(pTagUser);
    divTagText.appendChild(pTagMess);


    for (var i = 0; i < textContainer.length; i += 1) {
      if (chatUser !== null && chatData !== undefined && chatData !== "") {

          if (chatUser === localStorage.getItem("nickname") && isMe !== undefined) {
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
"use strict";

function colorSchemeer() {

  var loadScheme = require("./loadScheme");
  loadScheme.load();

  var fetchColor = require("./fetchColor");
  fetchColor.fetch();

  var setFontFamily = require("./setFontFamily");
  setFontFamily.set();

}

module.exports.initialize = colorSchemeer;

},{"./fetchColor":6,"./loadScheme":7,"./setFontFamily":8}],6:[function(require,module,exports){
"use strict";

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

    newCounter++;


    hexIn[i].addEventListener("keydown", function() {
      // console.log(saveTarget);

        this.addEventListener("keyup", function() {
          var saveTarget = this.parentElement.parentElement.parentElement;

          saveTarget = saveTarget.children[1].children[0];

          if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {
            this.value = "#" + this.value;
            this.parentElement.children[0].style.backgroundColor = this.value;
            if (this === hexIn[0]) {
              saveTarget.children[0].style.backgroundColor = this.value;
            }
            if (this === hexIn[1]) {
              saveTarget.children[1].style.backgroundColor = this.value;
            }
            if (this === hexIn[2]) {
              saveTarget.style.backgroundColor = this.value;
            }
            if (this === hexIn[3]) {
              saveTarget.children[2].style.backgroundColor = this.value;
            }
          } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {
              this.parentElement.children[0].style.backgroundColor = this.value;
              if (this === hexIn[0]) {
                saveTarget.children[0].style.backgroundColor = this.value;
              }
              if (this === hexIn[1]) {
                saveTarget.children[1].style.backgroundColor = this.value;
              }
              if (this === hexIn[2]) {
                saveTarget.style.backgroundColor = this.value;
              }
              if (this === hexIn[3]) {
                saveTarget.children[2].style.backgroundColor = this.value;
              }
          } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {
              this.value = "#" + this.value.slice(0, -1);
              if (this === hexIn[0]) {
                saveTarget.children[0].style.backgroundColor = this.value;
              }
              if (this === hexIn[1]) {
                saveTarget.children[1].style.backgroundColor = this.value;
              }
              if (this === hexIn[2]) {
                saveTarget.style.backgroundColor = this.value;
              }
              if (this === hexIn[3]) {
                saveTarget.children[2].style.backgroundColor = this.value;
              }
          }

          //Check if entered text is valid hex.
          var reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

          if (this.value.length === 7) {

            if (!reg.test(this.value)) {
              this.style.backgroundColor = "#8b3030";
            } else {
              this.style.backgroundColor = "#59AE37";
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
"use strict";

function loadScheme() {
  var findSquare = document.querySelectorAll(".design-square");
  var tempOne = document.querySelector("#design-one");
  var clone = document.importNode(tempOne.content, true);
  var counter = 0;
  var i = 0;

  var setPoint = document.querySelectorAll(".before-this");

  for (i = 0; i < findSquare.length; i += 1) {
    counter++;
  }

  findSquare[counter - 1].insertBefore(clone, setPoint[counter - 1]);

}

module.exports.load = loadScheme;

},{}],8:[function(require,module,exports){
"use strict";

function setFontFamily() {
  var hexSquare = document.querySelector(".over-square input");
  var hexContain = document.querySelectorAll(".over-square");
  var templatesHeader = document.querySelectorAll(".header-one input");
  var switchContainer = document.querySelectorAll(".switch-container");
  var switchContainerBold = document.querySelectorAll(".switch-container-bold");
  var counter = 0;
  var newCounter = 0;
  var i = 0;

  for (i = 0; i < hexContain.length; i += 1) {
    counter++;
  }

  var hexIn = hexContain[counter - 1].querySelector("input");
  templatesHeader[counter - 1].value = "LOREM IPSUM";


  hexIn.addEventListener("keydown", function() {

      this.addEventListener("keyup", function() {
        var saveTarget = this.parentElement.parentElement.parentElement.children[1].firstElementChild.firstElementChild.firstElementChild;

        // console.log(saveTarget);

        if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {
          this.value = "#" + this.value;
          saveTarget.style.color = this.value;
        } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {
            saveTarget.style.color = this.value;
        } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {
            this.value = "#" + this.value.slice(0, -1);
        }

        //Check if entered text is valid hex.
        var reg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

        if (this.value.length === 7) {

          if (!reg.test(this.value)) {
            this.style.backgroundColor = "#ae3737";
          } else {
            this.style.backgroundColor = "#59AE37";
          }

        } else if (this.value.length < 7) {

          this.style.backgroundColor = "white";

        }

      });

  });

  switchContainer[counter - 1].addEventListener("click", function() {
    // console.log(this);
    if (templatesHeader[counter - 1].classList.contains("serif")) {
      templatesHeader[counter - 1].classList.remove("serif");
      this.firstElementChild.style.marginLeft = "0px";
    } else {
      templatesHeader[counter - 1].classList.add("serif");
      this.firstElementChild.style.marginLeft = "25px";
    }
  });

  switchContainerBold[counter - 1].addEventListener("click", function() {
    if (templatesHeader[counter - 1].classList.contains("bold")) {
      templatesHeader[counter - 1].classList.remove("bold");
      this.firstElementChild.style.marginLeft = "25px";
    } else {
      templatesHeader[counter - 1].classList.add("bold");
      this.firstElementChild.style.marginLeft = "0px";
    }
  });


}

module.exports.set = setFontFamily;

},{}],9:[function(require,module,exports){
"use strict";

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

},{}],10:[function(require,module,exports){
"use strict";

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
            saveTarget[0].setAttribute("tabindex", "0");
            saveTarget[0].setAttribute("tabindex", "0");
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

},{"./winCheck":15}],11:[function(require,module,exports){
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

},{"./cardRandomizer":9,"./checkPair":10,"./loadingCards":12,"./setCards":13,"./themeChanger":14}],12:[function(require,module,exports){
"use strict";

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

},{}],13:[function(require,module,exports){
"use strict";

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

},{}],14:[function(require,module,exports){
"use strict";

function themeChanger() {
  var hasCards = document.querySelectorAll(".theme-selector");
  var themes = document.querySelectorAll(".picker-container");
  var allCards = document.querySelectorAll(".card");
  var counter = 0;
  var newCounter = 0;
  var i = 0;

  for (i = 0; i < hasCards.length; i += 1) {
    counter++;
  }

  var cards = document.querySelectorAll(".card-container")[counter - 1].querySelectorAll(".card");

  hasCards[counter - 1].querySelectorAll(".picker-container")[0].addEventListener("click", function() {

    localStorage.setItem("theme", "plain");

    this.parentElement.parentElement.setAttribute("data-theme", "plain");

    for (i = 0; i < cards.length; i += 1) {
        cards[i].style.backgroundImage = "url('../image/plain/0.png')";
    }

  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[1].addEventListener("click", function() {

    localStorage.setItem("theme", "red");

    this.parentElement.parentElement.setAttribute("data-theme", "red");

    for (i = 0; i < cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/red/0.png')";
    }

  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[2].addEventListener("click", function() {

    localStorage.setItem("theme", "blue");

    this.parentElement.parentElement.setAttribute("data-theme", "blue");

    for (i = 0; i < cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/blue/0.png')";
    }
  });

  hasCards[counter - 1].querySelectorAll(".picker-container")[3].addEventListener("click", function() {

    localStorage.setItem("theme", "green");

    this.parentElement.parentElement.setAttribute("data-theme", "green");

    for (i = 0; i < cards.length; i += 1) {
      cards[i].style.backgroundImage = "url('../image/green/0.png')";
    }

  });


  var themeButton = hasCards[counter - 1].parentElement.firstElementChild.firstElementChild;


  themeButton.addEventListener("click", bringTheme);


  function bringTheme(event) {
      event.target.classList.toggle("nick-cog-rotate");
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

},{}],15:[function(require,module,exports){
"use strict";

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

},{}],16:[function(require,module,exports){
"use strict";

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

  var aVarY = 0;
  var aVarX = 0;
  var saveTarget = 0;

  function mouseDown(event) {

      if (event.target.className.slice(0, 3) === "top") {
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
    if (event.y - aVarY < 0) {
      console.log(event.y - aVarY);
      saveTarget.parentElement.style.top = "0px";
    } else if (event.y - aVarY > window.innerHeight - saveTarget.parentElement.offsetHeight + saveTarget.parentElement.offsetHeight * 0.5) {
      saveTarget.parentElement.style.top = window.innerHeight - saveTarget.parentElement.offsetHeight + saveTarget.parentElement.offsetHeight * 0.5 + "px";
    } else {
      saveTarget.parentElement.style.top = event.y - aVarY + "px";
    }

    if (event.x - aVarX < 0) {
      saveTarget.parentElement.style.left = "0px";
    } else if (event.x - aVarX > window.innerWidth - saveTarget.parentElement.offsetWidth + saveTarget.parentElement.offsetWidth * 0.5) {
      saveTarget.parentElement.style.left = window.innerWidth - saveTarget.parentElement.offsetWidth + saveTarget.parentElement.offsetWidth * 0.5 + "px";
    } else {
      saveTarget.parentElement.style.left = event.x - aVarX + "px";
    }



  }

  addListeners();

};

module.exports.move = movable;

},{}],17:[function(require,module,exports){
"use strict";

function preloading() {
    if (document.images) {
      var img1 = new Image();
      var img2 = new Image();
      var img3 = new Image();
      var img4 = new Image();
      var img5 = new Image();
      var img6 = new Image();
      var img7 = new Image();
      var img8 = new Image();
      var img9 = new Image();

      var img10 = new Image();
      var img11 = new Image();
      var img12 = new Image();
      var img13 = new Image();
      var img14 = new Image();
      var img15 = new Image();
      var img16 = new Image();
      var img17 = new Image();
      var img18 = new Image();

      var img19 = new Image();
      var img20 = new Image();
      var img21 = new Image();
      var img22 = new Image();
      var img23 = new Image();
      var img24 = new Image();
      var img25 = new Image();
      var img26 = new Image();
      var img27 = new Image();

      var img28 = new Image();

      img1.src = "../image/blue/0.png";
      img2.src = "../image/blue/1.png";
      img3.src = "../image/blue/2.png";
      img4.src = "../image/blue/3.png";
      img5.src = "../image/blue/4.png";
      img6.src = "../image/blue/5.png";
      img7.src = "../image/blue/6.png";
      img8.src = "../image/blue/7.png";
      img9.src = "../image/blue/8.png";

      img10.src = "../image/red/0.png";
      img11.src = "../image/red/1.png";
      img12.src = "../image/red/2.png";
      img13.src = "../image/red/3.png";
      img14.src = "../image/red/4.png";
      img15.src = "../image/red/5.png";
      img16.src = "../image/red/6.png";
      img17.src = "../image/red/7.png";
      img18.src = "../image/red/8.png";

      img19.src = "../image/green/0.png";
      img20.src = "../image/green/1.png";
      img21.src = "../image/green/2.png";
      img22.src = "../image/green/3.png";
      img23.src = "../image/green/4.png";
      img24.src = "../image/green/5.png";
      img25.src = "../image/green/6.png";
      img26.src = "../image/green/7.png";
      img27.src = "../image/green/8.png";

      img28.src = "../image/icons/coggrey.png"
    }
}

module.exports.loading = preloading;

},{}],18:[function(require,module,exports){
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
    setZ.set();
    windowDestroyer.destroy();


  }

  function renderMem() {
      var template = document.querySelector("#window-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      windowPlacement.place();
      createMemory.create();
      movable.move();
      setZ.set();
      windowDestroyer.destroy();
  }

  function renderSchemee() {
      var template = document.querySelector("#schemee-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      windowPlacement.place();
      colorSchemeer.initialize();
      movable.move();
      setZ.set();
      windowDestroyer.destroy();
  }


  }


module.exports.render = renderWindow;

},{"./chat/createChat":4,"./colorSchemeer/colorSchemeer":5,"./memory/createMemory":11,"./movable":16,"./setZ":19,"./windowDestroyer":21,"./windowPlacement":22}],19:[function(require,module,exports){
"use strict";

function setZ() {
  var windows = document.querySelectorAll(".window");
  var nav = document.querySelector(".taskbar");
  var counter = 0;
  var i = 0;
  var j = 0;
  var newCounter = 0;
  var newArr = [];

  // for (j = 0; j < 4; j += 1) {
    nav.style.zIndex = parseInt(higestZ(".window", true));
  // }

  function higestZ(theWindows, naving) {

    var glassSquare = document.querySelectorAll(theWindows);
    var highest = 0;

    for (var i = 0; i < glassSquare.length; i++) {
      var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");
      if ((zindex !== "auto")) {
        if (naving) {
          highest = parseInt(zindex) + 200;
        } else {
          highest = parseInt(zindex) + 1;
          newArr.push(highest);
        }
      }
    }

    newArr.sort(function(a, b) {
      return b - a;
    });

    if (newArr[0] === newArr[1]) {
      if (newArr[0] !== undefined) {
        newArr.unshift(parseInt(newArr[0]));
      }
    }

    if (newArr[0] !== undefined) {
      return newArr[0];
    } else {
      return highest;
    }

  }

settingNe();

  function settingNe() {



    for (i = 0; i < windows.length; i += 1) {
      counter++;
    }

      windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

      windows[counter - 1].addEventListener("mousedown", function() {
        this.style.zIndex = parseInt(higestZ(".window", false));

      });


  }

}

module.exports.set = setZ;

},{}],20:[function(require,module,exports){
"use strict";

function taskbar() {
  var findTaskbar = document.querySelector(".taskbar");
  window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],21:[function(require,module,exports){
"use strict";

function windowDestroyer() {
  var findExit = document.querySelectorAll(".exit");
  var body = document.querySelector("body");
  for (var i = 0; i < findExit.length; i += 1) {
    findExit[i].addEventListener("click", function(event) {
      if (event.target.parentElement.parentElement.parentElement !== body) {
        event.target.parentElement.parentElement.parentElement.remove();
      }
    });
  }
}

module.exports.destroy = windowDestroyer;

},{}],22:[function(require,module,exports){
"use strict";

var newCounter = 0;
var height = 0;
var width = 0;
var counting = 0;

function windowPlacement() {

  function whereToPlace() {
    var findAllWindows = document.querySelectorAll(".window");
    var counter = 0;
    var i = 0;
    
    for (i = 0; i < findAllWindows.length; i += 1) {
      counter++;
    }

    var setZ = require("./setZ");
    setZ.set();

    findAllWindows[counter - 1].style.top = "" + 30 * newCounter + "px";
    findAllWindows[counter - 1].style.left = "" + 30 * newCounter + "px";

    height += 30;
    width += 30;

    if ((width) > window.innerHeight - 500) {
      newCounter = 0;
      width = 30;
      findAllWindows[counter - 1].style.top = "" + width + "px";
      findAllWindows[counter - 1].style.left = "" + height + "px";
    } else {
      findAllWindows[counter - 1].style.top = "" + width + "px";
      findAllWindows[counter - 1].style.left = "" + height + "px";
    }


    if ((height) > window.innerWidth - 450) {
      counting++;
      height = 5 * counting;
    }
  }

  whereToPlace();



}

module.exports.place = windowPlacement;

},{"./setZ":19}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcclxucmVuZGVyV2luZG93LnJlbmRlcigpO1xyXG5cclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xyXG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcclxuXHJcbnZhciBwcmVsb2FkaW5nID0gcmVxdWlyZShcIi4vcHJlbG9hZGluZ1wiKTtcclxucHJlbG9hZGluZy5sb2FkaW5nKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY2hhdFNldHRpbmdzKGV2ZW50KSB7XHJcbiAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmljay1jaGFuZ2VyXCIpO1xyXG4gIHZhciBuYW1lRmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBuaWNraW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xyXG4gIHZhciBrID0gMDtcclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIG5ld0FyciA9IFtdO1xyXG5cclxuICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlQnV0dG9uLmxlbmd0aDsgaiArPSAxKSB7XHJcbiAgICBrKys7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBmaW5kQW5kU2V0KGV2ZW50KSB7XHJcblxyXG4gICAgICBuaWNraW5nW2sgLSAxXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKTtcclxuICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcIm5hbWUtZmllbGQtZ29uZVwiKSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBjaGFuZ2VCdXR0b25bayAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmaW5kQW5kU2V0KTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IGNoYXRTZXR0aW5ncztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjaGVja05pY2soKSB7XHJcblxyXG4gIHZhciBuaWNrSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcbiAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuXHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBrID0gMDtcclxuICB2YXIgbmlja25hbWUgPSBcIlwiO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgbmlja0lucHV0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBrKys7XHJcbiAgfVxyXG5cclxuICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xyXG4gICAgbmlja25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xyXG4gICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrTmljaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xyXG5cclxuICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xyXG4gIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcclxuICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xyXG4gIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XHJcbiAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZW50ZXJlZE1lc3NhZ2UgPSBcIlwiO1xyXG4gIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XHJcbiAgdmFyIGNoYXRTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NoYXRTZXR0aW5nc1wiKTtcclxuICB2YXIgbm9SZXBlYXRDb3VudGVyID0gMDtcclxuXHJcbiAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXR0ZXh0XCIpO1xyXG4gIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2hlY2tOaWNrLmNoZWNrKCk7XHJcbiAgICAgIG5vUmVwZWF0Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gKkhpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlICAtPiAqSXNoXHJcbiAgICBpZiAoZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcclxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUpO1xyXG4gICAgICAgIGZpbmROYW1lRmllbGRbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZmluZFN1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAobG9jYWxTdG9yYWdlLm5pY2tuYW1lICE9PSBcIlwiKSB7XHJcbiAgICAgIGRhdGFbXCJ1c2VybmFtZVwiXSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XHJcbiAgICAgIGRhdGFbXCJkYXRhXCJdID0gZmluZFRleHRBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICB2YXIgZGF0YSA9IHtcclxuICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcclxuICAgIFwiZGF0YVwiIDogXCJcIixcclxuICAgIFwidXNlcm5hbWVcIjogXCJcIixcclxuICAgIFwiY2hhbm5lbFwiOiBcIlwiLFxyXG4gICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiLFxyXG4gICAgXCJzdXBlck1lZ2FBd2Vzb21lT3NjYXJcIjogXCJ1c2VyU2VudFwiXHJcbiAgfTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIGkgPSAwO1xyXG4gICAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgIT09IFwiXCIgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xyXG4gICAgICAgIC8vIHRoaXMucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG4gICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgPSBcIlwiO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcclxuICAgICAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5jbGljaygpO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgdmFyIHBUYWdVc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgcFRhZ01lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcclxuICAgIHZhciBkaXZUYWdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcclxuICAgIHZhciBpc01lID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5zdXBlck1lZ2FBd2Vzb21lT3NjYXI7XHJcbiAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XHJcbiAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xyXG4gICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XHJcbiAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcclxuICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xyXG4gICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcclxuICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xyXG5cclxuXHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgaWYgKGNoYXRVc2VyICE9PSBudWxsICYmIGNoYXREYXRhICE9PSB1bmRlZmluZWQgJiYgY2hhdERhdGEgIT09IFwiXCIpIHtcclxuXHJcbiAgICAgICAgICBpZiAoY2hhdFVzZXIgPT09IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgJiYgaXNNZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGRpdlRhZ1RleHQuY2xhc3NMaXN0LmFkZChcInVzZXItc2VudFwiKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5hcHBlbmRDaGlsZChkaXZUYWdUZXh0KTtcclxuICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbFRvcCA9IHRleHRDb250YWluZXJbaV0uc2Nyb2xsSGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjb2xvclNjaGVtZWVyKCkge1xyXG5cclxuICB2YXIgbG9hZFNjaGVtZSA9IHJlcXVpcmUoXCIuL2xvYWRTY2hlbWVcIik7XHJcbiAgbG9hZFNjaGVtZS5sb2FkKCk7XHJcblxyXG4gIHZhciBmZXRjaENvbG9yID0gcmVxdWlyZShcIi4vZmV0Y2hDb2xvclwiKTtcclxuICBmZXRjaENvbG9yLmZldGNoKCk7XHJcblxyXG4gIHZhciBzZXRGb250RmFtaWx5ID0gcmVxdWlyZShcIi4vc2V0Rm9udEZhbWlseVwiKTtcclxuICBzZXRGb250RmFtaWx5LnNldCgpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGNvbG9yU2NoZW1lZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gZmV0Y2hDb2xvcigpIHtcclxuICB2YXIgaGV4U3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jb2xvci1yb3cgaW5wdXRcIik7XHJcbiAgdmFyIGhleENvbnRhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLWNvbnRhaW5lclwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIG5ld0NvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgaGV4SW4ubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcbiAgICBuZXdDb3VudGVyKys7XHJcblxyXG5cclxuICAgIGhleEluW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAvLyBjb25zb2xlLmxvZyhzYXZlVGFyZ2V0KTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgc2F2ZVRhcmdldCA9IHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF07XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA2ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzFdKSB7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSA9PT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcclxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzFdKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xyXG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcclxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcclxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzFdKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xyXG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcclxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxyXG4gICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghcmVnLnRlc3QodGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzhiMzAzMFwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcclxuXHJcbiAgICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuZmV0Y2ggPSBmZXRjaENvbG9yO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGxvYWRTY2hlbWUoKSB7XHJcbiAgdmFyIGZpbmRTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRlc2lnbi1zcXVhcmVcIik7XHJcbiAgdmFyIHRlbXBPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rlc2lnbi1vbmVcIik7XHJcbiAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wT25lLmNvbnRlbnQsIHRydWUpO1xyXG4gIHZhciBjb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIHZhciBzZXRQb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmVmb3JlLXRoaXNcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBmaW5kU3F1YXJlLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICBmaW5kU3F1YXJlW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIHNldFBvaW50W2NvdW50ZXIgLSAxXSk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBzZXRGb250RmFtaWx5KCkge1xyXG4gIHZhciBoZXhTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm92ZXItc3F1YXJlIGlucHV0XCIpO1xyXG4gIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vdmVyLXNxdWFyZVwiKTtcclxuICB2YXIgdGVtcGxhdGVzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oZWFkZXItb25lIGlucHV0XCIpO1xyXG4gIHZhciBzd2l0Y2hDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXJcIik7XHJcbiAgdmFyIHN3aXRjaENvbnRhaW5lckJvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXItYm9sZFwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIG5ld0NvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcclxuICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLnZhbHVlID0gXCJMT1JFTSBJUFNVTVwiO1xyXG5cclxuXHJcbiAgaGV4SW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQ7XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHNhdmVUYXJnZXQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDYgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XHJcbiAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmNvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuY29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPj0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgaWYgZW50ZXJlZCB0ZXh0IGlzIHZhbGlkIGhleC5cclxuICAgICAgICB2YXIgcmVnID0gL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezN9KSQvO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcpIHtcclxuXHJcbiAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYWUzNzM3XCI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU5QUUzN1wiO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xyXG5cclxuICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgfSk7XHJcblxyXG4gIHN3aXRjaENvbnRhaW5lcltjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gY29uc29sZS5sb2codGhpcyk7XHJcbiAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZXJpZlwiKSkge1xyXG4gICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJzZXJpZlwiKTtcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIwcHhcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcInNlcmlmXCIpO1xyXG4gICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgc3dpdGNoQ29udGFpbmVyQm9sZFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9sZFwiKSkge1xyXG4gICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJib2xkXCIpO1xyXG4gICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcImJvbGRcIik7XHJcbiAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Rm9udEZhbWlseTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjYXJkUmFuZG9taXplcigpIHtcclxuICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcbiAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgY2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBqID0gMDtcclxuICB2YXIgY2FyZEFyciA9IFtdO1xyXG4gIHZhciBuZXdOdW1iZXIgPSAwO1xyXG4gIHZhciBuZXdDb3VudGVyID0gMDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xyXG4gICAgZm9yIChqID0gMDsgaiA8IDI7IGogKz0gMSkge1xyXG4gICAgICBjYXJkQXJyLnB1c2goaSArIDEpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc2h1ZmZsZShjYXJkQXJyKSB7XHJcbiAgICB2YXIgbSA9IGNhcmRBcnIubGVuZ3RoLCB0LCBpO1xyXG5cclxuICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXHJcbiAgICB3aGlsZSAobSkge1xyXG5cclxuICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW504oCmXHJcbiAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBtLS0pO1xyXG5cclxuICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxyXG4gICAgICB0ID0gY2FyZEFyclttXTtcclxuICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XHJcbiAgICAgIGNhcmRBcnJbaV0gPSB0O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBjYXJkQXJyO1xyXG59XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBuZXdDb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICByYW5kb21BbmRTZXQoKTtcclxuXHJcbiAgZnVuY3Rpb24gcmFuZG9tQW5kU2V0KCkge1xyXG4gICAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gICAgdmFyIHdpbmRvd0NvdW50ID0gMDtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICB3aW5kb3dDb3VudCsrO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBjYXJkc0luV2luZG93cyA9IHdpbmRvd3Nbd2luZG93Q291bnQgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcclxuICAgICAgbmV3TnVtYmVyID0gc2h1ZmZsZShjYXJkQXJyKS5zcGxpY2UoMCwgMSk7XHJcbiAgICAgIGNvdW50ZXIrKztcclxuICAgICAgY2FyZHNJbldpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChuZXdOdW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5ydW4gPSBjYXJkUmFuZG9taXplcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjaGVja1BhaXIoKSB7XHJcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgbmV3QXJyID0gW107XHJcbiAgdmFyIHRhcmdldEFyciA9IFtdO1xyXG4gIHZhciBzYXZlVGFyZ2V0ID0gW107XHJcbiAgdmFyIG5ld0NvdW50ZXIgPSAwO1xyXG4gIHZhciBjbGlja3MgPSAwO1xyXG4gIHZhciB0cmllcyA9IDA7XHJcbiAgdmFyIHBhaXJDb3VudGVyID0gMDtcclxuICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xyXG4gIHZhciB3aW5DaGVjayA9IHJlcXVpcmUoXCIuL3dpbkNoZWNrXCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgY29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICB2YXIgY2FyZHNJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciBjb3VudGVySW5XaW5kb3cgPSBjb250YWluZXJbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBjYXJkc0luV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgY2FyZHNJbldpbmRvd1tpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xyXG4gICAgICAgIHRoaXMuY2xpY2soKTtcclxuICAgICAgfVxyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9KTtcclxuICAgICAgY2FyZHNJbldpbmRvd1tpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbGlzdGVuZXIoZXZlbnQpIHtcclxuXHJcbiAgaWYgKGNsaWNrcyA8IDIpIHtcclxuXHJcbiAgY2xpY2tzICs9IDE7XHJcblxyXG4gIHRyaWVzICs9IDE7XHJcblxyXG4gIHZhciBnZXRXaW5kb3cgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgdmFyIGN1cnJlbnRUaGVtZSA9IGdldFdpbmRvdy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIpO1xyXG5cclxuICAvLyBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XHJcbiAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiL1wiICsgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSArIFwiLnBuZycpXCI7XHJcblxyXG4gIC8vIH0gZWxzZSB7XHJcbiAgLy8gICB0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgLy8gfVxyXG5cclxuICAvL0jDpHIgc2thIG1hbiBrdW5uYSDDpG5kcmEgdmlsa2VuIGJpbGRlbiBza2EgdmFyYS5cclxuXHJcbiAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgIHRhcmdldEFyci5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoIDwgMikge1xyXG4gICAgICB0YXJnZXRBcnIucHVzaCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0QXJyWzBdID09PSB0YXJnZXRBcnJbMV0pIHtcclxuICAgICAgdGFyZ2V0QXJyID0gdGFyZ2V0QXJyLnNwbGljZSgwLCAxKTtcclxuICAgICAgY2xpY2tzID0gY2xpY2tzIC09IDE7XHJcbiAgICAgIHRyaWVzID0gdHJpZXMgLT0gMTtcclxuICAgICAgcGFpckNvdW50ZXIgPSBwYWlyQ291bnRlciAtPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGNvdW50ZXJJbldpbmRvdy50ZXh0Q29udGVudCA9IHRyaWVzO1xyXG5cclxuICAgICAgaWYgKHRhcmdldEFyclswXSAhPT0gdGFyZ2V0QXJyWzFdKSB7XHJcbiAgICAgICAgaWYgKG5ld0Fyci5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcclxuICAgICAgICAgIHNhdmVUYXJnZXQucHVzaCh0aGlzKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG5ld0Fyci5sZW5ndGggPCAyKSB7XHJcbiAgICAgICAgICBpZih0YXJnZXRBcnJbMF0gJiYgdGFyZ2V0QXJyWzFdKSB7XHJcbiAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoID49IDIpIHtcclxuICAgICAgICAgICAgbmV3QXJyLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXQubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucHVzaCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgIGlmIChuZXdBcnJbMF0gJiYgbmV3QXJyWzFdKSB7XHJcbiAgICAgICAgaWYgKG5ld0FyclswXSA9PT0gbmV3QXJyWzFdKSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJQQUlSXCIpO1xyXG4gICAgICAgICAgICBjbGlja3MgPSAwO1xyXG4gICAgICAgICAgICBwYWlyQ291bnRlciArPSAxO1xyXG4gICAgICAgICAgICBpZiAocGFpckNvdW50ZXIgPj0gOCkge1xyXG4gICAgICAgICAgICAgIHdpbkNoZWNrLndpbihjb3VudGVySW5XaW5kb3cpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgIC8vIHZhciBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vU2FtbWEgc29tIGdydW5kZW4uXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTk9UIEEgUEFJUlwiKTtcclxuICAgICAgICAgICAgY2xpY2tzID0gMDtcclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbn1cclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja1BhaXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xyXG5cclxuICB2YXIgbG9hZGluZ0NhcmRzID0gcmVxdWlyZShcIi4vbG9hZGluZ0NhcmRzXCIpO1xyXG4gIGxvYWRpbmdDYXJkcy5sb2FkKCk7XHJcblxyXG4gIHZhciB0aGVtZUNoYW5nZXIgPSByZXF1aXJlKFwiLi90aGVtZUNoYW5nZXJcIik7XHJcbiAgdGhlbWVDaGFuZ2VyLmNoYW5nZSgpO1xyXG5cclxuICB2YXIgc2V0Q2FyZHMgPSByZXF1aXJlKFwiLi9zZXRDYXJkc1wiKTtcclxuICBzZXRDYXJkcy5zZXQoKTtcclxuXHJcbiAgdmFyIGNhcmRSYW5kb21pemVyID0gcmVxdWlyZShcIi4vY2FyZFJhbmRvbWl6ZXJcIik7XHJcbiAgY2FyZFJhbmRvbWl6ZXIucnVuKCk7XHJcblxyXG4gIHZhciBjaGVja1BhaXIgPSByZXF1aXJlKFwiLi9jaGVja1BhaXJcIik7XHJcbiAgY2hlY2tQYWlyLmNoZWNrKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gbG9hZGluZ0NhcmRzKCkge1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeS10ZW1wbGF0ZVwiKTtcclxuICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gIHZhciBjbGlja0NvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNsaWNrQ291bnRlclwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGNvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIGNsaWNrQ291bnRlcltjb3VudGVyIC0gMV0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRpbmdDYXJkcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBzZXRDYXJkcygpIHtcclxuICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcbiAgdmFyIG1lbVdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBjb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBtZW1XaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XHJcbiAgICB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcclxuICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBsYXN0VGhlbWUpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBtZW1XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJwbGFpblwiKTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoY2FyZHNbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpID09PSBcIm5vbmVcIikge1xyXG4gICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XHJcbiAgICAgICAgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcclxuICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBsYXN0VGhlbWUgKyBcIi8wLnBuZycpXCI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcclxuICAgICAgfVxyXG4gICAgICAvL0jDpHIga2FuIG1hbiDDpG5kcmEgZ3J1bmRlbi5cclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRDYXJkcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiB0aGVtZUNoYW5nZXIoKSB7XHJcbiAgdmFyIGhhc0NhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50aGVtZS1zZWxlY3RvclwiKTtcclxuICB2YXIgdGhlbWVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpO1xyXG4gIHZhciBhbGxDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIG5ld0NvdW50ZXIgPSAwO1xyXG4gIHZhciBpID0gMDtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGhhc0NhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcblxyXG4gIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJwbGFpblwiKTtcclxuXHJcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwicGxhaW5cIik7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG4gIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJyZWRcIik7XHJcblxyXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInJlZFwiKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3JlZC8wLnBuZycpXCI7XHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwiYmx1ZVwiKTtcclxuXHJcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiYmx1ZVwiKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL2JsdWUvMC5wbmcnKVwiO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzNdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwiZ3JlZW5cIik7XHJcblxyXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImdyZWVuXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvZ3JlZW4vMC5wbmcnKVwiO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcblxyXG4gIHZhciB0aGVtZUJ1dHRvbiA9IGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuXHJcbiAgdGhlbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJyaW5nVGhlbWUpO1xyXG5cclxuXHJcbiAgZnVuY3Rpb24gYnJpbmdUaGVtZShldmVudCkge1xyXG4gICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcIm5pY2stY29nLXJvdGF0ZVwiKTtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwidGhlbWUtZmllbGQtZ29uZVwiKSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcInRoZW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwidGhlbWUtZmllbGQtZ29uZVwiKTtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5hZGQoXCJjYXJkLWNvbnRhaW5lci1hZnRlclwiKTtcclxuICAgICAgfVxyXG5cclxuICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSB0aGVtZUNoYW5nZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gd2luQ2hlY2soY3VycmVudFdpbmRvdywgY29udGFpbmVyKSB7XHJcbiAgdmFyIHlvdVdpbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWU9VIFdJTiFcIik7XHJcbiAgdmFyIGJyZWFraW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJSXCIpO1xyXG4gIHZhciBwdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgcHRhZy5hcHBlbmRDaGlsZCh5b3VXaW4pO1xyXG4gIHB0YWcuY2xhc3NMaXN0LmFkZChcIndpbm5pbmctbWVzc2FnZVwiKTtcclxuICBjdXJyZW50V2luZG93LmFwcGVuZENoaWxkKGJyZWFraW5nKTtcclxuICBjdXJyZW50V2luZG93LmFwcGVuZENoaWxkKHB0YWcpO1xyXG4gIGN1cnJlbnRXaW5kb3cuY2xhc3NMaXN0LmFkZChcInByZXNlbnQtY2xpY2tcIik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLndpbiA9IHdpbkNoZWNrO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIG1vdmFibGUoKSB7XHJcblxyXG5cclxuICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxyXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZpbmRXaW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xyXG5cclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXAsIGZhbHNlKTtcclxuICB9XHJcblxyXG4gIHZhciBhVmFyWSA9IDA7XHJcbiAgdmFyIGFWYXJYID0gMDtcclxuICB2YXIgc2F2ZVRhcmdldCA9IDA7XHJcblxyXG4gIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xyXG5cclxuICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuc2xpY2UoMCwgMykgPT09IFwidG9wXCIpIHtcclxuICAgICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XHJcbiAgICAgICAgYVZhclggPSBldmVudC5vZmZzZXRYO1xyXG4gICAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XHJcbiAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwLjg1O1xyXG4gICAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBtb3VzZVVwKGV2ZW50KSB7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGZpbmRXaW5kb3dzW2ldLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGRpdk1vdmUoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC55IC0gYVZhclkgPCAwKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnkgLSBhVmFyWSk7XHJcbiAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBcIjBweFwiO1xyXG4gICAgfSBlbHNlIGlmIChldmVudC55IC0gYVZhclkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAqIDAuNSkge1xyXG4gICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUgKyBcInB4XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gZXZlbnQueSAtIGFWYXJZICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChldmVudC54IC0gYVZhclggPCAwKSB7XHJcbiAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcclxuICAgIH0gZWxzZSBpZiAoZXZlbnQueCAtIGFWYXJYID4gd2luZG93LmlubmVyV2lkdGggLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKiAwLjUpIHtcclxuICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCAqIDAuNSArIFwicHhcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gIH1cclxuXHJcbiAgYWRkTGlzdGVuZXJzKCk7XHJcblxyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcHJlbG9hZGluZygpIHtcclxuICAgIGlmIChkb2N1bWVudC5pbWFnZXMpIHtcclxuICAgICAgdmFyIGltZzEgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzIgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzMgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzQgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzUgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzYgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzggPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzkgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgIHZhciBpbWcxMCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMTEgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzEyID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcxMyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMTQgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzE1ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcxNiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMTcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzE4ID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICB2YXIgaW1nMTkgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzIwID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcyMSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMjIgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzIzID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcyNCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMjUgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzI2ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcyNyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgdmFyIGltZzI4ID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICBpbWcxLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8wLnBuZ1wiO1xyXG4gICAgICBpbWcyLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8xLnBuZ1wiO1xyXG4gICAgICBpbWczLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8yLnBuZ1wiO1xyXG4gICAgICBpbWc0LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8zLnBuZ1wiO1xyXG4gICAgICBpbWc1LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS80LnBuZ1wiO1xyXG4gICAgICBpbWc2LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS81LnBuZ1wiO1xyXG4gICAgICBpbWc3LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS82LnBuZ1wiO1xyXG4gICAgICBpbWc4LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS83LnBuZ1wiO1xyXG4gICAgICBpbWc5LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS84LnBuZ1wiO1xyXG5cclxuICAgICAgaW1nMTAuc3JjID0gXCIuLi9pbWFnZS9yZWQvMC5wbmdcIjtcclxuICAgICAgaW1nMTEuc3JjID0gXCIuLi9pbWFnZS9yZWQvMS5wbmdcIjtcclxuICAgICAgaW1nMTIuc3JjID0gXCIuLi9pbWFnZS9yZWQvMi5wbmdcIjtcclxuICAgICAgaW1nMTMuc3JjID0gXCIuLi9pbWFnZS9yZWQvMy5wbmdcIjtcclxuICAgICAgaW1nMTQuc3JjID0gXCIuLi9pbWFnZS9yZWQvNC5wbmdcIjtcclxuICAgICAgaW1nMTUuc3JjID0gXCIuLi9pbWFnZS9yZWQvNS5wbmdcIjtcclxuICAgICAgaW1nMTYuc3JjID0gXCIuLi9pbWFnZS9yZWQvNi5wbmdcIjtcclxuICAgICAgaW1nMTcuc3JjID0gXCIuLi9pbWFnZS9yZWQvNy5wbmdcIjtcclxuICAgICAgaW1nMTguc3JjID0gXCIuLi9pbWFnZS9yZWQvOC5wbmdcIjtcclxuXHJcbiAgICAgIGltZzE5LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMC5wbmdcIjtcclxuICAgICAgaW1nMjAuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8xLnBuZ1wiO1xyXG4gICAgICBpbWcyMS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzIucG5nXCI7XHJcbiAgICAgIGltZzIyLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMy5wbmdcIjtcclxuICAgICAgaW1nMjMuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi80LnBuZ1wiO1xyXG4gICAgICBpbWcyNC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzUucG5nXCI7XHJcbiAgICAgIGltZzI1LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNi5wbmdcIjtcclxuICAgICAgaW1nMjYuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi83LnBuZ1wiO1xyXG4gICAgICBpbWcyNy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzgucG5nXCI7XHJcblxyXG4gICAgICBpbWcyOC5zcmMgPSBcIi4uL2ltYWdlL2ljb25zL2NvZ2dyZXkucG5nXCJcclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubG9hZGluZyA9IHByZWxvYWRpbmc7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gcmVuZGVyV2luZG93KGV2ZW50KSB7XHJcblxyXG4gIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcclxuICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xyXG4gIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnkvY3JlYXRlTWVtb3J5XCIpO1xyXG4gIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY2hhdC9jcmVhdGVDaGF0XCIpO1xyXG4gIHZhciBjb2xvclNjaGVtZWVyID0gcmVxdWlyZShcIi4vY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyXCIpO1xyXG4gIHZhciB3aW5kb3dQbGFjZW1lbnQgPSByZXF1aXJlKFwiLi93aW5kb3dQbGFjZW1lbnRcIik7XHJcbiAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xyXG5cclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG51bWJlciA9IFwiXCI7XHJcblxyXG4gIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xyXG4gICAgdmFyIGZpbmROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmljb24xXCIpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xyXG4gICAgICAgIHJlbmRlcigpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsxXSkge1xyXG4gICAgICAgIHJlbmRlck1lbSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsyXSkge1xyXG4gICAgICAgIHJlbmRlclNjaGVtZWUoKTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuICBuYXZDbGljaygpO1xyXG5cclxuICBmdW5jdGlvbiByZW5kZXIoKSB7XHJcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XHJcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcblxyXG4gICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XHJcbiAgICBjcmVhdGVDaGF0LmNoYXQoKTtcclxuICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgc2V0Wi5zZXQoKTtcclxuICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XHJcblxyXG5cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlck1lbSgpIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3ctdGVtcGxhdGVcIik7XHJcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XHJcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XHJcblxyXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcclxuICAgICAgY3JlYXRlTWVtb3J5LmNyZWF0ZSgpO1xyXG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgICAgc2V0Wi5zZXQoKTtcclxuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlclNjaGVtZWUoKSB7XHJcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NoZW1lZS10ZW1wbGF0ZVwiKTtcclxuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuXHJcbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xyXG4gICAgICBjb2xvclNjaGVtZWVyLmluaXRpYWxpemUoKTtcclxuICAgICAgbW92YWJsZS5tb3ZlKCk7XHJcbiAgICAgIHNldFouc2V0KCk7XHJcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgfVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLnJlbmRlciA9IHJlbmRlcldpbmRvdztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBzZXRaKCkge1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBqID0gMDtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcbiAgdmFyIG5ld0FyciA9IFtdO1xyXG5cclxuICAvLyBmb3IgKGogPSAwOyBqIDwgNDsgaiArPSAxKSB7XHJcbiAgICBuYXYuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgdHJ1ZSkpO1xyXG4gIC8vIH1cclxuXHJcbiAgZnVuY3Rpb24gaGlnZXN0Wih0aGVXaW5kb3dzLCBuYXZpbmcpIHtcclxuXHJcbiAgICB2YXIgZ2xhc3NTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoZVdpbmRvd3MpO1xyXG4gICAgdmFyIGhpZ2hlc3QgPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2xhc3NTcXVhcmUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHppbmRleCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGdsYXNzU3F1YXJlW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiei1pbmRleFwiKTtcclxuICAgICAgaWYgKCh6aW5kZXggIT09IFwiYXV0b1wiKSkge1xyXG4gICAgICAgIGlmIChuYXZpbmcpIHtcclxuICAgICAgICAgIGhpZ2hlc3QgPSBwYXJzZUludCh6aW5kZXgpICsgMjAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBoaWdoZXN0ID0gcGFyc2VJbnQoemluZGV4KSArIDE7XHJcbiAgICAgICAgICBuZXdBcnIucHVzaChoaWdoZXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZXdBcnIuc29ydChmdW5jdGlvbihhLCBiKSB7XHJcbiAgICAgIHJldHVybiBiIC0gYTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xyXG4gICAgICBpZiAobmV3QXJyWzBdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBuZXdBcnIudW5zaGlmdChwYXJzZUludChuZXdBcnJbMF0pKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChuZXdBcnJbMF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gbmV3QXJyWzBdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGhpZ2hlc3Q7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbnNldHRpbmdOZSgpO1xyXG5cclxuICBmdW5jdGlvbiBzZXR0aW5nTmUoKSB7XHJcblxyXG5cclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiKSk7XHJcblxyXG4gICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgZmFsc2UpKTtcclxuXHJcbiAgICAgIH0pO1xyXG5cclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0WjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiB0YXNrYmFyKCkge1xyXG4gIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgIGZpbmRUYXNrYmFyLmNsYXNzTGlzdC5hZGQoXCJ0YXNrLWFwcGVhclwiKTtcclxuICB9KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuYnJpbmdGb3J0aCA9IHRhc2tiYXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xyXG4gIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcclxuICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZEV4aXQubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgIGZpbmRFeGl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBib2R5KSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSB3aW5kb3dEZXN0cm95ZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIG5ld0NvdW50ZXIgPSAwO1xyXG52YXIgaGVpZ2h0ID0gMDtcclxudmFyIHdpZHRoID0gMDtcclxudmFyIGNvdW50aW5nID0gMDtcclxuXHJcbmZ1bmN0aW9uIHdpbmRvd1BsYWNlbWVudCgpIHtcclxuXHJcbiAgZnVuY3Rpb24gd2hlcmVUb1BsYWNlKCkge1xyXG4gICAgdmFyIGZpbmRBbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgICB2YXIgY291bnRlciA9IDA7XHJcbiAgICB2YXIgaSA9IDA7XHJcbiAgICBcclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xyXG4gICAgc2V0Wi5zZXQoKTtcclxuXHJcbiAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcclxuICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcclxuXHJcbiAgICBoZWlnaHQgKz0gMzA7XHJcbiAgICB3aWR0aCArPSAzMDtcclxuXHJcbiAgICBpZiAoKHdpZHRoKSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDUwMCkge1xyXG4gICAgICBuZXdDb3VudGVyID0gMDtcclxuICAgICAgd2lkdGggPSAzMDtcclxuICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyB3aWR0aCArIFwicHhcIjtcclxuICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyB3aWR0aCArIFwicHhcIjtcclxuICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoKGhlaWdodCkgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDQ1MCkge1xyXG4gICAgICBjb3VudGluZysrO1xyXG4gICAgICBoZWlnaHQgPSA1ICogY291bnRpbmc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3aGVyZVRvUGxhY2UoKTtcclxuXHJcblxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMucGxhY2UgPSB3aW5kb3dQbGFjZW1lbnQ7XHJcbiJdfQ==
