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

function chatSettings() {
    var changeButton = document.querySelectorAll(".nick-changer");
    var nicking = document.querySelectorAll(".enter-nick");
    var k = 0;
    var j = 0;

    for (j = 0; j < changeButton.length; j += 1) {
        k += 1;
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

    var i = 0;
    var k = 0;
    var nickname = "";

    for (i = 0; i < nickInput.length; i += 1) {
        k += 1;
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
    var findNameField = document.querySelectorAll(".name-field");
    var textContainer = document.querySelectorAll(".text-container");
    var checkNick = require("./checkNick");
    var chatSettings = require("./chatSettings");
    var noRepeatCounter = 0;

    var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
    chatSettings.change();
    for (var i = 0; i < findSubmit.length; i += 1) {
        checkNick.check();
        noRepeatCounter += 1;
    }

    findNickSubmit[noRepeatCounter - 1].addEventListener("click", function() {
        // *Hide after use - send to local storage  -> *Ish
        if (findNickArea[noRepeatCounter - 1].value !== "") {
            data.username = findNickArea[noRepeatCounter - 1].value;
            localStorage.setItem("nickname", findNickArea[noRepeatCounter - 1].value);
            findNameField[noRepeatCounter - 1].classList.add("name-field-gone");
            textContainer[noRepeatCounter - 1].classList.add("text-container-after");
        }
    });

    findSubmit[noRepeatCounter - 1].addEventListener("click", function() {
        if (localStorage.nickname !== "") {
            data.username = localStorage.getItem("nickname");
            data.data = findTextArea[noRepeatCounter - 1].value;
        }
    });

    var data = {
        "type": "message",
        "data": "",
        "username": "",
        "channel": "",
        "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd",
        "superMegaAwesomeOscar": "userSent"
    };

    socket.addEventListener("open", function(event) {
        var i = 0;
        var counter = 0;

        for (i = 0; i < findSubmit.length; i += 1) {
            counter += 1;
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

    socket.addEventListener("message", function(event) {
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
    var hexContain = document.querySelectorAll(".color-container");
    var counter = 0;
    var newCounter = 0;
    var i = 0;

    for (i = 0; i < hexContain.length; i += 1) {
        counter += 1;
    }

    var hexIn = hexContain[counter - 1].querySelectorAll(".color-row input");

    for (i = 0; i < hexIn.length; i += 1) {

        newCounter += 1;

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
        counter += 1;
    }

    findSquare[counter - 1].insertBefore(clone, setPoint[counter - 1]);

}

module.exports.load = loadScheme;

},{}],8:[function(require,module,exports){
"use strict";

function setFontFamily() {
    var hexContain = document.querySelectorAll(".over-square");
    var templatesHeader = document.querySelectorAll(".header-one input");
    var switchContainer = document.querySelectorAll(".switch-container");
    var switchContainerBold = document.querySelectorAll(".switch-container-bold");
    var counter = 0;
    var i = 0;

    for (i = 0; i < hexContain.length; i += 1) {
        counter += 1;
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
    var windows = document.querySelectorAll(".window");
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
        var m = cardArr.length;
        var t;
        var i;

        // While there remain elements to shuffle…
        while (m) {

            // Pick a remaining element…
            i = Math.floor(Math.random() * (m -= 1));

            // And swap it with the current element.
            t = cardArr[m];
            cardArr[m] = cardArr[i];
            cardArr[i] = t;
        }

        return cardArr;
    }

    for (i = 0; i < windows.length; i += 1) {
        newCounter += 1;
    }

    function randomAndSet() {
        var counter = 0;
        var windowCount = 0;

        for (i = 0; i < windows.length; i += 1) {
            windowCount += 1;
        }

        var cardsInWindows = windows[windowCount - 1].querySelectorAll(".card");

        for (i = 0; i < 16; i += 1) {
            newNumber = shuffle(cardArr).splice(0, 1);
            counter += 1;
            cardsInWindows[counter - 1].parentElement.classList.add(newNumber);
        }

    }

    randomAndSet();

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
    var clicks = 0;
    var tries = 0;
    var pairCounter = 0;
    var winCheck = require("./winCheck");

    for (i = 0; i < container.length; i += 1) {
        counter += 1;
    }

    var cardsInWindow = container[counter - 1].querySelectorAll(".card");
    var counterInWindow = container[counter - 1].parentElement.querySelector(".clickCounter");

    function checkEnter() {
        if (event.keyCode === 13) {
            this.click();
        }

        event.preventDefault();
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
                pairCounter = pairCounter -= 1;
            }

            counterInWindow.textContent = tries;

            if (targetArr[0] !== targetArr[1]) {
                if (newArr.length < 1) {
                    newArr.push(this.parentElement.className);
                    saveTarget.push(this);
                } else if (newArr.length < 2) {
                    if (targetArr[0] && targetArr[1]) {
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

    for (i = 0; i < cardsInWindow.length; i += 1) {
        cardsInWindow[i].addEventListener("keypress", checkEnter);
        cardsInWindow[i].addEventListener("click", listener);
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
        counter += 1;
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
        counter += 1;
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
    var counter = 0;
    var i = 0;

    for (i = 0; i < hasCards.length; i += 1) {
        counter += 1;
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

    themeButton.addEventListener("click", bringTheme);

}

module.exports.change = themeChanger;

},{}],15:[function(require,module,exports){
"use strict";

function winCheck(currentWindow) {
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
            counter += 1;
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

    function mouseUp() {

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

}

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

        img28.src = "../image/icons/coggrey.png";
    }
}

module.exports.loading = preloading;

},{}],18:[function(require,module,exports){
"use strict";

function renderWindow() {

    var movable = require("./movable");
    var windowDestroyer = require("./windowDestroyer");
    var createMemory = require("./memory/createMemory");
    var createChat = require("./chat/createChat");
    var colorSchemeer = require("./colorSchemeer/colorSchemeer");
    var windowPlacement = require("./windowPlacement");
    var setZ = require("./setZ");

    function navClick() {
        var findNav = document.querySelectorAll(".icon1");

        function checkNav(event) {
            if (event.target === findNav[0]) {
                render();
            } else if (event.target === findNav[1]) {
                renderMem();
            } else if (event.target === findNav[2]) {
                renderSchemee();
            }

        }

        for (var i = 0; i < findNav.length; i += 1) {

            findNav[i].addEventListener("click", checkNav);

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
    var newArr = [];

    // for (j = 0; j < 4; j += 1) {

    // }

    function higestZ(theWindows, naving) {

        var glassSquare = document.querySelectorAll(theWindows);
        var highest = 0;

        for (var i = 0; i < glassSquare.length; i += 1) {
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

    nav.style.zIndex = parseInt(higestZ(".window", true));

    function settingNe() {

        for (i = 0; i < windows.length; i += 1) {
            counter += 1;
        }

        windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

        windows[counter - 1].addEventListener("mousedown", function() {
            this.style.zIndex = parseInt(higestZ(".window", false));

        });

    }

    settingNe();

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

    function removing(event) {
        if (event.target.parentElement.parentElement.parentElement !== body) {
            event.target.parentElement.parentElement.parentElement.remove();
        }
    }

    for (var i = 0; i < findExit.length; i += 1) {
        findExit[i].addEventListener("click", removing);
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
            counter += 1;
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
            counting += 1;
            height = 5 * counting;
        }
    }

    whereToPlace();

}

module.exports.place = windowPlacement;

},{"./setZ":19}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxudmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcclxucmVuZGVyV2luZG93LnJlbmRlcigpO1xyXG5cclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xyXG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcclxuXHJcbnZhciBwcmVsb2FkaW5nID0gcmVxdWlyZShcIi4vcHJlbG9hZGluZ1wiKTtcclxucHJlbG9hZGluZy5sb2FkaW5nKCk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGF0U2V0dGluZ3MoKSB7XG4gICAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmljay1jaGFuZ2VyXCIpO1xuICAgIHZhciBuaWNraW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xuICAgIHZhciBrID0gMDtcbiAgICB2YXIgaiA9IDA7XG5cbiAgICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlQnV0dG9uLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGsgKz0gMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kQW5kU2V0KGV2ZW50KSB7XG5cbiAgICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwibmljay1jb2ctcm90YXRlXCIpO1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnJlbW92ZShcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNoYW5nZUJ1dHRvbltrIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZpbmRBbmRTZXQpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IGNoYXRTZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGVja05pY2soKSB7XG5cbiAgICB2YXIgbmlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrID0gMDtcbiAgICB2YXIgbmlja25hbWUgPSBcIlwiO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG5pY2tJbnB1dC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBrICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcbiAgICAgICAgbmlja25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xuICAgICAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrTmljaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xuXG4gICAgdmFyIGZpbmRTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1Ym1pdFwiKTtcbiAgICB2YXIgZmluZFRleHRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LW1lc3NcIik7XG4gICAgdmFyIGZpbmROaWNrU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY2NlcHQtbmFtZVwiKTtcbiAgICB2YXIgZmluZE5pY2tBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xuICAgIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xuICAgIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY2hlY2tOaWNrID0gcmVxdWlyZShcIi4vY2hlY2tOaWNrXCIpO1xuICAgIHZhciBjaGF0U2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jaGF0U2V0dGluZ3NcIik7XG4gICAgdmFyIG5vUmVwZWF0Q291bnRlciA9IDA7XG5cbiAgICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XG4gICAgY2hhdFNldHRpbmdzLmNoYW5nZSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjaGVja05pY2suY2hlY2soKTtcbiAgICAgICAgbm9SZXBlYXRDb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAqSGlkZSBhZnRlciB1c2UgLSBzZW5kIHRvIGxvY2FsIHN0b3JhZ2UgIC0+ICpJc2hcbiAgICAgICAgaWYgKGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZGF0YS51c2VybmFtZSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmlja25hbWVcIiwgZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlKTtcbiAgICAgICAgICAgIGZpbmROYW1lRmllbGRbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIHRleHRDb250YWluZXJbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBmaW5kU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZGF0YS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XG4gICAgICAgICAgICBkYXRhLmRhdGEgPSBmaW5kVGV4dEFyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciBkYXRhID0ge1xuICAgICAgICBcInR5cGVcIjogXCJtZXNzYWdlXCIsXG4gICAgICAgIFwiZGF0YVwiOiBcIlwiLFxuICAgICAgICBcInVzZXJuYW1lXCI6IFwiXCIsXG4gICAgICAgIFwiY2hhbm5lbFwiOiBcIlwiLFxuICAgICAgICBcImtleVwiOiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCIsXG4gICAgICAgIFwic3VwZXJNZWdhQXdlc29tZU9zY2FyXCI6IFwidXNlclNlbnRcIlxuICAgIH07XG5cbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRTdWJtaXRbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgIT09IFwiXCIgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHRoaXMucmVtb3ZlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG4gICAgICAgICAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5jbGljaygpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHBUYWdVc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgICAgIHZhciBwVGFnTWVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICAgIHZhciBpc01lID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5zdXBlck1lZ2FBd2Vzb21lT3NjYXI7XG4gICAgICAgIHZhciBjaGF0RGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGF0YTtcbiAgICAgICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcbiAgICAgICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XG4gICAgICAgIHZhciBjcmVhdGVVc2VyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdFVzZXIpO1xuICAgICAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcbiAgICAgICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XG4gICAgICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ1VzZXIpO1xuICAgICAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChjaGF0VXNlciAhPT0gbnVsbCAmJiBjaGF0RGF0YSAhPT0gdW5kZWZpbmVkICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhdFVzZXIgPT09IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgJiYgaXNNZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpdlRhZ1RleHQuY2xhc3NMaXN0LmFkZChcInVzZXItc2VudFwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLmFwcGVuZENoaWxkKGRpdlRhZ1RleHQpO1xuICAgICAgICAgICAgICAgIHRleHRDb250YWluZXJbaV0uc2Nyb2xsVG9wID0gdGV4dENvbnRhaW5lcltpXS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY29sb3JTY2hlbWVlcigpIHtcclxuXHJcbiAgICB2YXIgbG9hZFNjaGVtZSA9IHJlcXVpcmUoXCIuL2xvYWRTY2hlbWVcIik7XHJcbiAgICBsb2FkU2NoZW1lLmxvYWQoKTtcclxuXHJcbiAgICB2YXIgZmV0Y2hDb2xvciA9IHJlcXVpcmUoXCIuL2ZldGNoQ29sb3JcIik7XHJcbiAgICBmZXRjaENvbG9yLmZldGNoKCk7XHJcblxyXG4gICAgdmFyIHNldEZvbnRGYW1pbHkgPSByZXF1aXJlKFwiLi9zZXRGb250RmFtaWx5XCIpO1xyXG4gICAgc2V0Rm9udEZhbWlseS5zZXQoKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBjb2xvclNjaGVtZWVyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZmV0Y2hDb2xvcigpIHtcbiAgICB2YXIgaGV4Q29udGFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3ItY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleEluLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgbmV3Q291bnRlciArPSAxO1xuXG4gICAgICAgIGhleEluW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2F2ZVRhcmdldCk7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzYXZlVGFyZ2V0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQgPSBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA2ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblszXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsyXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA+PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWUuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgZW50ZXJlZCB0ZXh0IGlzIHZhbGlkIGhleC5cbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezN9KSQvO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4YjMwMzBcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPCA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMuZmV0Y2ggPSBmZXRjaENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGxvYWRTY2hlbWUoKSB7XG4gICAgdmFyIGZpbmRTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRlc2lnbi1zcXVhcmVcIik7XG4gICAgdmFyIHRlbXBPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rlc2lnbi1vbmVcIik7XG4gICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wT25lLmNvbnRlbnQsIHRydWUpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB2YXIgc2V0UG9pbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJlZm9yZS10aGlzXCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRTcXVhcmUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGZpbmRTcXVhcmVbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgc2V0UG9pbnRbY291bnRlciAtIDFdKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRGb250RmFtaWx5KCkge1xuICAgIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vdmVyLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcGxhdGVzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oZWFkZXItb25lIGlucHV0XCIpO1xuICAgIHZhciBzd2l0Y2hDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXJcIik7XG4gICAgdmFyIHN3aXRjaENvbnRhaW5lckJvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXItYm9sZFwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcbiAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLnZhbHVlID0gXCJMT1JFTSBJUFNVTVwiO1xuXG4gICAgaGV4SW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNhdmVUYXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDYgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuY29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpID09PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuY29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA+PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ2hlY2sgaWYgZW50ZXJlZCB0ZXh0IGlzIHZhbGlkIGhleC5cbiAgICAgICAgICAgIHZhciByZWcgPSAvXiMoW0EtRmEtZjAtOV17Nn18W0EtRmEtZjAtOV17M30pJC87XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNykge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2FlMzczN1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgc3dpdGNoQ29udGFpbmVyW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZXJpZlwiKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgc3dpdGNoQ29udGFpbmVyQm9sZFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJib2xkXCIpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJib2xkXCIpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIyNXB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJib2xkXCIpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldEZvbnRGYW1pbHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2FyZFJhbmRvbWl6ZXIoKSB7XG4gICAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBjYXJkQXJyID0gW107XG4gICAgdmFyIG5ld051bWJlciA9IDA7XG4gICAgdmFyIG5ld0NvdW50ZXIgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgMjsgaiArPSAxKSB7XG4gICAgICAgICAgICBjYXJkQXJyLnB1c2goaSArIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShjYXJkQXJyKSB7XG4gICAgICAgIHZhciBtID0gY2FyZEFyci5sZW5ndGg7XG4gICAgICAgIHZhciB0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxuICAgICAgICB3aGlsZSAobSkge1xuXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnTigKZcbiAgICAgICAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobSAtPSAxKSk7XG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHQgPSBjYXJkQXJyW21dO1xuICAgICAgICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XG4gICAgICAgICAgICBjYXJkQXJyW2ldID0gdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYXJkQXJyO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG5ld0NvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5kb21BbmRTZXQoKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdmFyIHdpbmRvd0NvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgd2luZG93Q291bnQgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYXJkc0luV2luZG93cyA9IHdpbmRvd3Nbd2luZG93Q291bnQgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICAgIG5ld051bWJlciA9IHNodWZmbGUoY2FyZEFycikuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgY2FyZHNJbldpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChuZXdOdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByYW5kb21BbmRTZXQoKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5ydW4gPSBjYXJkUmFuZG9taXplcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGVja1BhaXIoKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbmV3QXJyID0gW107XG4gICAgdmFyIHRhcmdldEFyciA9IFtdO1xuICAgIHZhciBzYXZlVGFyZ2V0ID0gW107XG4gICAgdmFyIGNsaWNrcyA9IDA7XG4gICAgdmFyIHRyaWVzID0gMDtcbiAgICB2YXIgcGFpckNvdW50ZXIgPSAwO1xuICAgIHZhciB3aW5DaGVjayA9IHJlcXVpcmUoXCIuL3dpbkNoZWNrXCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGNvbnRhaW5lci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgdmFyIGNhcmRzSW5XaW5kb3cgPSBjb250YWluZXJbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcbiAgICB2YXIgY291bnRlckluV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY2xpY2tDb3VudGVyXCIpO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tFbnRlcigpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLmNsaWNrKCk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKGNsaWNrcyA8IDIpIHtcblxuICAgICAgICAgICAgY2xpY2tzICs9IDE7XG5cbiAgICAgICAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgICAgICAgIHZhciBnZXRXaW5kb3cgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgY3VycmVudFRoZW1lID0gZ2V0V2luZG93LmdldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIik7XG5cbiAgICAgICAgICAgIC8vIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvXCIgKyB0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lICsgXCIucG5nJylcIjtcblxuICAgICAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICAvL0jDpHIgc2thIG1hbiBrdW5uYSDDpG5kcmEgdmlsa2VuIGJpbGRlbiBza2EgdmFyYS5cblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyci5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIucHVzaCh0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyclswXSA9PT0gdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyID0gdGFyZ2V0QXJyLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICBjbGlja3MgPSBjbGlja3MgLT0gMTtcbiAgICAgICAgICAgICAgICBwYWlyQ291bnRlciA9IHBhaXJDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvdW50ZXJJbldpbmRvdy50ZXh0Q29udGVudCA9IHRyaWVzO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdICE9PSB0YXJnZXRBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3QXJyLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5ld0Fyci5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRBcnJbMF0gJiYgdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0Fyci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKG5ld0FyclswXSAmJiBuZXdBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0FyclswXSA9PT0gbmV3QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUEFJUlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja3MgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJDb3VudGVyICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhaXJDb3VudGVyID49IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luQ2hlY2sud2luKGNvdW50ZXJJbldpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vU2FtbWEgc29tIGdydW5kZW4uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJOT1QgQSBQQUlSXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkc0luV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGNoZWNrRW50ZXIpO1xuICAgICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcik7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrUGFpcjtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xyXG5cclxuICB2YXIgbG9hZGluZ0NhcmRzID0gcmVxdWlyZShcIi4vbG9hZGluZ0NhcmRzXCIpO1xyXG4gIGxvYWRpbmdDYXJkcy5sb2FkKCk7XHJcblxyXG4gIHZhciB0aGVtZUNoYW5nZXIgPSByZXF1aXJlKFwiLi90aGVtZUNoYW5nZXJcIik7XHJcbiAgdGhlbWVDaGFuZ2VyLmNoYW5nZSgpO1xyXG5cclxuICB2YXIgc2V0Q2FyZHMgPSByZXF1aXJlKFwiLi9zZXRDYXJkc1wiKTtcclxuICBzZXRDYXJkcy5zZXQoKTtcclxuXHJcbiAgdmFyIGNhcmRSYW5kb21pemVyID0gcmVxdWlyZShcIi4vY2FyZFJhbmRvbWl6ZXJcIik7XHJcbiAgY2FyZFJhbmRvbWl6ZXIucnVuKCk7XHJcblxyXG4gIHZhciBjaGVja1BhaXIgPSByZXF1aXJlKFwiLi9jaGVja1BhaXJcIik7XHJcbiAgY2hlY2tQYWlyLmNoZWNrKCk7XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBsb2FkaW5nQ2FyZHMoKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5LXRlbXBsYXRlXCIpO1xuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNsaWNrQ291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2xpY2tDb3VudGVyXCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIGNsaWNrQ291bnRlcltjb3VudGVyIC0gMV0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkaW5nQ2FyZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0Q2FyZHMoKSB7XG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICAgIHZhciBtZW1XaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG1lbVdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBsYXN0VGhlbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoY2FyZHNbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0jDpHIga2FuIG1hbiDDpG5kcmEgZ3J1bmRlbi5cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiB0aGVtZUNoYW5nZXIoKSB7XG4gICAgdmFyIGhhc0NhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50aGVtZS1zZWxlY3RvclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhhc0NhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwicGxhaW5cIik7XG5cbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwicmVkXCIpO1xuXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJyZWRcIik7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcmVkLzAucG5nJylcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwiYmx1ZVwiKTtcblxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwiYmx1ZVwiKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9ibHVlLzAucG5nJylcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVszXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBcImdyZWVuXCIpO1xuXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJncmVlblwiKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9ncmVlbi8wLnBuZycpXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgdmFyIHRoZW1lQnV0dG9uID0gaGFzQ2FyZHNbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICBmdW5jdGlvbiBicmluZ1RoZW1lKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwibmljay1jb2ctcm90YXRlXCIpO1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJ0aGVtZS1maWVsZC1nb25lXCIpKSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0aGVtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5hZGQoXCJ0aGVtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHRoZW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBicmluZ1RoZW1lKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSB0aGVtZUNoYW5nZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gd2luQ2hlY2soY3VycmVudFdpbmRvdykge1xuICAgIHZhciB5b3VXaW4gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllPVSBXSU4hXCIpO1xuICAgIHZhciBicmVha2luZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCUlwiKTtcbiAgICB2YXIgcHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgIHB0YWcuYXBwZW5kQ2hpbGQoeW91V2luKTtcbiAgICBwdGFnLmNsYXNzTGlzdC5hZGQoXCJ3aW5uaW5nLW1lc3NhZ2VcIik7XG4gICAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChicmVha2luZyk7XG4gICAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChwdGFnKTtcbiAgICBjdXJyZW50V2luZG93LmNsYXNzTGlzdC5hZGQoXCJwcmVzZW50LWNsaWNrXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy53aW4gPSB3aW5DaGVjaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBtb3ZhYmxlKCkge1xuXG4gICAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblxuICAgICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRXaW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgdmFyIGFWYXJZID0gMDtcbiAgICB2YXIgYVZhclggPSAwO1xuICAgIHZhciBzYXZlVGFyZ2V0ID0gMDtcblxuICAgIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xuXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lLnNsaWNlKDAsIDMpID09PSBcInRvcFwiKSB7XG4gICAgICAgICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgICAgICAgICBhVmFyWCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDAuODU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZmluZFdpbmRvd3NbaV0uc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpdk1vdmUoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnkgLSBhVmFyWSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnkgLSBhVmFyWSk7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC55IC0gYVZhclkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAqIDAuNSkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICogMC41ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC54IC0gYVZhclggPCAwKSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQueCAtIGFWYXJYID4gd2luZG93LmlubmVyV2lkdGggLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKiAwLjUpIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKiAwLjUgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnggLSBhVmFyWCArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXJzKCk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gcHJlbG9hZGluZygpIHtcbiAgICBpZiAoZG9jdW1lbnQuaW1hZ2VzKSB7XG4gICAgICAgIHZhciBpbWcxID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWczID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc0ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc1ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc3ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc4ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc5ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgdmFyIGltZzEwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzEzID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTggPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICB2YXIgaW1nMTkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIzID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHZhciBpbWcyOCA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGltZzEuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzAucG5nXCI7XG4gICAgICAgIGltZzIuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzEucG5nXCI7XG4gICAgICAgIGltZzMuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzIucG5nXCI7XG4gICAgICAgIGltZzQuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzMucG5nXCI7XG4gICAgICAgIGltZzUuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzQucG5nXCI7XG4gICAgICAgIGltZzYuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzUucG5nXCI7XG4gICAgICAgIGltZzcuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzYucG5nXCI7XG4gICAgICAgIGltZzguc3JjID0gXCIuLi9pbWFnZS9ibHVlLzcucG5nXCI7XG4gICAgICAgIGltZzkuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzgucG5nXCI7XG5cbiAgICAgICAgaW1nMTAuc3JjID0gXCIuLi9pbWFnZS9yZWQvMC5wbmdcIjtcbiAgICAgICAgaW1nMTEuc3JjID0gXCIuLi9pbWFnZS9yZWQvMS5wbmdcIjtcbiAgICAgICAgaW1nMTIuc3JjID0gXCIuLi9pbWFnZS9yZWQvMi5wbmdcIjtcbiAgICAgICAgaW1nMTMuc3JjID0gXCIuLi9pbWFnZS9yZWQvMy5wbmdcIjtcbiAgICAgICAgaW1nMTQuc3JjID0gXCIuLi9pbWFnZS9yZWQvNC5wbmdcIjtcbiAgICAgICAgaW1nMTUuc3JjID0gXCIuLi9pbWFnZS9yZWQvNS5wbmdcIjtcbiAgICAgICAgaW1nMTYuc3JjID0gXCIuLi9pbWFnZS9yZWQvNi5wbmdcIjtcbiAgICAgICAgaW1nMTcuc3JjID0gXCIuLi9pbWFnZS9yZWQvNy5wbmdcIjtcbiAgICAgICAgaW1nMTguc3JjID0gXCIuLi9pbWFnZS9yZWQvOC5wbmdcIjtcblxuICAgICAgICBpbWcxOS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzAucG5nXCI7XG4gICAgICAgIGltZzIwLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMS5wbmdcIjtcbiAgICAgICAgaW1nMjEuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8yLnBuZ1wiO1xuICAgICAgICBpbWcyMi5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzMucG5nXCI7XG4gICAgICAgIGltZzIzLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNC5wbmdcIjtcbiAgICAgICAgaW1nMjQuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi81LnBuZ1wiO1xuICAgICAgICBpbWcyNS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzYucG5nXCI7XG4gICAgICAgIGltZzI2LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNy5wbmdcIjtcbiAgICAgICAgaW1nMjcuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi84LnBuZ1wiO1xuXG4gICAgICAgIGltZzI4LnNyYyA9IFwiLi4vaW1hZ2UvaWNvbnMvY29nZ3JleS5wbmdcIjtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmxvYWRpbmcgPSBwcmVsb2FkaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHJlbmRlcldpbmRvdygpIHtcblxuICAgIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcbiAgICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xuICAgIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnkvY3JlYXRlTWVtb3J5XCIpO1xuICAgIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY2hhdC9jcmVhdGVDaGF0XCIpO1xuICAgIHZhciBjb2xvclNjaGVtZWVyID0gcmVxdWlyZShcIi4vY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyXCIpO1xuICAgIHZhciB3aW5kb3dQbGFjZW1lbnQgPSByZXF1aXJlKFwiLi93aW5kb3dQbGFjZW1lbnRcIik7XG4gICAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xuXG4gICAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XG4gICAgICAgIHZhciBmaW5kTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pY29uMVwiKTtcblxuICAgICAgICBmdW5jdGlvbiBjaGVja05hdihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMV0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXJNZW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzJdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyU2NoZW1lZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tOYXYpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5hdkNsaWNrKCk7XG5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcbiAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgICAgY3JlYXRlQ2hhdC5jaGF0KCk7XG4gICAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgICBzZXRaLnNldCgpO1xuICAgICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3ctdGVtcGxhdGVcIik7XG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XG5cbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xuICAgICAgY3JlYXRlTWVtb3J5LmNyZWF0ZSgpO1xuICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICBzZXRaLnNldCgpO1xuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gICAgZnVuY3Rpb24gcmVuZGVyU2NoZW1lZSgpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NoZW1lZS10ZW1wbGF0ZVwiKTtcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICBjb2xvclNjaGVtZWVyLmluaXRpYWxpemUoKTtcbiAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0WigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbmV3QXJyID0gW107XG5cbiAgICAvLyBmb3IgKGogPSAwOyBqIDwgNDsgaiArPSAxKSB7XG5cbiAgICAvLyB9XG5cbiAgICBmdW5jdGlvbiBoaWdlc3RaKHRoZVdpbmRvd3MsIG5hdmluZykge1xuXG4gICAgICAgIHZhciBnbGFzc1NxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhlV2luZG93cyk7XG4gICAgICAgIHZhciBoaWdoZXN0ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdsYXNzU3F1YXJlLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB2YXIgemluZGV4ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2xhc3NTcXVhcmVbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJ6LWluZGV4XCIpO1xuICAgICAgICAgICAgaWYgKCh6aW5kZXggIT09IFwiYXV0b1wiKSkge1xuICAgICAgICAgICAgICAgIGlmIChuYXZpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAyMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaChoaWdoZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBuZXdBcnIuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYiAtIGE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xuICAgICAgICAgICAgaWYgKG5ld0FyclswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbmV3QXJyLnVuc2hpZnQocGFyc2VJbnQobmV3QXJyWzBdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmV3QXJyWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXdBcnJbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGlnaGVzdDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmF2LnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIsIHRydWUpKTtcblxuICAgIGZ1bmN0aW9uIHNldHRpbmdOZSgpIHtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIikpO1xuXG4gICAgICAgIHdpbmRvd3NbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIsIGZhbHNlKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzZXR0aW5nTmUoKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRaO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiB0YXNrYmFyKCkge1xyXG4gICAgdmFyIGZpbmRUYXNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XHJcbiAgfSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmJyaW5nRm9ydGggPSB0YXNrYmFyO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xuICAgIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZpbmcoZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gYm9keSkge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kRXhpdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZpbmcpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMuZGVzdHJveSA9IHdpbmRvd0Rlc3Ryb3llcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbmV3Q291bnRlciA9IDA7XG52YXIgaGVpZ2h0ID0gMDtcbnZhciB3aWR0aCA9IDA7XG52YXIgY291bnRpbmcgPSAwO1xuXG5mdW5jdGlvbiB3aW5kb3dQbGFjZW1lbnQoKSB7XG5cbiAgICBmdW5jdGlvbiB3aGVyZVRvUGxhY2UoKSB7XG4gICAgICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHZhciBpID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZEFsbFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZXRaID0gcmVxdWlyZShcIi4vc2V0WlwiKTtcbiAgICAgICAgc2V0Wi5zZXQoKTtcblxuICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcbiAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgMzAgKiBuZXdDb3VudGVyICsgXCJweFwiO1xuXG4gICAgICAgIGhlaWdodCArPSAzMDtcbiAgICAgICAgd2lkdGggKz0gMzA7XG5cbiAgICAgICAgaWYgKCh3aWR0aCkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA1MDApIHtcbiAgICAgICAgICAgIG5ld0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgd2lkdGggPSAzMDtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChoZWlnaHQpID4gd2luZG93LmlubmVyV2lkdGggLSA0NTApIHtcbiAgICAgICAgICAgIGNvdW50aW5nICs9IDE7XG4gICAgICAgICAgICBoZWlnaHQgPSA1ICogY291bnRpbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aGVyZVRvUGxhY2UoKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5wbGFjZSA9IHdpbmRvd1BsYWNlbWVudDtcbiJdfQ==
