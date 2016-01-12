(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

//Init windows
var renderWindow = require("./renderWindow");
renderWindow.render();

//Init taskbar
var taskbar = require("./taskbar");
taskbar.bringForth();

//Preload images
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

        //Checks if the checkNick has triggered (name-field-gone)
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

    //Check if there is a nickname in localstorage
    if (localStorage.getItem("nickname") !== null) {

        //Get nick from local storage
        nickname = localStorage.getItem("nickname");
        nickInput[k - 1].classList.add("name-field-gone");
    } else {

        //Else display nick box.
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

    //Creates new socket
    var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");

    //Check for chat settings
    chatSettings.change();

    for (var i = 0; i < findSubmit.length; i += 1) {
        checkNick.check();
        noRepeatCounter += 1;
    }

    //Goes ahead and set a username with the help from the nick changer.
    findNickSubmit[noRepeatCounter - 1].addEventListener("click", function() {
        // *Hide after use - send to local storage  -> *Ish
        if (findNickArea[noRepeatCounter - 1].value !== "") {
            data.username = findNickArea[noRepeatCounter - 1].value;
            localStorage.setItem("nickname", findNickArea[noRepeatCounter - 1].value);
            findNameField[noRepeatCounter - 1].classList.add("name-field-gone");
            textContainer[noRepeatCounter - 1].classList.add("text-container-after");
        }
    });

    //Checks if everything necessary is there for a message.
    findSubmit[noRepeatCounter - 1].addEventListener("click", function() {
        if (localStorage.nickname !== "") {
            data.username = localStorage.getItem("nickname");
            data.data = findTextArea[noRepeatCounter - 1].value;
        }
    });

    //The keys and values needed for a message.
    var data = {
        "type": "message",
        "data": "",
        "username": "",
        "channel": "",
        "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd",
        "didUserSend": "userSent"
    };

    //Open socker
    socket.addEventListener("open", function(event) {
        var i = 0;
        var counter = 0;

        for (i = 0; i < findSubmit.length; i += 1) {
            counter += 1;
        }

        //Checks again for nick.
        findSubmit[counter - 1].addEventListener("click", function(event) {
            if (findTextArea[counter - 1].value !== "" && localStorage.getItem("nickname") !== null) {

                // Send message
                socket.send(JSON.stringify(data));
                findTextArea[counter - 1].value = "";
            }

            event.preventDefault();
        });

        //Enable on enter press sending.
        findTextArea[counter - 1].addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                findSubmit[counter - 1].click();
                event.preventDefault();
            }

        });
    });

    //When sent, render the following to the user text window.
    socket.addEventListener("message", function(event) {
        var pTagUser = document.createElement("P");
        var pTagMess = document.createElement("P");
        var divTagText = document.createElement("DIV");
        var isMe = JSON.parse(event.data).didUserSend;
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

                //If it was sent by the user - put it on the user side of the chat.
                if (chatUser === localStorage.getItem("nickname") && isMe !== undefined) {
                    divTagText.classList.add("user-sent");
                }

                //Append the elements above.
                textContainer[i].appendChild(divTagText);

                //Scroll to bottom.
                textContainer[i].scrollTop = textContainer[i].scrollHeight;
            }
        }
    });

}

module.exports.chat = createChat;

},{"./chatSettings":2,"./checkNick":3}],5:[function(require,module,exports){
"use strict";

function colorSchemeer() {

    //Gets the template
    var loadScheme = require("./loadScheme");
    loadScheme.load();

    //Gets the input tags hex-codes
    var fetchColor = require("./fetchColor");
    fetchColor.fetch();

    //Gets hex-code and styling for the font.
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

                    //Sets colors on inputs depending on value
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

    //Appends the template
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

    //Example text
    templatesHeader[counter - 1].value = "LOREM IPSUM";

    hexIn.addEventListener("keydown", function() {

        this.addEventListener("keyup", function() {
            var saveTarget = this.parentElement.parentElement.parentElement.children[1].firstElementChild.firstElementChild.firstElementChild;

            //Gets a # in there - to declare the input as hex. -> Add color to text.
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

                //Sets color to input depending on value
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

    //Switch for serif
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

    //Switch for bold
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

/**
 * Initialize all windows ready for use.
 */
function renderWindow() {

    var movable = require("./movable");
    var windowDestroyer = require("./windowDestroyer");
    var createMemory = require("./memory/createMemory");
    var createChat = require("./chat/createChat");
    var colorSchemeer = require("./colorSchemeer/colorSchemeer");
    var windowPlacement = require("./windowPlacement");
    var setZ = require("./setZ");

    //Checks if which nav-button is being pressed.
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

    //Creates chat instance.
    function render() {
        var template = document.querySelector("#chat-template");
        var clone = document.importNode(template.content, true);
        var beforeThis = document.querySelector(".wrapper-hero");
        document.querySelector("body").insertBefore(clone, beforeThis);

        //initializes Placement, chat-part, movable-window, z-index, able to destroy window.
        windowPlacement.place();
        createChat.chat();
        movable.move();
        setZ.set();
        windowDestroyer.destroy();

    }

    //Create memory
    function renderMem() {
      var template = document.querySelector("#window-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      //initializes Placement, create-memory, movable-window, z-index, able to destroy window.
      windowPlacement.place();
      createMemory.create();
      movable.move();
      setZ.set();
      windowDestroyer.destroy();
  }

    //Creates Schemee (Third 'app')
    function renderSchemee() {
      var template = document.querySelector("#schemee-template");
      var clone = document.importNode(template.content, true);
      var beforeThis = document.querySelector(".wrapper-hero");
      document.querySelector("body").insertBefore(clone, beforeThis);

      //initializes Placement, schemeer-init, movable-window, z-index, able to destroy window.
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
            //Checks all the windows for z-index
            var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");
            if ((zindex !== "auto")) {

                //If it's the nav - then add 200 to the z-index, else just one for normal windows.
                if (naving) {
                    highest = parseInt(zindex) + 200;
                } else {
                    highest = parseInt(zindex) + 1;

                    //Push values into array
                    newArr.push(highest);
                }
            }
        }

        //Sort array
        newArr.sort(function(a, b) {
            return b - a;
        });

        //If the highest in array isn't undefined, return that value, else return normal highest.
        if (newArr[0] !== undefined) {
            return newArr[0];
        } else {
            return highest;
        }

    }

    //When run, get the highest z-index and set that to the navbar
    nav.style.zIndex = parseInt(higestZ(".window", true));

    function settingNe() {

        for (i = 0; i < windows.length; i += 1) {
            counter += 1;
        }

        //In order for nav to get the highest z-index, give the windows z-index on init.
        windows[counter - 1].style.zIndex = parseInt(higestZ(".window"));

        //When clicking a window, check the highest z-index and add that to that specific window.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vL0luaXQgd2luZG93c1xudmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcblxuLy9Jbml0IHRhc2tiYXJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcbnRhc2tiYXIuYnJpbmdGb3J0aCgpO1xuXG4vL1ByZWxvYWQgaW1hZ2VzXG52YXIgcHJlbG9hZGluZyA9IHJlcXVpcmUoXCIuL3ByZWxvYWRpbmdcIik7XG5wcmVsb2FkaW5nLmxvYWRpbmcoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGF0U2V0dGluZ3MoKSB7XG4gICAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmljay1jaGFuZ2VyXCIpO1xuICAgIHZhciBuaWNraW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xuICAgIHZhciBrID0gMDtcbiAgICB2YXIgaiA9IDA7XG5cbiAgICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlQnV0dG9uLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGsgKz0gMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kQW5kU2V0KGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIGNoZWNrTmljayBoYXMgdHJpZ2dlcmVkIChuYW1lLWZpZWxkLWdvbmUpXG4gICAgICAgIG5pY2tpbmdbayAtIDFdLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikpO1xuICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcIm5pY2stY29nLXJvdGF0ZVwiKTtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibmFtZS1maWVsZC1nb25lXCIpKSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjaGFuZ2VCdXR0b25bayAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmaW5kQW5kU2V0KTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2hlY2tOaWNrKCkge1xuXG4gICAgdmFyIG5pY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcblxuICAgIHZhciBpID0gMDtcbiAgICB2YXIgayA9IDA7XG4gICAgdmFyIG5pY2tuYW1lID0gXCJcIjtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgayArPSAxO1xuICAgIH1cblxuICAgIC8vQ2hlY2sgaWYgdGhlcmUgaXMgYSBuaWNrbmFtZSBpbiBsb2NhbHN0b3JhZ2VcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xuXG4gICAgICAgIC8vR2V0IG5pY2sgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICAgIG5pY2tuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKTtcbiAgICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy9FbHNlIGRpc3BsYXkgbmljayBib3guXG4gICAgICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja05pY2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY3JlYXRlQ2hhdCgpIHtcblxuICAgIHZhciBmaW5kU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWJtaXRcIik7XG4gICAgdmFyIGZpbmRUZXh0QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1tZXNzXCIpO1xuICAgIHZhciBmaW5kTmlja1N1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWNjZXB0LW5hbWVcIik7XG4gICAgdmFyIGZpbmROaWNrQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcbiAgICB2YXIgZmluZE5hbWVGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcbiAgICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XG4gICAgdmFyIGNoZWNrTmljayA9IHJlcXVpcmUoXCIuL2NoZWNrTmlja1wiKTtcbiAgICB2YXIgY2hhdFNldHRpbmdzID0gcmVxdWlyZShcIi4vY2hhdFNldHRpbmdzXCIpO1xuICAgIHZhciBub1JlcGVhdENvdW50ZXIgPSAwO1xuXG4gICAgLy9DcmVhdGVzIG5ldyBzb2NrZXRcbiAgICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XG5cbiAgICAvL0NoZWNrIGZvciBjaGF0IHNldHRpbmdzXG4gICAgY2hhdFNldHRpbmdzLmNoYW5nZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNoZWNrTmljay5jaGVjaygpO1xuICAgICAgICBub1JlcGVhdENvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICAvL0dvZXMgYWhlYWQgYW5kIHNldCBhIHVzZXJuYW1lIHdpdGggdGhlIGhlbHAgZnJvbSB0aGUgbmljayBjaGFuZ2VyLlxuICAgIGZpbmROaWNrU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gKkhpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlICAtPiAqSXNoXG4gICAgICAgIGlmIChmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRhdGEudXNlcm5hbWUgPSBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm5pY2tuYW1lXCIsIGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSk7XG4gICAgICAgICAgICBmaW5kTmFtZUZpZWxkW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICB0ZXh0Q29udGFpbmVyW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9DaGVja3MgaWYgZXZlcnl0aGluZyBuZWNlc3NhcnkgaXMgdGhlcmUgZm9yIGEgbWVzc2FnZS5cbiAgICBmaW5kU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZGF0YS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XG4gICAgICAgICAgICBkYXRhLmRhdGEgPSBmaW5kVGV4dEFyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vVGhlIGtleXMgYW5kIHZhbHVlcyBuZWVkZWQgZm9yIGEgbWVzc2FnZS5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwibWVzc2FnZVwiLFxuICAgICAgICBcImRhdGFcIjogXCJcIixcbiAgICAgICAgXCJ1c2VybmFtZVwiOiBcIlwiLFxuICAgICAgICBcImNoYW5uZWxcIjogXCJcIixcbiAgICAgICAgXCJrZXlcIjogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiLFxuICAgICAgICBcImRpZFVzZXJTZW5kXCI6IFwidXNlclNlbnRcIlxuICAgIH07XG5cbiAgICAvL09wZW4gc29ja2VyXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrcyBhZ2FpbiBmb3Igbmljay5cbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIiAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBTZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vRW5hYmxlIG9uIGVudGVyIHByZXNzIHNlbmRpbmcuXG4gICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5jbGljaygpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL1doZW4gc2VudCwgcmVuZGVyIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHVzZXIgdGV4dCB3aW5kb3cuXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICB2YXIgcFRhZ01lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdmFyIGRpdlRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICB2YXIgaXNNZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGlkVXNlclNlbmQ7XG4gICAgICAgIHZhciBjaGF0RGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGF0YTtcbiAgICAgICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcbiAgICAgICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XG4gICAgICAgIHZhciBjcmVhdGVVc2VyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdFVzZXIpO1xuICAgICAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcbiAgICAgICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XG4gICAgICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ1VzZXIpO1xuICAgICAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChjaGF0VXNlciAhPT0gbnVsbCAmJiBjaGF0RGF0YSAhPT0gdW5kZWZpbmVkICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIGl0IHdhcyBzZW50IGJ5IHRoZSB1c2VyIC0gcHV0IGl0IG9uIHRoZSB1c2VyIHNpZGUgb2YgdGhlIGNoYXQuXG4gICAgICAgICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICYmIGlzTWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkaXZUYWdUZXh0LmNsYXNzTGlzdC5hZGQoXCJ1c2VyLXNlbnRcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9BcHBlbmQgdGhlIGVsZW1lbnRzIGFib3ZlLlxuICAgICAgICAgICAgICAgIHRleHRDb250YWluZXJbaV0uYXBwZW5kQ2hpbGQoZGl2VGFnVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAvL1Njcm9sbCB0byBib3R0b20uXG4gICAgICAgICAgICAgICAgdGV4dENvbnRhaW5lcltpXS5zY3JvbGxUb3AgPSB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLmNoYXQgPSBjcmVhdGVDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNvbG9yU2NoZW1lZXIoKSB7XG5cbiAgICAvL0dldHMgdGhlIHRlbXBsYXRlXG4gICAgdmFyIGxvYWRTY2hlbWUgPSByZXF1aXJlKFwiLi9sb2FkU2NoZW1lXCIpO1xuICAgIGxvYWRTY2hlbWUubG9hZCgpO1xuXG4gICAgLy9HZXRzIHRoZSBpbnB1dCB0YWdzIGhleC1jb2Rlc1xuICAgIHZhciBmZXRjaENvbG9yID0gcmVxdWlyZShcIi4vZmV0Y2hDb2xvclwiKTtcbiAgICBmZXRjaENvbG9yLmZldGNoKCk7XG5cbiAgICAvL0dldHMgaGV4LWNvZGUgYW5kIHN0eWxpbmcgZm9yIHRoZSBmb250LlxuICAgIHZhciBzZXRGb250RmFtaWx5ID0gcmVxdWlyZShcIi4vc2V0Rm9udEZhbWlseVwiKTtcbiAgICBzZXRGb250RmFtaWx5LnNldCgpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBjb2xvclNjaGVtZWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGZldGNoQ29sb3IoKSB7XG4gICAgdmFyIGhleENvbnRhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIG5ld0NvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBoZXhDb250YWluLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgaGV4SW4gPSBoZXhDb250YWluW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLXJvdyBpbnB1dFwiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBoZXhJbi5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIG5ld0NvdW50ZXIgKz0gMTtcblxuICAgICAgICBoZXhJbltpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNhdmVUYXJnZXQpO1xuXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0ID0gc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5jaGlsZHJlblswXTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPj0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGVudGVyZWQgdGV4dCBpcyB2YWxpZCBoZXguXG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNykge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vU2V0cyBjb2xvcnMgb24gaW5wdXRzIGRlcGVuZGluZyBvbiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzhiMzAzMFwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OUFFMzdcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cy5mZXRjaCA9IGZldGNoQ29sb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gbG9hZFNjaGVtZSgpIHtcbiAgICB2YXIgZmluZFNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGVzaWduLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcE9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzaWduLW9uZVwiKTtcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBPbmUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIHZhciBzZXRQb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmVmb3JlLXRoaXNcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFNxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9BcHBlbmRzIHRoZSB0ZW1wbGF0ZVxuICAgIGZpbmRTcXVhcmVbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgc2V0UG9pbnRbY291bnRlciAtIDFdKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRGb250RmFtaWx5KCkge1xuICAgIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vdmVyLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcGxhdGVzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oZWFkZXItb25lIGlucHV0XCIpO1xuICAgIHZhciBzd2l0Y2hDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXJcIik7XG4gICAgdmFyIHN3aXRjaENvbnRhaW5lckJvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXItYm9sZFwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcblxuICAgIC8vRXhhbXBsZSB0ZXh0XG4gICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiTE9SRU0gSVBTVU1cIjtcblxuICAgIGhleEluLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgICAgICAvL0dldHMgYSAjIGluIHRoZXJlIC0gdG8gZGVjbGFyZSB0aGUgaW5wdXQgYXMgaGV4LiAtPiBBZGQgY29sb3IgdG8gdGV4dC5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxuICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XG5cbiAgICAgICAgICAgICAgICAvL1NldHMgY29sb3IgdG8gaW5wdXQgZGVwZW5kaW5nIG9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2FlMzczN1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIHNlcmlmXG4gICAgc3dpdGNoQ29udGFpbmVyW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZXJpZlwiKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIGJvbGRcbiAgICBzd2l0Y2hDb250YWluZXJCb2xkW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5jb250YWlucyhcImJvbGRcIikpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Rm9udEZhbWlseTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjYXJkUmFuZG9taXplcigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGNhcmRBcnIgPSBbXTtcbiAgICB2YXIgbmV3TnVtYmVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRBcnIucHVzaChpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaHVmZmxlKGNhcmRBcnIpIHtcbiAgICAgICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aDtcbiAgICAgICAgdmFyIHQ7XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXG4gICAgICAgIHdoaWxlIChtKSB7XG5cbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxuICAgICAgICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtIC09IDEpKTtcblxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdCA9IGNhcmRBcnJbbV07XG4gICAgICAgICAgICBjYXJkQXJyW21dID0gY2FyZEFycltpXTtcbiAgICAgICAgICAgIGNhcmRBcnJbaV0gPSB0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhcmRBcnI7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbmV3Q291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmRvbUFuZFNldCgpIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgd2luZG93Q291bnQgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB3aW5kb3dDb3VudCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNhcmRzSW5XaW5kb3dzID0gd2luZG93c1t3aW5kb3dDb3VudCAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgICAgbmV3TnVtYmVyID0gc2h1ZmZsZShjYXJkQXJyKS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgICBjYXJkc0luV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKG5ld051bWJlcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJhbmRvbUFuZFNldCgpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLnJ1biA9IGNhcmRSYW5kb21pemVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNoZWNrUGFpcigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBuZXdBcnIgPSBbXTtcbiAgICB2YXIgdGFyZ2V0QXJyID0gW107XG4gICAgdmFyIHNhdmVUYXJnZXQgPSBbXTtcbiAgICB2YXIgY2xpY2tzID0gMDtcbiAgICB2YXIgdHJpZXMgPSAwO1xuICAgIHZhciBwYWlyQ291bnRlciA9IDA7XG4gICAgdmFyIHdpbkNoZWNrID0gcmVxdWlyZShcIi4vd2luQ2hlY2tcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZHNJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICAgIHZhciBjb3VudGVySW5XaW5kb3cgPSBjb250YWluZXJbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XG5cbiAgICBmdW5jdGlvbiBjaGVja0VudGVyKCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2soKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbGlzdGVuZXIoZXZlbnQpIHtcblxuICAgICAgICBpZiAoY2xpY2tzIDwgMikge1xuXG4gICAgICAgICAgICBjbGlja3MgKz0gMTtcblxuICAgICAgICAgICAgdHJpZXMgKz0gMTtcblxuICAgICAgICAgICAgdmFyIGdldFdpbmRvdyA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIHZhciBjdXJyZW50VGhlbWUgPSBnZXRXaW5kb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcblxuICAgICAgICAgICAgLy8gaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi9cIiArIHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUgKyBcIi5wbmcnKVwiO1xuXG4gICAgICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gICB0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vSMOkciBza2EgbWFuIGt1bm5hIMOkbmRyYSB2aWxrZW4gYmlsZGVuIHNrYSB2YXJhLlxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyci5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdID09PSB0YXJnZXRBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIgPSB0YXJnZXRBcnIuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgIGNsaWNrcyA9IGNsaWNrcyAtPSAxO1xuICAgICAgICAgICAgICAgIHBhaXJDb3VudGVyID0gcGFpckNvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY291bnRlckluV2luZG93LnRleHRDb250ZW50ID0gdHJpZXM7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnJbMF0gIT09IHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdBcnIubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldEFyclswXSAmJiB0YXJnZXRBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQucHVzaCh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAobmV3QXJyWzBdICYmIG5ld0FyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3QXJyWzBdID09PSBuZXdBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQQUlSXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFpckNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFpckNvdW50ZXIgPj0gOCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5DaGVjay53aW4oY291bnRlckluV2luZG93KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHZhciBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiLzAucG5nJylcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9TYW1tYSBzb20gZ3J1bmRlbi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5PVCBBIFBBSVJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzSW5XaW5kb3cubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY2FyZHNJbldpbmRvd1tpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgY2hlY2tFbnRlcik7XG4gICAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxpc3RlbmVyKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tQYWlyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XHJcblxyXG4gIHZhciBsb2FkaW5nQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkaW5nQ2FyZHNcIik7XHJcbiAgbG9hZGluZ0NhcmRzLmxvYWQoKTtcclxuXHJcbiAgdmFyIHRoZW1lQ2hhbmdlciA9IHJlcXVpcmUoXCIuL3RoZW1lQ2hhbmdlclwiKTtcclxuICB0aGVtZUNoYW5nZXIuY2hhbmdlKCk7XHJcblxyXG4gIHZhciBzZXRDYXJkcyA9IHJlcXVpcmUoXCIuL3NldENhcmRzXCIpO1xyXG4gIHNldENhcmRzLnNldCgpO1xyXG5cclxuICB2YXIgY2FyZFJhbmRvbWl6ZXIgPSByZXF1aXJlKFwiLi9jYXJkUmFuZG9taXplclwiKTtcclxuICBjYXJkUmFuZG9taXplci5ydW4oKTtcclxuXHJcbiAgdmFyIGNoZWNrUGFpciA9IHJlcXVpcmUoXCIuL2NoZWNrUGFpclwiKTtcclxuICBjaGVja1BhaXIuY2hlY2soKTtcclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZU1lbW9yeTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGxvYWRpbmdDYXJkcygpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnktdGVtcGxhdGVcIik7XG4gICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB2YXIgY2xpY2tDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jbGlja0NvdW50ZXJcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIilbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgY2xpY2tDb3VudGVyW2NvdW50ZXIgLSAxXSk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRpbmdDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRDYXJkcygpIHtcbiAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gICAgdmFyIG1lbVdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbWVtV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgbWVtV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIGxhc3RUaGVtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWVtV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwicGxhaW5cIik7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjYXJkc1tpXSkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtaW1hZ2VcIikgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBsYXN0VGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vSMOkciBrYW4gbWFuIMOkbmRyYSBncnVuZGVuLlxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldENhcmRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHRoZW1lQ2hhbmdlcigpIHtcbiAgICB2YXIgaGFzQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRoZW1lLXNlbGVjdG9yXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgaGFzQ2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIilbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJwbGFpblwiKTtcblxuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwicGxhaW5cIik7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJyZWRcIik7XG5cbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInJlZFwiKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9yZWQvMC5wbmcnKVwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgXCJibHVlXCIpO1xuXG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJibHVlXCIpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL2JsdWUvMC5wbmcnKVwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzNdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIFwiZ3JlZW5cIik7XG5cbiAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcImdyZWVuXCIpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL2dyZWVuLzAucG5nJylcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICB2YXIgdGhlbWVCdXR0b24gPSBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIGZ1bmN0aW9uIGJyaW5nVGhlbWUoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcInRoZW1lLWZpZWxkLWdvbmVcIikpIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcInRoZW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJjYXJkLWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmFkZChcInRoZW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5hZGQoXCJjYXJkLWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgdGhlbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJyaW5nVGhlbWUpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IHRoZW1lQ2hhbmdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiB3aW5DaGVjayhjdXJyZW50V2luZG93KSB7XG4gICAgdmFyIHlvdVdpbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWU9VIFdJTiFcIik7XG4gICAgdmFyIGJyZWFraW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJSXCIpO1xuICAgIHZhciBwdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgcHRhZy5hcHBlbmRDaGlsZCh5b3VXaW4pO1xuICAgIHB0YWcuY2xhc3NMaXN0LmFkZChcIndpbm5pbmctbWVzc2FnZVwiKTtcbiAgICBjdXJyZW50V2luZG93LmFwcGVuZENoaWxkKGJyZWFraW5nKTtcbiAgICBjdXJyZW50V2luZG93LmFwcGVuZENoaWxkKHB0YWcpO1xuICAgIGN1cnJlbnRXaW5kb3cuY2xhc3NMaXN0LmFkZChcInByZXNlbnQtY2xpY2tcIik7XG59XG5cbm1vZHVsZS5leHBvcnRzLndpbiA9IHdpbkNoZWNrO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIG1vdmFibGUoKSB7XG5cbiAgICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xuXG4gICAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZFdpbmRvd3NbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXAsIGZhbHNlKTtcbiAgICB9XG5cbiAgICB2YXIgYVZhclkgPSAwO1xuICAgIHZhciBhVmFyWCA9IDA7XG4gICAgdmFyIHNhdmVUYXJnZXQgPSAwO1xuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuc2xpY2UoMCwgMykgPT09IFwidG9wXCIpIHtcbiAgICAgICAgICAgIGFWYXJZID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgICAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMC44NTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmaW5kV2luZG93c1tpXS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGl2TW92ZShldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQueSAtIGFWYXJZIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQueSAtIGFWYXJZKTtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnkgLSBhVmFyWSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICogMC41KSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gZXZlbnQueSAtIGFWYXJZICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LnggLSBhVmFyWCA8IDApIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC54IC0gYVZhclggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCAqIDAuNSkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCAqIDAuNSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcnMoKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5tb3ZlID0gbW92YWJsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBwcmVsb2FkaW5nKCkge1xuICAgIGlmIChkb2N1bWVudC5pbWFnZXMpIHtcbiAgICAgICAgdmFyIGltZzEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzggPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzkgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICB2YXIgaW1nMTAgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzExID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE0ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE3ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxOCA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHZhciBpbWcxOSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjAgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIxID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI0ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI3ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgdmFyIGltZzI4ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaW1nMS5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMC5wbmdcIjtcbiAgICAgICAgaW1nMi5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMS5wbmdcIjtcbiAgICAgICAgaW1nMy5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMi5wbmdcIjtcbiAgICAgICAgaW1nNC5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMy5wbmdcIjtcbiAgICAgICAgaW1nNS5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNC5wbmdcIjtcbiAgICAgICAgaW1nNi5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNS5wbmdcIjtcbiAgICAgICAgaW1nNy5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNi5wbmdcIjtcbiAgICAgICAgaW1nOC5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNy5wbmdcIjtcbiAgICAgICAgaW1nOS5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvOC5wbmdcIjtcblxuICAgICAgICBpbWcxMC5zcmMgPSBcIi4uL2ltYWdlL3JlZC8wLnBuZ1wiO1xuICAgICAgICBpbWcxMS5zcmMgPSBcIi4uL2ltYWdlL3JlZC8xLnBuZ1wiO1xuICAgICAgICBpbWcxMi5zcmMgPSBcIi4uL2ltYWdlL3JlZC8yLnBuZ1wiO1xuICAgICAgICBpbWcxMy5zcmMgPSBcIi4uL2ltYWdlL3JlZC8zLnBuZ1wiO1xuICAgICAgICBpbWcxNC5zcmMgPSBcIi4uL2ltYWdlL3JlZC80LnBuZ1wiO1xuICAgICAgICBpbWcxNS5zcmMgPSBcIi4uL2ltYWdlL3JlZC81LnBuZ1wiO1xuICAgICAgICBpbWcxNi5zcmMgPSBcIi4uL2ltYWdlL3JlZC82LnBuZ1wiO1xuICAgICAgICBpbWcxNy5zcmMgPSBcIi4uL2ltYWdlL3JlZC83LnBuZ1wiO1xuICAgICAgICBpbWcxOC5zcmMgPSBcIi4uL2ltYWdlL3JlZC84LnBuZ1wiO1xuXG4gICAgICAgIGltZzE5LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMC5wbmdcIjtcbiAgICAgICAgaW1nMjAuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8xLnBuZ1wiO1xuICAgICAgICBpbWcyMS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzIucG5nXCI7XG4gICAgICAgIGltZzIyLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMy5wbmdcIjtcbiAgICAgICAgaW1nMjMuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi80LnBuZ1wiO1xuICAgICAgICBpbWcyNC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzUucG5nXCI7XG4gICAgICAgIGltZzI1LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNi5wbmdcIjtcbiAgICAgICAgaW1nMjYuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi83LnBuZ1wiO1xuICAgICAgICBpbWcyNy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzgucG5nXCI7XG5cbiAgICAgICAgaW1nMjguc3JjID0gXCIuLi9pbWFnZS9pY29ucy9jb2dncmV5LnBuZ1wiO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMubG9hZGluZyA9IHByZWxvYWRpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGFsbCB3aW5kb3dzIHJlYWR5IGZvciB1c2UuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlcldpbmRvdygpIHtcblxuICAgIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcbiAgICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xuICAgIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnkvY3JlYXRlTWVtb3J5XCIpO1xuICAgIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY2hhdC9jcmVhdGVDaGF0XCIpO1xuICAgIHZhciBjb2xvclNjaGVtZWVyID0gcmVxdWlyZShcIi4vY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyXCIpO1xuICAgIHZhciB3aW5kb3dQbGFjZW1lbnQgPSByZXF1aXJlKFwiLi93aW5kb3dQbGFjZW1lbnRcIik7XG4gICAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xuXG4gICAgLy9DaGVja3MgaWYgd2hpY2ggbmF2LWJ1dHRvbiBpcyBiZWluZyBwcmVzc2VkLlxuICAgIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xuICAgICAgICB2YXIgZmluZE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaWNvbjFcIik7XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tOYXYoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMF0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzFdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyTWVtKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsyXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlclNjaGVtZWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgICAgIGZpbmROYXZbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoZWNrTmF2KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuYXZDbGljaygpO1xuXG4gICAgLy9DcmVhdGVzIGNoYXQgaW5zdGFuY2UuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XG4gICAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XG5cbiAgICAgICAgLy9pbml0aWFsaXplcyBQbGFjZW1lbnQsIGNoYXQtcGFydCwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xuICAgICAgICBjcmVhdGVDaGF0LmNoYXQoKTtcbiAgICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICAgIHNldFouc2V0KCk7XG4gICAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG5cbiAgICB9XG5cbiAgICAvL0NyZWF0ZSBtZW1vcnlcbiAgICBmdW5jdGlvbiByZW5kZXJNZW0oKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgLy9pbml0aWFsaXplcyBQbGFjZW1lbnQsIGNyZWF0ZS1tZW1vcnksIG1vdmFibGUtd2luZG93LCB6LWluZGV4LCBhYmxlIHRvIGRlc3Ryb3kgd2luZG93LlxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcbiAgICAgIHNldFouc2V0KCk7XG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgICAvL0NyZWF0ZXMgU2NoZW1lZSAoVGhpcmQgJ2FwcCcpXG4gICAgZnVuY3Rpb24gcmVuZGVyU2NoZW1lZSgpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NoZW1lZS10ZW1wbGF0ZVwiKTtcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgLy9pbml0aWFsaXplcyBQbGFjZW1lbnQsIHNjaGVtZWVyLWluaXQsIG1vdmFibGUtd2luZG93LCB6LWluZGV4LCBhYmxlIHRvIGRlc3Ryb3kgd2luZG93LlxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICBjb2xvclNjaGVtZWVyLmluaXRpYWxpemUoKTtcbiAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0WigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbmV3QXJyID0gW107XG5cbiAgICAvLyBmb3IgKGogPSAwOyBqIDwgNDsgaiArPSAxKSB7XG5cbiAgICAvLyB9XG5cbiAgICBmdW5jdGlvbiBoaWdlc3RaKHRoZVdpbmRvd3MsIG5hdmluZykge1xuXG4gICAgICAgIHZhciBnbGFzc1NxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhlV2luZG93cyk7XG4gICAgICAgIHZhciBoaWdoZXN0ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdsYXNzU3F1YXJlLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAvL0NoZWNrcyBhbGwgdGhlIHdpbmRvd3MgZm9yIHotaW5kZXhcbiAgICAgICAgICAgIHZhciB6aW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShnbGFzc1NxdWFyZVtpXSkuZ2V0UHJvcGVydHlWYWx1ZShcInotaW5kZXhcIik7XG4gICAgICAgICAgICBpZiAoKHppbmRleCAhPT0gXCJhdXRvXCIpKSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIGl0J3MgdGhlIG5hdiAtIHRoZW4gYWRkIDIwMCB0byB0aGUgei1pbmRleCwgZWxzZSBqdXN0IG9uZSBmb3Igbm9ybWFsIHdpbmRvd3MuXG4gICAgICAgICAgICAgICAgaWYgKG5hdmluZykge1xuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0ID0gcGFyc2VJbnQoemluZGV4KSArIDIwMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0ID0gcGFyc2VJbnQoemluZGV4KSArIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9QdXNoIHZhbHVlcyBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIG5ld0Fyci5wdXNoKGhpZ2hlc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU29ydCBhcnJheVxuICAgICAgICBuZXdBcnIuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYiAtIGE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vSWYgdGhlIGhpZ2hlc3QgaW4gYXJyYXkgaXNuJ3QgdW5kZWZpbmVkLCByZXR1cm4gdGhhdCB2YWx1ZSwgZWxzZSByZXR1cm4gbm9ybWFsIGhpZ2hlc3QuXG4gICAgICAgIGlmIChuZXdBcnJbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ld0FyclswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoaWdoZXN0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvL1doZW4gcnVuLCBnZXQgdGhlIGhpZ2hlc3Qgei1pbmRleCBhbmQgc2V0IHRoYXQgdG8gdGhlIG5hdmJhclxuICAgIG5hdi5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiLCB0cnVlKSk7XG5cbiAgICBmdW5jdGlvbiBzZXR0aW5nTmUoKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vSW4gb3JkZXIgZm9yIG5hdiB0byBnZXQgdGhlIGhpZ2hlc3Qgei1pbmRleCwgZ2l2ZSB0aGUgd2luZG93cyB6LWluZGV4IG9uIGluaXQuXG4gICAgICAgIHdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIpKTtcblxuICAgICAgICAvL1doZW4gY2xpY2tpbmcgYSB3aW5kb3csIGNoZWNrIHRoZSBoaWdoZXN0IHotaW5kZXggYW5kIGFkZCB0aGF0IHRvIHRoYXQgc3BlY2lmaWMgd2luZG93LlxuICAgICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiLCBmYWxzZSkpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgc2V0dGluZ05lKCk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0WjtcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5cclxuZnVuY3Rpb24gdGFza2JhcigpIHtcclxuICAgIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgZmluZFRhc2tiYXIuY2xhc3NMaXN0LmFkZChcInRhc2stYXBwZWFyXCIpO1xyXG4gIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHdpbmRvd0Rlc3Ryb3llcigpIHtcbiAgICB2YXIgZmluZEV4aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4aXRcIik7XG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcblxuICAgIGZ1bmN0aW9uIHJlbW92aW5nKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IGJvZHkpIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZEV4aXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZmluZEV4aXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92aW5nKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSB3aW5kb3dEZXN0cm95ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG5ld0NvdW50ZXIgPSAwO1xudmFyIGhlaWdodCA9IDA7XG52YXIgd2lkdGggPSAwO1xudmFyIGNvdW50aW5nID0gMDtcblxuZnVuY3Rpb24gd2luZG93UGxhY2VtZW50KCkge1xuXG4gICAgZnVuY3Rpb24gd2hlcmVUb1BsYWNlKCkge1xuICAgICAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgaSA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2V0WiA9IHJlcXVpcmUoXCIuL3NldFpcIik7XG4gICAgICAgIHNldFouc2V0KCk7XG5cbiAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyAzMCAqIG5ld0NvdW50ZXIgKyBcInB4XCI7XG4gICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcblxuICAgICAgICBoZWlnaHQgKz0gMzA7XG4gICAgICAgIHdpZHRoICs9IDMwO1xuXG4gICAgICAgIGlmICgod2lkdGgpID4gd2luZG93LmlubmVySGVpZ2h0IC0gNTAwKSB7XG4gICAgICAgICAgICBuZXdDb3VudGVyID0gMDtcbiAgICAgICAgICAgIHdpZHRoID0gMzA7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIGhlaWdodCArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgoaGVpZ2h0KSA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNDUwKSB7XG4gICAgICAgICAgICBjb3VudGluZyArPSAxO1xuICAgICAgICAgICAgaGVpZ2h0ID0gNSAqIGNvdW50aW5nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2hlcmVUb1BsYWNlKCk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMucGxhY2UgPSB3aW5kb3dQbGFjZW1lbnQ7XG4iXX0=
