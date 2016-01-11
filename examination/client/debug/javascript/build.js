(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

var preloading = require("./preloading");
preloading.loading();

//Check on window icon

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
      console.log(event.target);
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
      saveTarget.parentElement.style.top = "0px";
    } else if (event.y - aVarY > window.innerHeight - saveTarget.parentElement.offsetHeight + saveTarget.parentElement.offsetHeight * 0.5) {
      saveTarget.parentElement.style.top = window.innerHeight - saveTarget.parentElement.offsetHeight + saveTarget.parentElement.offsetHeight * 0.5 + "px";
    } else {
      // console.log(window.innerHeight);
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
      console.log(this);
      if ((zindex > highest) && (zindex !== "auto")) {
        highest = zindex;
        newArr.push(highest);
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

      windows[counter - 1].addEventListener("mousedown", function() {
        this.style.zIndex = parseInt(higestZ(".window")) + 1;
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

function windowPlacement() {

  function whereToPlace() {
    var findAllWindows = document.querySelectorAll(".window");
    var counter = 0;
    var i = 0;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbnZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XHJcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcclxuXHJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcclxudGFza2Jhci5icmluZ0ZvcnRoKCk7XHJcblxyXG52YXIgcHJlbG9hZGluZyA9IHJlcXVpcmUoXCIuL3ByZWxvYWRpbmdcIik7XHJcbnByZWxvYWRpbmcubG9hZGluZygpO1xyXG5cclxuLy9DaGVjayBvbiB3aW5kb3cgaWNvblxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGNoYXRTZXR0aW5ncyhldmVudCkge1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5pY2stY2hhbmdlclwiKTtcclxuICB2YXIgbmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgbmlja2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcclxuICB2YXIgayA9IDA7XHJcbiAgdmFyIGogPSAwO1xyXG4gIHZhciBuZXdBcnIgPSBbXTtcclxuXHJcbiAgZm9yIChqID0gMDsgaiA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGogKz0gMSkge1xyXG4gICAgaysrO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmluZEFuZFNldChldmVudCkge1xyXG5cclxuICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XHJcbiAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwibmljay1jb2ctcm90YXRlXCIpO1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgY2hhbmdlQnV0dG9uW2sgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tOaWNrKCkge1xyXG5cclxuICB2YXIgbmlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xyXG4gIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgayA9IDA7XHJcbiAgdmFyIG5pY2tuYW1lID0gXCJcIjtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IG5pY2tJbnB1dC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaysrO1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcclxuICAgIG5pY2tuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKTtcclxuICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcclxuICB9IGVsc2Uge1xyXG4gICAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja05pY2s7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlQ2hhdCgpIHtcclxuXHJcbiAgdmFyIGZpbmRTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1Ym1pdFwiKTtcclxuICB2YXIgZmluZFRleHRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LW1lc3NcIik7XHJcbiAgdmFyIGZpbmROaWNrU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY2NlcHQtbmFtZVwiKTtcclxuICB2YXIgZmluZE5pY2tBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xyXG4gIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcclxuICB2YXIgZmluZE5hbWVGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcclxuICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XHJcbiAgdmFyIGVudGVyZWRNZXNzYWdlID0gXCJcIjtcclxuICB2YXIgY2hlY2tOaWNrID0gcmVxdWlyZShcIi4vY2hlY2tOaWNrXCIpO1xyXG4gIHZhciBjaGF0U2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jaGF0U2V0dGluZ3NcIik7XHJcbiAgdmFyIG5vUmVwZWF0Q291bnRlciA9IDA7XHJcblxyXG4gIHZhciBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIiwgXCJjaGF0dGV4dFwiKTtcclxuICBjaGF0U2V0dGluZ3MuY2hhbmdlKCk7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNoZWNrTmljay5jaGVjaygpO1xyXG4gICAgICBub1JlcGVhdENvdW50ZXIrKztcclxuICB9XHJcblxyXG4gIGZpbmROaWNrU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxyXG4gICAgaWYgKGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xyXG4gICAgICBkYXRhW1widXNlcm5hbWVcIl0gPSBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XHJcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmlja25hbWVcIiwgZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlKTtcclxuICAgICAgICBmaW5kTmFtZUZpZWxkW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGZpbmRTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xyXG4gICAgICBkYXRhW1widXNlcm5hbWVcIl0gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xyXG4gICAgICBkYXRhW1wiZGF0YVwiXSA9IGZpbmRUZXh0QXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgdmFyIGRhdGEgPSB7XHJcbiAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXHJcbiAgICBcImRhdGFcIiA6IFwiXCIsXHJcbiAgICBcInVzZXJuYW1lXCI6IFwiXCIsXHJcbiAgICBcImNoYW5uZWxcIjogXCJcIixcclxuICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIixcclxuICAgIFwic3VwZXJNZWdhQXdlc29tZU9zY2FyXCI6IFwidXNlclNlbnRcIlxyXG4gIH07XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcclxuICAgICAgICAvLyB0aGlzLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xyXG4gICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlID0gXCJcIjtcclxuICAgICAgfVxyXG5cclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XHJcbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uY2xpY2soKTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XHJcbiAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XHJcbiAgICB2YXIgaXNNZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuc3VwZXJNZWdhQXdlc29tZU9zY2FyO1xyXG4gICAgdmFyIGNoYXREYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5kYXRhO1xyXG4gICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcclxuICAgIHZhciBjcmVhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdERhdGEpO1xyXG4gICAgdmFyIGNyZWF0ZVVzZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0VXNlcik7XHJcbiAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcclxuICAgIHBUYWdNZXNzLmFwcGVuZENoaWxkKGNyZWF0ZVRleHQpO1xyXG4gICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnVXNlcik7XHJcbiAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcclxuXHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Q29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGlmIChjaGF0VXNlciAhPT0gbnVsbCAmJiBjaGF0RGF0YSAhPT0gdW5kZWZpbmVkICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICYmIGlzTWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBkaXZUYWdUZXh0LmNsYXNzTGlzdC5hZGQoXCJ1c2VyLXNlbnRcIik7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgIHRleHRDb250YWluZXJbaV0uYXBwZW5kQ2hpbGQoZGl2VGFnVGV4dCk7XHJcbiAgICAgICAgdGV4dENvbnRhaW5lcltpXS5zY3JvbGxUb3AgPSB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbEhlaWdodDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hhdCA9IGNyZWF0ZUNoYXQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY29sb3JTY2hlbWVlcigpIHtcclxuXHJcbiAgdmFyIGxvYWRTY2hlbWUgPSByZXF1aXJlKFwiLi9sb2FkU2NoZW1lXCIpO1xyXG4gIGxvYWRTY2hlbWUubG9hZCgpO1xyXG5cclxuICB2YXIgZmV0Y2hDb2xvciA9IHJlcXVpcmUoXCIuL2ZldGNoQ29sb3JcIik7XHJcbiAgZmV0Y2hDb2xvci5mZXRjaCgpO1xyXG5cclxuICB2YXIgc2V0Rm9udEZhbWlseSA9IHJlcXVpcmUoXCIuL3NldEZvbnRGYW1pbHlcIik7XHJcbiAgc2V0Rm9udEZhbWlseS5zZXQoKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBjb2xvclNjaGVtZWVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGZldGNoQ29sb3IoKSB7XHJcbiAgdmFyIGhleFNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xyXG4gIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jb2xvci1jb250YWluZXJcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBuZXdDb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBoZXhDb250YWluLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICB2YXIgaGV4SW4gPSBoZXhDb250YWluW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLXJvdyBpbnB1dFwiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGhleEluLmxlbmd0aDsgaSArPSAxKSB7XHJcblxyXG4gICAgbmV3Q291bnRlcisrO1xyXG5cclxuXHJcbiAgICBoZXhJbltpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgLy8gY29uc29sZS5sb2coc2F2ZVRhcmdldCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG5cclxuICAgICAgICAgIHNhdmVUYXJnZXQgPSBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdO1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xyXG4gICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMl0pIHtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsyXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xyXG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMl0pIHtcclxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA+PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZS5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xyXG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMl0pIHtcclxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vQ2hlY2sgaWYgZW50ZXJlZCB0ZXh0IGlzIHZhbGlkIGhleC5cclxuICAgICAgICAgIHZhciByZWcgPSAvXiMoW0EtRmEtZjAtOV17Nn18W0EtRmEtZjAtOV17M30pJC87XHJcblxyXG4gICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4YjMwMzBcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU5QUUzN1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XHJcblxyXG4gICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmZldGNoID0gZmV0Y2hDb2xvcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBsb2FkU2NoZW1lKCkge1xyXG4gIHZhciBmaW5kU3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kZXNpZ24tc3F1YXJlXCIpO1xyXG4gIHZhciB0ZW1wT25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkZXNpZ24tb25lXCIpO1xyXG4gIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcE9uZS5jb250ZW50LCB0cnVlKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG5cclxuICB2YXIgc2V0UG9pbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJlZm9yZS10aGlzXCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgZmluZFNxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgZmluZFNxdWFyZVtjb3VudGVyIC0gMV0uaW5zZXJ0QmVmb3JlKGNsb25lLCBzZXRQb2ludFtjb3VudGVyIC0gMV0pO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRTY2hlbWU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gc2V0Rm9udEZhbWlseSgpIHtcclxuICB2YXIgaGV4U3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vdmVyLXNxdWFyZSBpbnB1dFwiKTtcclxuICB2YXIgaGV4Q29udGFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIub3Zlci1zcXVhcmVcIik7XHJcbiAgdmFyIHRlbXBsYXRlc0hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaGVhZGVyLW9uZSBpbnB1dFwiKTtcclxuICB2YXIgc3dpdGNoQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zd2l0Y2gtY29udGFpbmVyXCIpO1xyXG4gIHZhciBzd2l0Y2hDb250YWluZXJCb2xkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zd2l0Y2gtY29udGFpbmVyLWJvbGRcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBuZXdDb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBoZXhDb250YWluLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICB2YXIgaGV4SW4gPSBoZXhDb250YWluW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XHJcbiAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiTE9SRU0gSVBTVU1cIjtcclxuXHJcblxyXG4gIGhleEluLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xyXG5cclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhzYXZlVGFyZ2V0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA2ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XHJcbiAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpID09PSBcIiNcIikge1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmNvbG9yID0gdGhpcy52YWx1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZS5zbGljZSgwLCAtMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0NoZWNrIGlmIGVudGVyZWQgdGV4dCBpcyB2YWxpZCBoZXguXHJcbiAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XHJcblxyXG4gICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2FlMzczN1wiO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OUFFMzdcIjtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcclxuXHJcbiAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgfSk7XHJcblxyXG4gIH0pO1xyXG5cclxuICBzd2l0Y2hDb250YWluZXJbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgaWYgKHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VyaWZcIikpIHtcclxuICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VyaWZcIik7XHJcbiAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJzZXJpZlwiKTtcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIyNXB4XCI7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIHN3aXRjaENvbnRhaW5lckJvbGRbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuICAgIGlmICh0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5jb250YWlucyhcImJvbGRcIikpIHtcclxuICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwiYm9sZFwiKTtcclxuICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIyNXB4XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJib2xkXCIpO1xyXG4gICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldEZvbnRGYW1pbHk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY2FyZFJhbmRvbWl6ZXIoKSB7XHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGNhcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgaiA9IDA7XHJcbiAgdmFyIGNhcmRBcnIgPSBbXTtcclxuICB2YXIgbmV3TnVtYmVyID0gMDtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcclxuICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcclxuICAgICAgY2FyZEFyci5wdXNoKGkgKyAxKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHNodWZmbGUoY2FyZEFycikge1xyXG4gICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aCwgdCwgaTtcclxuXHJcbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxyXG4gICAgd2hpbGUgKG0pIHtcclxuXHJcbiAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxyXG4gICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbS0tKTtcclxuXHJcbiAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cclxuICAgICAgdCA9IGNhcmRBcnJbbV07XHJcbiAgICAgIGNhcmRBcnJbbV0gPSBjYXJkQXJyW2ldO1xyXG4gICAgICBjYXJkQXJyW2ldID0gdDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2FyZEFycjtcclxufVxyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgbmV3Q291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgcmFuZG9tQW5kU2V0KCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJhbmRvbUFuZFNldCgpIHtcclxuICAgIHZhciBjb3VudGVyID0gMDtcclxuICAgIHZhciB3aW5kb3dDb3VudCA9IDA7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgd2luZG93Q291bnQrKztcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FyZHNJbldpbmRvd3MgPSB3aW5kb3dzW3dpbmRvd0NvdW50IC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XHJcbiAgICAgIG5ld051bWJlciA9IHNodWZmbGUoY2FyZEFycikuc3BsaWNlKDAsIDEpO1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICAgIGNhcmRzSW5XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQobmV3TnVtYmVyKTtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMucnVuID0gY2FyZFJhbmRvbWl6ZXI7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY2hlY2tQYWlyKCkge1xyXG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xyXG4gIHZhciBjb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIG5ld0FyciA9IFtdO1xyXG4gIHZhciB0YXJnZXRBcnIgPSBbXTtcclxuICB2YXIgc2F2ZVRhcmdldCA9IFtdO1xyXG4gIHZhciBuZXdDb3VudGVyID0gMDtcclxuICB2YXIgY2xpY2tzID0gMDtcclxuICB2YXIgdHJpZXMgPSAwO1xyXG4gIHZhciBwYWlyQ291bnRlciA9IDA7XHJcbiAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgd2luQ2hlY2sgPSByZXF1aXJlKFwiLi93aW5DaGVja1wiKTtcclxuXHJcbiAgZm9yIChpID0gMDsgaSA8IGNvbnRhaW5lci5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgdmFyIGNhcmRzSW5XaW5kb3cgPSBjb250YWluZXJbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcclxuICB2YXIgY291bnRlckluV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xpY2tDb3VudGVyXCIpO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgY2FyZHNJbldpbmRvdy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICB0aGlzLmNsaWNrKCk7XHJcbiAgICAgIH1cclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfSk7XHJcbiAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxpc3RlbmVyKGV2ZW50KSB7XHJcblxyXG4gIGlmIChjbGlja3MgPCAyKSB7XHJcblxyXG4gIGNsaWNrcyArPSAxO1xyXG5cclxuICB0cmllcyArPSAxO1xyXG5cclxuICB2YXIgZ2V0V2luZG93ID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gIHZhciBjdXJyZW50VGhlbWUgPSBnZXRXaW5kb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcclxuXHJcbiAgLy8gaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi9cIiArIHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUgKyBcIi5wbmcnKVwiO1xyXG5cclxuICAvLyB9IGVsc2Uge1xyXG4gIC8vICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xyXG4gIC8vIH1cclxuXHJcbiAgLy9Iw6RyIHNrYSBtYW4ga3VubmEgw6RuZHJhIHZpbGtlbiBiaWxkZW4gc2thIHZhcmEuXHJcblxyXG4gICAgaWYgKHRhcmdldEFyci5sZW5ndGggPj0gMikge1xyXG4gICAgICB0YXJnZXRBcnIubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA8IDIpIHtcclxuICAgICAgdGFyZ2V0QXJyLnB1c2godGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldEFyclswXSA9PT0gdGFyZ2V0QXJyWzFdKSB7XHJcbiAgICAgIHRhcmdldEFyciA9IHRhcmdldEFyci5zcGxpY2UoMCwgMSk7XHJcbiAgICAgIGNsaWNrcyA9IGNsaWNrcyAtPSAxO1xyXG4gICAgICB0cmllcyA9IHRyaWVzIC09IDE7XHJcbiAgICAgIHBhaXJDb3VudGVyID0gcGFpckNvdW50ZXIgLT0gMTtcclxuICAgIH1cclxuXHJcbiAgICBjb3VudGVySW5XaW5kb3cudGV4dENvbnRlbnQgPSB0cmllcztcclxuXHJcbiAgICAgIGlmICh0YXJnZXRBcnJbMF0gIT09IHRhcmdldEFyclsxXSkge1xyXG4gICAgICAgIGlmIChuZXdBcnIubGVuZ3RoIDwgMSkge1xyXG4gICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XHJcbiAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoIDwgMikge1xyXG4gICAgICAgICAgaWYodGFyZ2V0QXJyWzBdICYmIHRhcmdldEFyclsxXSkge1xyXG4gICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA+PSAyKSB7XHJcbiAgICAgICAgICAgIG5ld0Fyci5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICBpZiAobmV3QXJyWzBdICYmIG5ld0FyclsxXSkge1xyXG4gICAgICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XHJcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xyXG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcclxuICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUEFJUlwiKTtcclxuICAgICAgICAgICAgY2xpY2tzID0gMDtcclxuICAgICAgICAgICAgcGFpckNvdW50ZXIgKz0gMTtcclxuICAgICAgICAgICAgaWYgKHBhaXJDb3VudGVyID49IDgpIHtcclxuICAgICAgICAgICAgICB3aW5DaGVjay53aW4oY291bnRlckluV2luZG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAvLyB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiLzAucG5nJylcIjtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiLzAucG5nJylcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL1NhbW1hIHNvbSBncnVuZGVuLlxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PVCBBIFBBSVJcIik7XHJcbiAgICAgICAgICAgIGNsaWNrcyA9IDA7XHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG59XHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tQYWlyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZU1lbW9yeSgpIHtcclxuXHJcbiAgdmFyIGxvYWRpbmdDYXJkcyA9IHJlcXVpcmUoXCIuL2xvYWRpbmdDYXJkc1wiKTtcclxuICBsb2FkaW5nQ2FyZHMubG9hZCgpO1xyXG5cclxuICB2YXIgdGhlbWVDaGFuZ2VyID0gcmVxdWlyZShcIi4vdGhlbWVDaGFuZ2VyXCIpO1xyXG4gIHRoZW1lQ2hhbmdlci5jaGFuZ2UoKTtcclxuXHJcbiAgdmFyIHNldENhcmRzID0gcmVxdWlyZShcIi4vc2V0Q2FyZHNcIik7XHJcbiAgc2V0Q2FyZHMuc2V0KCk7XHJcblxyXG4gIHZhciBjYXJkUmFuZG9taXplciA9IHJlcXVpcmUoXCIuL2NhcmRSYW5kb21pemVyXCIpO1xyXG4gIGNhcmRSYW5kb21pemVyLnJ1bigpO1xyXG5cclxuICB2YXIgY2hlY2tQYWlyID0gcmVxdWlyZShcIi4vY2hlY2tQYWlyXCIpO1xyXG4gIGNoZWNrUGFpci5jaGVjaygpO1xyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlTWVtb3J5O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIGxvYWRpbmdDYXJkcygpIHtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnktdGVtcGxhdGVcIik7XHJcbiAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICB2YXIgY2xpY2tDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jbGlja0NvdW50ZXJcIik7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBjb3VudGVyKys7XHJcbiAgfVxyXG5cclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKVtjb3VudGVyIC0gMV0uaW5zZXJ0QmVmb3JlKGNsb25lLCBjbGlja0NvdW50ZXJbY291bnRlciAtIDFdKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkaW5nQ2FyZHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gc2V0Q2FyZHMoKSB7XHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG4gIHZhciBtZW1XaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG5cclxuICBmb3IgKGkgPSAwOyBpIDwgbWVtV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICBtZW1XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgbGFzdFRoZW1lKTtcclxuICB9IGVsc2Uge1xyXG4gICAgbWVtV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwicGxhaW5cIik7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhcmRzW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1pbWFnZVwiKSA9PT0gXCJub25lXCIpIHtcclxuICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xyXG4gICAgICAgIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XHJcbiAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICAgIH1cclxuICAgICAgLy9Iw6RyIGthbiBtYW4gw6RuZHJhIGdydW5kZW4uXHJcbiAgICB9XHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Q2FyZHM7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gdGhlbWVDaGFuZ2VyKCkge1xyXG4gIHZhciBoYXNDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGhlbWUtc2VsZWN0b3JcIik7XHJcbiAgdmFyIHRoZW1lcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKTtcclxuICB2YXIgYWxsQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XHJcbiAgdmFyIGNvdW50ZXIgPSAwO1xyXG4gIHZhciBuZXdDb3VudGVyID0gMDtcclxuICB2YXIgaSA9IDA7XHJcblxyXG4gIGZvciAoaSA9IDA7IGkgPCBoYXNDYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgY291bnRlcisrO1xyXG4gIH1cclxuXHJcbiAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKVtjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwicGxhaW5cIik7XHJcblxyXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XHJcbiAgICB9XHJcblxyXG4gIH0pO1xyXG5cclxuICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwicmVkXCIpO1xyXG5cclxuICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJyZWRcIik7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9yZWQvMC5wbmcnKVwiO1xyXG4gICAgfVxyXG5cclxuICB9KTtcclxuXHJcbiAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVsyXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcImJsdWVcIik7XHJcblxyXG4gICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImJsdWVcIik7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9ibHVlLzAucG5nJylcIjtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVszXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcImdyZWVuXCIpO1xyXG5cclxuICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJncmVlblwiKTtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcclxuICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL2dyZWVuLzAucG5nJylcIjtcclxuICAgIH1cclxuXHJcbiAgfSk7XHJcblxyXG5cclxuICB2YXIgdGhlbWVCdXR0b24gPSBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcclxuXHJcblxyXG4gIHRoZW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBicmluZ1RoZW1lKTtcclxuXHJcblxyXG4gIGZ1bmN0aW9uIGJyaW5nVGhlbWUoZXZlbnQpIHtcclxuICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XHJcbiAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcInRoZW1lLWZpZWxkLWdvbmVcIikpIHtcclxuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0aGVtZS1maWVsZC1nb25lXCIpO1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnJlbW92ZShcImNhcmQtY29udGFpbmVyLWFmdGVyXCIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmFkZChcInRoZW1lLWZpZWxkLWdvbmVcIik7XHJcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XHJcbiAgICAgIH1cclxuXHJcbiAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMuY2hhbmdlID0gdGhlbWVDaGFuZ2VyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHdpbkNoZWNrKGN1cnJlbnRXaW5kb3csIGNvbnRhaW5lcikge1xyXG4gIHZhciB5b3VXaW4gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllPVSBXSU4hXCIpO1xyXG4gIHZhciBicmVha2luZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCUlwiKTtcclxuICB2YXIgcHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xyXG4gIHB0YWcuYXBwZW5kQ2hpbGQoeW91V2luKTtcclxuICBwdGFnLmNsYXNzTGlzdC5hZGQoXCJ3aW5uaW5nLW1lc3NhZ2VcIik7XHJcbiAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChicmVha2luZyk7XHJcbiAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChwdGFnKTtcclxuICBjdXJyZW50V2luZG93LmNsYXNzTGlzdC5hZGQoXCJwcmVzZW50LWNsaWNrXCIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy53aW4gPSB3aW5DaGVjaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBtb3ZhYmxlKCkge1xyXG5cclxuXHJcbiAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBjb3VudGVyID0gMDtcclxuXHJcbiAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xyXG5cclxuICAgICAgLy9Mb29rIGZvciB0aGUgd2luZG93IGFuZCBhZGQgbW91c2Vkb3duICsgYW5kIG1vdXNldXBcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgICAgY291bnRlcisrO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBmaW5kV2luZG93c1tjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZURvd24sIGZhbHNlKTtcclxuXHJcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XHJcbiAgfVxyXG5cclxuICB2YXIgYVZhclkgPSAwO1xyXG4gIHZhciBhVmFyWCA9IDA7XHJcbiAgdmFyIHNhdmVUYXJnZXQgPSAwO1xyXG5cclxuICBmdW5jdGlvbiBtb3VzZURvd24oZXZlbnQpIHtcclxuXHJcbiAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lLnNsaWNlKDAsIDMpID09PSBcInRvcFwiKSB7XHJcbiAgICAgICAgYVZhclkgPSBldmVudC5vZmZzZXRZO1xyXG4gICAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcclxuICAgICAgICBzYXZlVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xyXG4gICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMC44NTtcclxuICAgICAgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbW91c2VVcChldmVudCkge1xyXG5cclxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBmaW5kV2luZG93c1tpXS5zdHlsZS5vcGFjaXR5ID0gMTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcclxuXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQueSAtIGFWYXJZIDwgMCkge1xyXG4gICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gXCIwcHhcIjtcclxuICAgIH0gZWxzZSBpZiAoZXZlbnQueSAtIGFWYXJZID4gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUpIHtcclxuICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICogMC41ICsgXCJweFwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gY29uc29sZS5sb2cod2luZG93LmlubmVySGVpZ2h0KTtcclxuICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXZlbnQueCAtIGFWYXJYIDwgMCkge1xyXG4gICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnggLSBhVmFyWCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41KSB7XHJcbiAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKiAwLjUgKyBcInB4XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnggLSBhVmFyWCArIFwicHhcIjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgfVxyXG5cclxuICBhZGRMaXN0ZW5lcnMoKTtcclxuXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5tb3ZlID0gbW92YWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBwcmVsb2FkaW5nKCkge1xyXG4gICAgaWYgKGRvY3VtZW50LmltYWdlcykge1xyXG4gICAgICB2YXIgaW1nMSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nNCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nNSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nNiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nNyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nOCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nOSA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgdmFyIGltZzEwID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcxMSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMTIgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzEzID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcxNCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMTUgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzE2ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcxNyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMTggPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgIHZhciBpbWcxOSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMjAgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzIxID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcyMiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMjMgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzI0ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIHZhciBpbWcyNSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICB2YXIgaW1nMjYgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgdmFyIGltZzI3ID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICB2YXIgaW1nMjggPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgIGltZzEuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzAucG5nXCI7XHJcbiAgICAgIGltZzIuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzEucG5nXCI7XHJcbiAgICAgIGltZzMuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzIucG5nXCI7XHJcbiAgICAgIGltZzQuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzMucG5nXCI7XHJcbiAgICAgIGltZzUuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzQucG5nXCI7XHJcbiAgICAgIGltZzYuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzUucG5nXCI7XHJcbiAgICAgIGltZzcuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzYucG5nXCI7XHJcbiAgICAgIGltZzguc3JjID0gXCIuLi9pbWFnZS9ibHVlLzcucG5nXCI7XHJcbiAgICAgIGltZzkuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzgucG5nXCI7XHJcblxyXG4gICAgICBpbWcxMC5zcmMgPSBcIi4uL2ltYWdlL3JlZC8wLnBuZ1wiO1xyXG4gICAgICBpbWcxMS5zcmMgPSBcIi4uL2ltYWdlL3JlZC8xLnBuZ1wiO1xyXG4gICAgICBpbWcxMi5zcmMgPSBcIi4uL2ltYWdlL3JlZC8yLnBuZ1wiO1xyXG4gICAgICBpbWcxMy5zcmMgPSBcIi4uL2ltYWdlL3JlZC8zLnBuZ1wiO1xyXG4gICAgICBpbWcxNC5zcmMgPSBcIi4uL2ltYWdlL3JlZC80LnBuZ1wiO1xyXG4gICAgICBpbWcxNS5zcmMgPSBcIi4uL2ltYWdlL3JlZC81LnBuZ1wiO1xyXG4gICAgICBpbWcxNi5zcmMgPSBcIi4uL2ltYWdlL3JlZC82LnBuZ1wiO1xyXG4gICAgICBpbWcxNy5zcmMgPSBcIi4uL2ltYWdlL3JlZC83LnBuZ1wiO1xyXG4gICAgICBpbWcxOC5zcmMgPSBcIi4uL2ltYWdlL3JlZC84LnBuZ1wiO1xyXG5cclxuICAgICAgaW1nMTkuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8wLnBuZ1wiO1xyXG4gICAgICBpbWcyMC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzEucG5nXCI7XHJcbiAgICAgIGltZzIxLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMi5wbmdcIjtcclxuICAgICAgaW1nMjIuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8zLnBuZ1wiO1xyXG4gICAgICBpbWcyMy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzQucG5nXCI7XHJcbiAgICAgIGltZzI0LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNS5wbmdcIjtcclxuICAgICAgaW1nMjUuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi82LnBuZ1wiO1xyXG4gICAgICBpbWcyNi5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzcucG5nXCI7XHJcbiAgICAgIGltZzI3LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vOC5wbmdcIjtcclxuXHJcbiAgICAgIGltZzI4LnNyYyA9IFwiLi4vaW1hZ2UvaWNvbnMvY29nZ3JleS5wbmdcIlxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5sb2FkaW5nID0gcHJlbG9hZGluZztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiByZW5kZXJXaW5kb3coZXZlbnQpIHtcclxuXHJcbiAgdmFyIG1vdmFibGUgPSByZXF1aXJlKFwiLi9tb3ZhYmxlXCIpO1xyXG4gIHZhciB3aW5kb3dEZXN0cm95ZXIgPSByZXF1aXJlKFwiLi93aW5kb3dEZXN0cm95ZXJcIik7XHJcbiAgdmFyIGNyZWF0ZU1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeS9jcmVhdGVNZW1vcnlcIik7XHJcbiAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jaGF0L2NyZWF0ZUNoYXRcIik7XHJcbiAgdmFyIGNvbG9yU2NoZW1lZXIgPSByZXF1aXJlKFwiLi9jb2xvclNjaGVtZWVyL2NvbG9yU2NoZW1lZXJcIik7XHJcbiAgdmFyIHdpbmRvd1BsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3dpbmRvd1BsYWNlbWVudFwiKTtcclxuICB2YXIgc2V0WiA9IHJlcXVpcmUoXCIuL3NldFpcIik7XHJcblxyXG4gIHZhciBpID0gMDtcclxuICB2YXIgbnVtYmVyID0gXCJcIjtcclxuXHJcbiAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XHJcbiAgICB2YXIgZmluZE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaWNvbjFcIik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcclxuXHJcbiAgICBmaW5kTmF2W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzBdKSB7XHJcbiAgICAgICAgcmVuZGVyKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzFdKSB7XHJcbiAgICAgICAgcmVuZGVyTWVtKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzJdKSB7XHJcbiAgICAgICAgcmVuZGVyU2NoZW1lZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICB9XHJcblxyXG4gIG5hdkNsaWNrKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHJlbmRlcigpIHtcclxuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcclxuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XHJcbiAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuXHJcbiAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcclxuICAgIGNyZWF0ZUNoYXQuY2hhdCgpO1xyXG4gICAgbW92YWJsZS5tb3ZlKCk7XHJcbiAgICBzZXRaLnNldCgpO1xyXG4gICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuXHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xyXG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcclxuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcclxuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcclxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcclxuXHJcbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xyXG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XHJcbiAgICAgIG1vdmFibGUubW92ZSgpO1xyXG4gICAgICBzZXRaLnNldCgpO1xyXG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gcmVuZGVyU2NoZW1lZSgpIHtcclxuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY2hlbWVlLXRlbXBsYXRlXCIpO1xyXG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xyXG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xyXG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xyXG5cclxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XHJcbiAgICAgIGNvbG9yU2NoZW1lZXIuaW5pdGlhbGl6ZSgpO1xyXG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcclxuICAgICAgc2V0Wi5zZXQoKTtcclxuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcclxuICB9XHJcblxyXG5cclxuICB9XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHNldFooKSB7XHJcbiAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcclxuICB2YXIgY291bnRlciA9IDA7XHJcbiAgdmFyIGkgPSAwO1xyXG4gIHZhciBqID0gMDtcclxuICB2YXIgbmV3Q291bnRlciA9IDA7XHJcbiAgdmFyIG5ld0FyciA9IFtdO1xyXG5cclxuICBmdW5jdGlvbiBoaWdlc3RaKHRoZVdpbmRvd3MpIHtcclxuXHJcbiAgICB2YXIgZ2xhc3NTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoZVdpbmRvd3MpO1xyXG4gICAgdmFyIGhpZ2hlc3QgPSAwO1xyXG5cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2xhc3NTcXVhcmUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHppbmRleCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGdsYXNzU3F1YXJlW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiei1pbmRleFwiKTtcclxuICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgIGlmICgoemluZGV4ID4gaGlnaGVzdCkgJiYgKHppbmRleCAhPT0gXCJhdXRvXCIpKSB7XHJcbiAgICAgICAgaGlnaGVzdCA9IHppbmRleDtcclxuICAgICAgICBuZXdBcnIucHVzaChoaWdoZXN0KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5ld0Fyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgcmV0dXJuIGIgLSBhO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKG5ld0FyclswXSA9PT0gbmV3QXJyWzFdKSB7XHJcbiAgICAgIGlmIChuZXdBcnJbMF0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIG5ld0Fyci51bnNoaWZ0KHBhcnNlSW50KG5ld0FyclswXSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG5ld0FyclswXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBuZXdBcnJbMF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gaGlnaGVzdDtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuc2V0dGluZ05lKCk7XHJcblxyXG4gIGZ1bmN0aW9uIHNldHRpbmdOZSgpIHtcclxuXHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xyXG4gICAgICBjb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHRoaXMuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIikpICsgMTtcclxuICAgICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldFo7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gdGFza2JhcigpIHtcclxuICB2YXIgZmluZFRhc2tiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmJyaW5nRm9ydGggPSB0YXNrYmFyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHdpbmRvd0Rlc3Ryb3llcigpIHtcclxuICB2YXIgZmluZEV4aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4aXRcIik7XHJcbiAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gYm9keSkge1xyXG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuXHJcbmZ1bmN0aW9uIHdpbmRvd1BsYWNlbWVudCgpIHtcclxuXHJcbiAgZnVuY3Rpb24gd2hlcmVUb1BsYWNlKCkge1xyXG4gICAgdmFyIGZpbmRBbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XHJcbiAgICB2YXIgY291bnRlciA9IDA7XHJcbiAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XHJcbiAgICAgIGNvdW50ZXIrKztcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIDMwICogY291bnRlciArIFwicHhcIjtcclxuICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIDMwICogY291bnRlciArIFwicHhcIjtcclxuICB9XHJcblxyXG4gIHdoZXJlVG9QbGFjZSgpO1xyXG5cclxuXHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5wbGFjZSA9IHdpbmRvd1BsYWNlbWVudDtcclxuIl19
