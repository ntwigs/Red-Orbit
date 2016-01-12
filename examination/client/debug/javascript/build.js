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

//Off to createChat
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

//Off to createChat
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

//Off to renderWindow
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

//Off to renderWindow
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

//Off to colorSchemeer
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

//Off to colorSchemeer
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

//Off to colorSchemeer
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

    //Fisher yates shuffle function
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

        //Selects all the cards
        var cardsInWindows = windows[windowCount - 1].querySelectorAll(".card");

        //For ea value in array adds card number to class.
        for (i = 0; i < 16; i += 1) {
            newNumber = shuffle(cardArr).splice(0, 1);
            counter += 1;
            cardsInWindows[counter - 1].parentElement.classList.add(newNumber);
        }

    }

    randomAndSet();

}

//Off to createMemory
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

//Off to createMemory
module.exports.check = checkPair;

},{"./winCheck":15}],11:[function(require,module,exports){
"use strict";

function createMemory() {

    //Gets template
    var loadingCards = require("./loadingCards");
    loadingCards.load();

    //Implements the theme changer
    var themeChanger = require("./themeChanger");
    themeChanger.change();

    //Gives card img depending on class value
    var setCards = require("./setCards");
    setCards.set();

    //Randomizing cards
    var cardRandomizer = require("./cardRandomizer");
    cardRandomizer.run();

    //The game logic.
    var checkPair = require("./checkPair");
    checkPair.check();

}

module.exports.create = createMemory;

},{"./cardRandomizer":9,"./checkPair":10,"./loadingCards":12,"./setCards":13,"./themeChanger":14}],12:[function(require,module,exports){
"use strict";
/**
 * Gets the memory template
 */
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

//Off to createMemory
module.exports.load = loadingCards;

},{}],13:[function(require,module,exports){
"use strict";

/**
 * Gets theme
 * Gives element appropriate and matching images that represents cards.
 */
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

        //If there's no image - set the images with the last used theme.
        if (window.getComputedStyle(cards[i]).getPropertyValue("background-image") === "none") {
            if (localStorage.theme !== "") {
                lastTheme = localStorage.getItem("theme");
                cards[i].style.backgroundImage = "url('../image/" + lastTheme + "/0.png')";
            } else {

                //If there's no theme, then use the plain theme.
                cards[i].style.backgroundImage = "url('../image/plain/0.png')";
            }

        }
    }

}

//Off to createMemory
module.exports.set = setCards;

},{}],14:[function(require,module,exports){
"use strict";

/**
 * Makes it available for the user to change the theme of the memory.
 */
function themeChanger() {
    var hasCards = document.querySelectorAll(".theme-selector");
    var counter = 0;
    var i = 0;

    for (i = 0; i < hasCards.length; i += 1) {
        counter += 1;
    }

    //Select all cards.
    var cards = document.querySelectorAll(".card-container")[counter - 1].querySelectorAll(".card");

    //Check and get (if) theme
    function whatCards(color) {

        localStorage.setItem("theme", color);

        hasCards[counter - 1].parentElement.setAttribute("data-theme", color);

        for (i = 0; i < cards.length; i += 1) {
            cards[i].style.backgroundImage = "url('../image/" + color + "/0.png')";
        }

    }

    hasCards[counter - 1].querySelectorAll(".picker-container")[0].addEventListener("click", function() {
        whatCards("plain");
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[1].addEventListener("click", function() {
        whatCards("red");
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[2].addEventListener("click", function() {
        whatCards("blue");
    });

    hasCards[counter - 1].querySelectorAll(".picker-container")[3].addEventListener("click", function() {
        whatCards("green");
    });

    var themeButton = hasCards[counter - 1].parentElement.firstElementChild.firstElementChild;

    function bringTheme(event) {
        event.target.classList.toggle("nick-cog-rotate");
        event.target.parentElement.parentElement.children[1].classList.toggle("theme-field-gone");
        event.target.parentElement.parentElement.children[2].classList.toggle("card-container-after");
    }

    themeButton.addEventListener("click", bringTheme);

}

//Off to createMemory
module.exports.change = themeChanger;

},{}],15:[function(require,module,exports){
"use strict";

/**
 * Adds a winning message to the the specific window (Current window).
 * @param currentWindow
 */
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

//Off to checkPair
module.exports.win = winCheck;

},{}],16:[function(require,module,exports){
"use strict";

/**
 * Makes the window draggable.
 */
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

    //Declares variables used for locating pointer.
    var aVarY = 0;
    var aVarX = 0;
    var saveTarget = 0;

    function mouseDown(event) {

        //Checks if the target has the classname "top".
        if (event.target.className.slice(0, 3) === "top") {

            //Saves the current cords - and the current target.
            aVarY = event.offsetY;
            aVarX = event.offsetX;
            saveTarget = event.target;
            window.addEventListener("mousemove", divMove, true);

            //Gives the current target a 'pretty' and practical opacity.
            saveTarget.parentElement.style.opacity = 0.85;
        }
    }

    function mouseUp() {

        //Sets the opacity to 1 when the user drops the window.
        for (i = 0; i < findWindows.length; i += 1) {
            findWindows[i].style.opacity = 1;
        }

        window.removeEventListener("mousemove", divMove, true);

    }

    function divMove(event) {

        //Checks if the window should move - sets bounding-box (for both x and y).
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

//Off to renderWindow
module.exports.move = movable;

},{}],17:[function(require,module,exports){
"use strict";

function preloading() {

    window.addEventListener("load", function() {
        var img1 = new Image();
        var img2 = new Image();
        var img3 = new Image();
        var img4 = new Image();
        var img5 = new Image();
        var img6 = new Image();
        var img7 = new Image();
        var img8 = new Image();
        var img9 = new Image();

        img1.src = "../image/blue/0.png";
        img2.src = "../image/blue/1.png";
        img3.src = "../image/blue/2.png";
        img4.src = "../image/blue/3.png";
        img5.src = "../image/blue/4.png";
        img6.src = "../image/blue/5.png";
        img7.src = "../image/blue/6.png";
        img8.src = "../image/blue/7.png";
        img9.src = "../image/blue/8.png";
    });

    window.addEventListener("load", function() {

        var img10 = new Image();
        var img11 = new Image();
        var img12 = new Image();
        var img13 = new Image();
        var img14 = new Image();
        var img15 = new Image();
        var img16 = new Image();
        var img17 = new Image();
        var img18 = new Image();

        img10.src = "../image/red/0.png";
        img11.src = "../image/red/1.png";
        img12.src = "../image/red/2.png";
        img13.src = "../image/red/3.png";
        img14.src = "../image/red/4.png";
        img15.src = "../image/red/5.png";
        img16.src = "../image/red/6.png";
        img17.src = "../image/red/7.png";
        img18.src = "../image/red/8.png";
    });

    window.addEventListener("load", function() {

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

    });

}

//Off to app
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

//Off to app
module.exports.render = renderWindow;

},{"./chat/createChat":4,"./colorSchemeer/colorSchemeer":5,"./memory/createMemory":11,"./movable":16,"./setZ":19,"./windowDestroyer":21,"./windowPlacement":22}],19:[function(require,module,exports){
"use strict";

function setZ() {
    var windows = document.querySelectorAll(".window");
    var nav = document.querySelector(".taskbar");
    var counter = 0;
    var i = 0;
    var newArr = [];

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

//Off to renderWindow + windowPlacement
module.exports.set = setZ;

},{}],20:[function(require,module,exports){
"use strict";

/**
 *Let's the navbar appear on load (Gives a visually pleasing effect).
 */
function taskbar() {
    var findTaskbar = document.querySelector(".taskbar");
    window.addEventListener("load", function() {
      findTaskbar.classList.add("task-appear");
  });
}

module.exports.bringForth = taskbar;

},{}],21:[function(require,module,exports){
"use strict";

/**
 * Makes the windows removable.
 */
function windowDestroyer() {
    var findExit = document.querySelectorAll(".exit");
    var body = document.querySelector("body");

    function removing(event) {

        //Checks specifically for the fact that we're not trying to remove the body.
        if (event.target.parentElement.parentElement.parentElement !== body) {

            //Then removes.
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

/**
 * Where the window should be placed on load.
 */
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

        //Checks if the windows are too close to the bottom of the screen.
        if ((width) > window.innerHeight - 500) {
            newCounter = 0;
            width = 30;
            findAllWindows[counter - 1].style.top = "" + width + "px";
            findAllWindows[counter - 1].style.left = "" + height + "px";
        } else {
            findAllWindows[counter - 1].style.top = "" + width + "px";
            findAllWindows[counter - 1].style.left = "" + height + "px";
        }

        //Checks if the windows are too close to the right border of the screen.
        if ((height) > window.innerWidth - 450) {
            counting += 1;
            height = 5 * counting;
        }
    }

    whereToPlace();

}

//Off to createMemory
module.exports.place = windowPlacement;

},{"./setZ":19}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuLy9Jbml0IHdpbmRvd3NcbnZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XG5yZW5kZXJXaW5kb3cucmVuZGVyKCk7XG5cbi8vSW5pdCB0YXNrYmFyXG52YXIgdGFza2JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcblxuLy9QcmVsb2FkIGltYWdlc1xudmFyIHByZWxvYWRpbmcgPSByZXF1aXJlKFwiLi9wcmVsb2FkaW5nXCIpO1xucHJlbG9hZGluZy5sb2FkaW5nKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2hhdFNldHRpbmdzKCkge1xuICAgIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5pY2stY2hhbmdlclwiKTtcbiAgICB2YXIgbmlja2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcbiAgICB2YXIgayA9IDA7XG4gICAgdmFyIGogPSAwO1xuXG4gICAgZm9yIChqID0gMDsgaiA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBrICs9IDE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZEFuZFNldChldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSBjaGVja05pY2sgaGFzIHRyaWdnZXJlZCAobmFtZS1maWVsZC1nb25lKVxuICAgICAgICBuaWNraW5nW2sgLSAxXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcIm5hbWUtZmllbGQtZ29uZVwiKSkge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY2hhbmdlQnV0dG9uW2sgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlQ2hhdFxubW9kdWxlLmV4cG9ydHMuY2hhbmdlID0gY2hhdFNldHRpbmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNoZWNrTmljaygpIHtcblxuICAgIHZhciBuaWNrSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGsgPSAwO1xuICAgIHZhciBuaWNrbmFtZSA9IFwiXCI7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbmlja0lucHV0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGsgKz0gMTtcbiAgICB9XG5cbiAgICAvL0NoZWNrIGlmIHRoZXJlIGlzIGEgbmlja25hbWUgaW4gbG9jYWxzdG9yYWdlXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcblxuICAgICAgICAvL0dldCBuaWNrIGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAgICBuaWNrbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XG4gICAgICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vRWxzZSBkaXNwbGF5IG5pY2sgYm94LlxuICAgICAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgfVxuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZUNoYXRcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tOaWNrO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYXQoKSB7XG5cbiAgICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xuICAgIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcbiAgICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xuICAgIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XG4gICAgdmFyIGZpbmROYW1lRmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XG4gICAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XG4gICAgdmFyIGNoYXRTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NoYXRTZXR0aW5nc1wiKTtcbiAgICB2YXIgbm9SZXBlYXRDb3VudGVyID0gMDtcblxuICAgIC8vQ3JlYXRlcyBuZXcgc29ja2V0XG4gICAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXR0ZXh0XCIpO1xuXG4gICAgLy9DaGVjayBmb3IgY2hhdCBzZXR0aW5nc1xuICAgIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjaGVja05pY2suY2hlY2soKTtcbiAgICAgICAgbm9SZXBlYXRDb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9Hb2VzIGFoZWFkIGFuZCBzZXQgYSB1c2VybmFtZSB3aXRoIHRoZSBoZWxwIGZyb20gdGhlIG5pY2sgY2hhbmdlci5cbiAgICBmaW5kTmlja1N1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxuICAgICAgICBpZiAoZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBkYXRhLnVzZXJuYW1lID0gZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUpO1xuICAgICAgICAgICAgZmluZE5hbWVGaWVsZFtub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgdGV4dENvbnRhaW5lcltub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vQ2hlY2tzIGlmIGV2ZXJ5dGhpbmcgbmVjZXNzYXJ5IGlzIHRoZXJlIGZvciBhIG1lc3NhZ2UuXG4gICAgZmluZFN1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2Uubmlja25hbWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRhdGEudXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xuICAgICAgICAgICAgZGF0YS5kYXRhID0gZmluZFRleHRBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL1RoZSBrZXlzIGFuZCB2YWx1ZXMgbmVlZGVkIGZvciBhIG1lc3NhZ2UuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIFwidHlwZVwiOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgXCJkYXRhXCI6IFwiXCIsXG4gICAgICAgIFwidXNlcm5hbWVcIjogXCJcIixcbiAgICAgICAgXCJjaGFubmVsXCI6IFwiXCIsXG4gICAgICAgIFwia2V5XCI6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIixcbiAgICAgICAgXCJkaWRVc2VyU2VuZFwiOiBcInVzZXJTZW50XCJcbiAgICB9O1xuXG4gICAgLy9PcGVuIHNvY2tlclxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DaGVja3MgYWdhaW4gZm9yIG5pY2suXG4gICAgICAgIGZpbmRTdWJtaXRbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgIT09IFwiXCIgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgLy8gU2VuZCBtZXNzYWdlXG4gICAgICAgICAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL0VuYWJsZSBvbiBlbnRlciBwcmVzcyBzZW5kaW5nLlxuICAgICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy9XaGVuIHNlbnQsIHJlbmRlciB0aGUgZm9sbG93aW5nIHRvIHRoZSB1c2VyIHRleHQgd2luZG93LlxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcFRhZ1VzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgICAgIHZhciBkaXZUYWdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgdmFyIGlzTWUgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRpZFVzZXJTZW5kO1xuICAgICAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XG4gICAgICAgIHZhciBjaGF0VXNlciA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkudXNlcm5hbWU7XG4gICAgICAgIHZhciBjcmVhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdERhdGEpO1xuICAgICAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcbiAgICAgICAgcFRhZ1VzZXIuYXBwZW5kQ2hpbGQoY3JlYXRlVXNlcik7XG4gICAgICAgIHBUYWdNZXNzLmFwcGVuZENoaWxkKGNyZWF0ZVRleHQpO1xuICAgICAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcbiAgICAgICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnTWVzcyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Q29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoY2hhdFVzZXIgIT09IG51bGwgJiYgY2hhdERhdGEgIT09IHVuZGVmaW5lZCAmJiBjaGF0RGF0YSAhPT0gXCJcIikge1xuXG4gICAgICAgICAgICAgICAgLy9JZiBpdCB3YXMgc2VudCBieSB0aGUgdXNlciAtIHB1dCBpdCBvbiB0aGUgdXNlciBzaWRlIG9mIHRoZSBjaGF0LlxuICAgICAgICAgICAgICAgIGlmIChjaGF0VXNlciA9PT0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAmJiBpc01lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2VGFnVGV4dC5jbGFzc0xpc3QuYWRkKFwidXNlci1zZW50XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQXBwZW5kIHRoZSBlbGVtZW50cyBhYm92ZS5cbiAgICAgICAgICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLmFwcGVuZENoaWxkKGRpdlRhZ1RleHQpO1xuXG4gICAgICAgICAgICAgICAgLy9TY3JvbGwgdG8gYm90dG9tLlxuICAgICAgICAgICAgICAgIHRleHRDb250YWluZXJbaV0uc2Nyb2xsVG9wID0gdGV4dENvbnRhaW5lcltpXS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG4vL09mZiB0byByZW5kZXJXaW5kb3dcbm1vZHVsZS5leHBvcnRzLmNoYXQgPSBjcmVhdGVDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNvbG9yU2NoZW1lZXIoKSB7XG5cbiAgICAvL0dldHMgdGhlIHRlbXBsYXRlXG4gICAgdmFyIGxvYWRTY2hlbWUgPSByZXF1aXJlKFwiLi9sb2FkU2NoZW1lXCIpO1xuICAgIGxvYWRTY2hlbWUubG9hZCgpO1xuXG4gICAgLy9HZXRzIHRoZSBpbnB1dCB0YWdzIGhleC1jb2Rlc1xuICAgIHZhciBmZXRjaENvbG9yID0gcmVxdWlyZShcIi4vZmV0Y2hDb2xvclwiKTtcbiAgICBmZXRjaENvbG9yLmZldGNoKCk7XG5cbiAgICAvL0dldHMgaGV4LWNvZGUgYW5kIHN0eWxpbmcgZm9yIHRoZSBmb250LlxuICAgIHZhciBzZXRGb250RmFtaWx5ID0gcmVxdWlyZShcIi4vc2V0Rm9udEZhbWlseVwiKTtcbiAgICBzZXRGb250RmFtaWx5LnNldCgpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGNvbG9yU2NoZW1lZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gZmV0Y2hDb2xvcigpIHtcbiAgICB2YXIgaGV4Q29udGFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3ItY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleEluLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgbmV3Q291bnRlciArPSAxO1xuXG4gICAgICAgIGhleEluW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0ID0gc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5jaGlsZHJlblswXTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bM10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPj0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gaGV4SW5bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzID09PSBoZXhJblsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IGhleEluWzNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGVudGVyZWQgdGV4dCBpcyB2YWxpZCBoZXguXG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNykge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vU2V0cyBjb2xvcnMgb24gaW5wdXRzIGRlcGVuZGluZyBvbiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzhiMzAzMFwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OUFFMzdcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5mZXRjaCA9IGZldGNoQ29sb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gbG9hZFNjaGVtZSgpIHtcbiAgICB2YXIgZmluZFNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGVzaWduLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcE9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzaWduLW9uZVwiKTtcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBPbmUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIHZhciBzZXRQb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmVmb3JlLXRoaXNcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFNxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9BcHBlbmRzIHRoZSB0ZW1wbGF0ZVxuICAgIGZpbmRTcXVhcmVbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgc2V0UG9pbnRbY291bnRlciAtIDFdKTtcblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRGb250RmFtaWx5KCkge1xuICAgIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vdmVyLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcGxhdGVzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oZWFkZXItb25lIGlucHV0XCIpO1xuICAgIHZhciBzd2l0Y2hDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXJcIik7XG4gICAgdmFyIHN3aXRjaENvbnRhaW5lckJvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXItYm9sZFwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcblxuICAgIC8vRXhhbXBsZSB0ZXh0XG4gICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiTE9SRU0gSVBTVU1cIjtcblxuICAgIGhleEluLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgICAgICAvL0dldHMgYSAjIGluIHRoZXJlIC0gdG8gZGVjbGFyZSB0aGUgaW5wdXQgYXMgaGV4LiAtPiBBZGQgY29sb3IgdG8gdGV4dC5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxuICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XG5cbiAgICAgICAgICAgICAgICAvL1NldHMgY29sb3IgdG8gaW5wdXQgZGVwZW5kaW5nIG9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2FlMzczN1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIHNlcmlmXG4gICAgc3dpdGNoQ29udGFpbmVyW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZXJpZlwiKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIGJvbGRcbiAgICBzd2l0Y2hDb250YWluZXJCb2xkW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5jb250YWlucyhcImJvbGRcIikpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gY29sb3JTY2hlbWVlclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Rm9udEZhbWlseTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjYXJkUmFuZG9taXplcigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGNhcmRBcnIgPSBbXTtcbiAgICB2YXIgbmV3TnVtYmVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRBcnIucHVzaChpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0Zpc2hlciB5YXRlcyBzaHVmZmxlIGZ1bmN0aW9uXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShjYXJkQXJyKSB7XG4gICAgICAgIHZhciBtID0gY2FyZEFyci5sZW5ndGg7XG4gICAgICAgIHZhciB0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxuICAgICAgICB3aGlsZSAobSkge1xuXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnTigKZcbiAgICAgICAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobSAtPSAxKSk7XG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHQgPSBjYXJkQXJyW21dO1xuICAgICAgICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XG4gICAgICAgICAgICBjYXJkQXJyW2ldID0gdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYXJkQXJyO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG5ld0NvdW50ZXIgKz0gMTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHJhbmRvbUFuZFNldCgpIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgd2luZG93Q291bnQgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB3aW5kb3dDb3VudCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3RzIGFsbCB0aGUgY2FyZHNcbiAgICAgICAgdmFyIGNhcmRzSW5XaW5kb3dzID0gd2luZG93c1t3aW5kb3dDb3VudCAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcblxuICAgICAgICAvL0ZvciBlYSB2YWx1ZSBpbiBhcnJheSBhZGRzIGNhcmQgbnVtYmVyIHRvIGNsYXNzLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgICAgbmV3TnVtYmVyID0gc2h1ZmZsZShjYXJkQXJyKS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgICBjYXJkc0luV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKG5ld051bWJlcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJhbmRvbUFuZFNldCgpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMucnVuID0gY2FyZFJhbmRvbWl6ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2hlY2tQYWlyKCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuICAgIHZhciB0YXJnZXRBcnIgPSBbXTtcbiAgICB2YXIgc2F2ZVRhcmdldCA9IFtdO1xuICAgIHZhciBjbGlja3MgPSAwO1xuICAgIHZhciB0cmllcyA9IDA7XG4gICAgdmFyIHBhaXJDb3VudGVyID0gMDtcbiAgICB2YXIgd2luQ2hlY2sgPSByZXF1aXJlKFwiLi93aW5DaGVja1wiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBjYXJkc0luV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gICAgdmFyIGNvdW50ZXJJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRW50ZXIoKSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgdGhpcy5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0ZW5lcihldmVudCkge1xuXG4gICAgICAgIGlmIChjbGlja3MgPCAyKSB7XG5cbiAgICAgICAgICAgIGNsaWNrcyArPSAxO1xuXG4gICAgICAgICAgICB0cmllcyArPSAxO1xuXG4gICAgICAgICAgICB2YXIgZ2V0V2luZG93ID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaGVtZSA9IGdldFdpbmRvdy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIpO1xuXG4gICAgICAgICAgICAvLyBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiL1wiICsgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSArIFwiLnBuZycpXCI7XG5cbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy9Iw6RyIHNrYSBtYW4ga3VubmEgw6RuZHJhIHZpbGtlbiBiaWxkZW4gc2thIHZhcmEuXG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyci5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyLnB1c2godGhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnJbMF0gPT09IHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyciA9IHRhcmdldEFyci5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgY2xpY2tzID0gY2xpY2tzIC09IDE7XG4gICAgICAgICAgICAgICAgcGFpckNvdW50ZXIgPSBwYWlyQ291bnRlciAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3VudGVySW5XaW5kb3cudGV4dENvbnRlbnQgPSB0cmllcztcblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyclswXSAhPT0gdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0Fyci5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdICYmIHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5ld0Fyci5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgICAgICBuZXdBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChuZXdBcnJbMF0gJiYgbmV3QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja3MgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJDb3VudGVyICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhaXJDb3VudGVyID49IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luQ2hlY2sud2luKGNvdW50ZXJJbldpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkc0luV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGNoZWNrRW50ZXIpO1xuICAgICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcik7XG4gICAgfVxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tQYWlyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZU1lbW9yeSgpIHtcblxuICAgIC8vR2V0cyB0ZW1wbGF0ZVxuICAgIHZhciBsb2FkaW5nQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkaW5nQ2FyZHNcIik7XG4gICAgbG9hZGluZ0NhcmRzLmxvYWQoKTtcblxuICAgIC8vSW1wbGVtZW50cyB0aGUgdGhlbWUgY2hhbmdlclxuICAgIHZhciB0aGVtZUNoYW5nZXIgPSByZXF1aXJlKFwiLi90aGVtZUNoYW5nZXJcIik7XG4gICAgdGhlbWVDaGFuZ2VyLmNoYW5nZSgpO1xuXG4gICAgLy9HaXZlcyBjYXJkIGltZyBkZXBlbmRpbmcgb24gY2xhc3MgdmFsdWVcbiAgICB2YXIgc2V0Q2FyZHMgPSByZXF1aXJlKFwiLi9zZXRDYXJkc1wiKTtcbiAgICBzZXRDYXJkcy5zZXQoKTtcblxuICAgIC8vUmFuZG9taXppbmcgY2FyZHNcbiAgICB2YXIgY2FyZFJhbmRvbWl6ZXIgPSByZXF1aXJlKFwiLi9jYXJkUmFuZG9taXplclwiKTtcbiAgICBjYXJkUmFuZG9taXplci5ydW4oKTtcblxuICAgIC8vVGhlIGdhbWUgbG9naWMuXG4gICAgdmFyIGNoZWNrUGFpciA9IHJlcXVpcmUoXCIuL2NoZWNrUGFpclwiKTtcbiAgICBjaGVja1BhaXIuY2hlY2soKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogR2V0cyB0aGUgbWVtb3J5IHRlbXBsYXRlXG4gKi9cbmZ1bmN0aW9uIGxvYWRpbmdDYXJkcygpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnktdGVtcGxhdGVcIik7XG4gICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB2YXIgY2xpY2tDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jbGlja0NvdW50ZXJcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIilbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgY2xpY2tDb3VudGVyW2NvdW50ZXIgLSAxXSk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZGluZ0NhcmRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogR2V0cyB0aGVtZVxuICogR2l2ZXMgZWxlbWVudCBhcHByb3ByaWF0ZSBhbmQgbWF0Y2hpbmcgaW1hZ2VzIHRoYXQgcmVwcmVzZW50cyBjYXJkcy5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FyZHMoKSB7XG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICAgIHZhciBtZW1XaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG1lbVdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBsYXN0VGhlbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIC8vSWYgdGhlcmUncyBubyBpbWFnZSAtIHNldCB0aGUgaW1hZ2VzIHdpdGggdGhlIGxhc3QgdXNlZCB0aGVtZS5cbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhcmRzW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1pbWFnZVwiKSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xuICAgICAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGxhc3RUaGVtZSArIFwiLzAucG5nJylcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3Mgbm8gdGhlbWUsIHRoZW4gdXNlIHRoZSBwbGFpbiB0aGVtZS5cbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIGl0IGF2YWlsYWJsZSBmb3IgdGhlIHVzZXIgdG8gY2hhbmdlIHRoZSB0aGVtZSBvZiB0aGUgbWVtb3J5LlxuICovXG5mdW5jdGlvbiB0aGVtZUNoYW5nZXIoKSB7XG4gICAgdmFyIGhhc0NhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50aGVtZS1zZWxlY3RvclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhhc0NhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICAvL1NlbGVjdCBhbGwgY2FyZHMuXG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKVtjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuXG4gICAgLy9DaGVjayBhbmQgZ2V0IChpZikgdGhlbWVcbiAgICBmdW5jdGlvbiB3aGF0Q2FyZHMoY29sb3IpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIGNvbG9yKTtcblxuICAgICAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIGNvbG9yKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGNvbG9yICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwicGxhaW5cIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwicmVkXCIpO1xuICAgIH0pO1xuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVsyXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoYXRDYXJkcyhcImJsdWVcIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzNdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwiZ3JlZW5cIik7XG4gICAgfSk7XG5cbiAgICB2YXIgdGhlbWVCdXR0b24gPSBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIGZ1bmN0aW9uIGJyaW5nVGhlbWUoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnRvZ2dsZShcInRoZW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnRvZ2dsZShcImNhcmQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgIH1cblxuICAgIHRoZW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBicmluZ1RoZW1lKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IHRoZW1lQ2hhbmdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEFkZHMgYSB3aW5uaW5nIG1lc3NhZ2UgdG8gdGhlIHRoZSBzcGVjaWZpYyB3aW5kb3cgKEN1cnJlbnQgd2luZG93KS5cbiAqIEBwYXJhbSBjdXJyZW50V2luZG93XG4gKi9cbmZ1bmN0aW9uIHdpbkNoZWNrKGN1cnJlbnRXaW5kb3cpIHtcbiAgICB2YXIgeW91V2luID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJZT1UgV0lOIVwiKTtcbiAgICB2YXIgYnJlYWtpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlJcIik7XG4gICAgdmFyIHB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICBwdGFnLmFwcGVuZENoaWxkKHlvdVdpbik7XG4gICAgcHRhZy5jbGFzc0xpc3QuYWRkKFwid2lubmluZy1tZXNzYWdlXCIpO1xuICAgIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQoYnJlYWtpbmcpO1xuICAgIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQocHRhZyk7XG4gICAgY3VycmVudFdpbmRvdy5jbGFzc0xpc3QuYWRkKFwicHJlc2VudC1jbGlja1wiKTtcbn1cblxuLy9PZmYgdG8gY2hlY2tQYWlyXG5tb2R1bGUuZXhwb3J0cy53aW4gPSB3aW5DaGVjaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIHRoZSB3aW5kb3cgZHJhZ2dhYmxlLlxuICovXG5mdW5jdGlvbiBtb3ZhYmxlKCkge1xuXG4gICAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblxuICAgICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRXaW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy9EZWNsYXJlcyB2YXJpYWJsZXMgdXNlZCBmb3IgbG9jYXRpbmcgcG9pbnRlci5cbiAgICB2YXIgYVZhclkgPSAwO1xuICAgIHZhciBhVmFyWCA9IDA7XG4gICAgdmFyIHNhdmVUYXJnZXQgPSAwO1xuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHRhcmdldCBoYXMgdGhlIGNsYXNzbmFtZSBcInRvcFwiLlxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5zbGljZSgwLCAzKSA9PT0gXCJ0b3BcIikge1xuXG4gICAgICAgICAgICAvL1NhdmVzIHRoZSBjdXJyZW50IGNvcmRzIC0gYW5kIHRoZSBjdXJyZW50IHRhcmdldC5cbiAgICAgICAgICAgIGFWYXJZID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgICAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcblxuICAgICAgICAgICAgLy9HaXZlcyB0aGUgY3VycmVudCB0YXJnZXQgYSAncHJldHR5JyBhbmQgcHJhY3RpY2FsIG9wYWNpdHkuXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDAuODU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuXG4gICAgICAgIC8vU2V0cyB0aGUgb3BhY2l0eSB0byAxIHdoZW4gdGhlIHVzZXIgZHJvcHMgdGhlIHdpbmRvdy5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmaW5kV2luZG93c1tpXS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGl2TW92ZShldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB3aW5kb3cgc2hvdWxkIG1vdmUgLSBzZXRzIGJvdW5kaW5nLWJveCAoZm9yIGJvdGggeCBhbmQgeSkuXG4gICAgICAgIGlmIChldmVudC55IC0gYVZhclkgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC55IC0gYVZhclkpO1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQueSAtIGFWYXJZID4gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUpIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAqIDAuNSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBldmVudC55IC0gYVZhclkgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQueCAtIGFWYXJYIDwgMCkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnggLSBhVmFyWCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41KSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBldmVudC54IC0gYVZhclggKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFkZExpc3RlbmVycygpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gcHJlbG9hZGluZygpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGltZzEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzggPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzkgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBpbWcxLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8wLnBuZ1wiO1xuICAgICAgICBpbWcyLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8xLnBuZ1wiO1xuICAgICAgICBpbWczLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8yLnBuZ1wiO1xuICAgICAgICBpbWc0LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8zLnBuZ1wiO1xuICAgICAgICBpbWc1LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS80LnBuZ1wiO1xuICAgICAgICBpbWc2LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS81LnBuZ1wiO1xuICAgICAgICBpbWc3LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS82LnBuZ1wiO1xuICAgICAgICBpbWc4LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS83LnBuZ1wiO1xuICAgICAgICBpbWc5LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS84LnBuZ1wiO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpbWcxMCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzEyID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE1ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE4ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaW1nMTAuc3JjID0gXCIuLi9pbWFnZS9yZWQvMC5wbmdcIjtcbiAgICAgICAgaW1nMTEuc3JjID0gXCIuLi9pbWFnZS9yZWQvMS5wbmdcIjtcbiAgICAgICAgaW1nMTIuc3JjID0gXCIuLi9pbWFnZS9yZWQvMi5wbmdcIjtcbiAgICAgICAgaW1nMTMuc3JjID0gXCIuLi9pbWFnZS9yZWQvMy5wbmdcIjtcbiAgICAgICAgaW1nMTQuc3JjID0gXCIuLi9pbWFnZS9yZWQvNC5wbmdcIjtcbiAgICAgICAgaW1nMTUuc3JjID0gXCIuLi9pbWFnZS9yZWQvNS5wbmdcIjtcbiAgICAgICAgaW1nMTYuc3JjID0gXCIuLi9pbWFnZS9yZWQvNi5wbmdcIjtcbiAgICAgICAgaW1nMTcuc3JjID0gXCIuLi9pbWFnZS9yZWQvNy5wbmdcIjtcbiAgICAgICAgaW1nMTguc3JjID0gXCIuLi9pbWFnZS9yZWQvOC5wbmdcIjtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaW1nMTkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIzID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHZhciBpbWcyOCA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGltZzE5LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMC5wbmdcIjtcbiAgICAgICAgaW1nMjAuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8xLnBuZ1wiO1xuICAgICAgICBpbWcyMS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzIucG5nXCI7XG4gICAgICAgIGltZzIyLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMy5wbmdcIjtcbiAgICAgICAgaW1nMjMuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi80LnBuZ1wiO1xuICAgICAgICBpbWcyNC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzUucG5nXCI7XG4gICAgICAgIGltZzI1LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNi5wbmdcIjtcbiAgICAgICAgaW1nMjYuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi83LnBuZ1wiO1xuICAgICAgICBpbWcyNy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzgucG5nXCI7XG5cbiAgICAgICAgaW1nMjguc3JjID0gXCIuLi9pbWFnZS9pY29ucy9jb2dncmV5LnBuZ1wiO1xuXG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gYXBwXG5tb2R1bGUuZXhwb3J0cy5sb2FkaW5nID0gcHJlbG9hZGluZztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYWxsIHdpbmRvd3MgcmVhZHkgZm9yIHVzZS5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyV2luZG93KCkge1xuXG4gICAgdmFyIG1vdmFibGUgPSByZXF1aXJlKFwiLi9tb3ZhYmxlXCIpO1xuICAgIHZhciB3aW5kb3dEZXN0cm95ZXIgPSByZXF1aXJlKFwiLi93aW5kb3dEZXN0cm95ZXJcIik7XG4gICAgdmFyIGNyZWF0ZU1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeS9jcmVhdGVNZW1vcnlcIik7XG4gICAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jaGF0L2NyZWF0ZUNoYXRcIik7XG4gICAgdmFyIGNvbG9yU2NoZW1lZXIgPSByZXF1aXJlKFwiLi9jb2xvclNjaGVtZWVyL2NvbG9yU2NoZW1lZXJcIik7XG4gICAgdmFyIHdpbmRvd1BsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3dpbmRvd1BsYWNlbWVudFwiKTtcbiAgICB2YXIgc2V0WiA9IHJlcXVpcmUoXCIuL3NldFpcIik7XG5cbiAgICAvL0NoZWNrcyBpZiB3aGljaCBuYXYtYnV0dG9uIGlzIGJlaW5nIHByZXNzZWQuXG4gICAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XG4gICAgICAgIHZhciBmaW5kTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pY29uMVwiKTtcblxuICAgICAgICBmdW5jdGlvbiBjaGVja05hdihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMV0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXJNZW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzJdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyU2NoZW1lZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tOYXYpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5hdkNsaWNrKCk7XG5cbiAgICAvL0NyZWF0ZXMgY2hhdCBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcbiAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgY2hhdC1wYXJ0LCBtb3ZhYmxlLXdpbmRvdywgei1pbmRleCwgYWJsZSB0byBkZXN0cm95IHdpbmRvdy5cbiAgICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICAgIGNyZWF0ZUNoYXQuY2hhdCgpO1xuICAgICAgICBtb3ZhYmxlLm1vdmUoKTtcbiAgICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcblxuICAgIH1cblxuICAgIC8vQ3JlYXRlIG1lbW9yeVxuICAgIGZ1bmN0aW9uIHJlbmRlck1lbSgpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgY3JlYXRlLW1lbW9yeSwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgIGNyZWF0ZU1lbW9yeS5jcmVhdGUoKTtcbiAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG4gIH1cblxuICAgIC8vQ3JlYXRlcyBTY2hlbWVlIChUaGlyZCAnYXBwJylcbiAgICBmdW5jdGlvbiByZW5kZXJTY2hlbWVlKCkge1xuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY2hlbWVlLXRlbXBsYXRlXCIpO1xuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgc2NoZW1lZXItaW5pdCwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgIGNvbG9yU2NoZW1lZXIuaW5pdGlhbGl6ZSgpO1xuICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICBzZXRaLnNldCgpO1xuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcbiAgfVxuXG59XG5cbi8vT2ZmIHRvIGFwcFxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNldFooKSB7XG4gICAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuXG4gICAgZnVuY3Rpb24gaGlnZXN0Wih0aGVXaW5kb3dzLCBuYXZpbmcpIHtcblxuICAgICAgICB2YXIgZ2xhc3NTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoZVdpbmRvd3MpO1xuICAgICAgICB2YXIgaGlnaGVzdCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbGFzc1NxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgLy9DaGVja3MgYWxsIHRoZSB3aW5kb3dzIGZvciB6LWluZGV4XG4gICAgICAgICAgICB2YXIgemluZGV4ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2xhc3NTcXVhcmVbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJ6LWluZGV4XCIpO1xuICAgICAgICAgICAgaWYgKCh6aW5kZXggIT09IFwiYXV0b1wiKSkge1xuXG4gICAgICAgICAgICAgICAgLy9JZiBpdCdzIHRoZSBuYXYgLSB0aGVuIGFkZCAyMDAgdG8gdGhlIHotaW5kZXgsIGVsc2UganVzdCBvbmUgZm9yIG5vcm1hbCB3aW5kb3dzLlxuICAgICAgICAgICAgICAgIGlmIChuYXZpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAyMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAxO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUHVzaCB2YWx1ZXMgaW50byBhcnJheVxuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaChoaWdoZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1NvcnQgYXJyYXlcbiAgICAgICAgbmV3QXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIgLSBhO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL0lmIHRoZSBoaWdoZXN0IGluIGFycmF5IGlzbid0IHVuZGVmaW5lZCwgcmV0dXJuIHRoYXQgdmFsdWUsIGVsc2UgcmV0dXJuIG5vcm1hbCBoaWdoZXN0LlxuICAgICAgICBpZiAobmV3QXJyWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXdBcnJbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGlnaGVzdDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy9XaGVuIHJ1biwgZ2V0IHRoZSBoaWdoZXN0IHotaW5kZXggYW5kIHNldCB0aGF0IHRvIHRoZSBuYXZiYXJcbiAgICBuYXYuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgdHJ1ZSkpO1xuXG4gICAgZnVuY3Rpb24gc2V0dGluZ05lKCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL0luIG9yZGVyIGZvciBuYXYgdG8gZ2V0IHRoZSBoaWdoZXN0IHotaW5kZXgsIGdpdmUgdGhlIHdpbmRvd3Mgei1pbmRleCBvbiBpbml0LlxuICAgICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiKSk7XG5cbiAgICAgICAgLy9XaGVuIGNsaWNraW5nIGEgd2luZG93LCBjaGVjayB0aGUgaGlnaGVzdCB6LWluZGV4IGFuZCBhZGQgdGhhdCB0byB0aGF0IHNwZWNpZmljIHdpbmRvdy5cbiAgICAgICAgd2luZG93c1tjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgZmFsc2UpKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHNldHRpbmdOZSgpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvdyArIHdpbmRvd1BsYWNlbWVudFxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0WjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqTGV0J3MgdGhlIG5hdmJhciBhcHBlYXIgb24gbG9hZCAoR2l2ZXMgYSB2aXN1YWxseSBwbGVhc2luZyBlZmZlY3QpLlxuICovXG5mdW5jdGlvbiB0YXNrYmFyKCkge1xuICAgIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIHRoZSB3aW5kb3dzIHJlbW92YWJsZS5cbiAqL1xuZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xuICAgIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZpbmcoZXZlbnQpIHtcblxuICAgICAgICAvL0NoZWNrcyBzcGVjaWZpY2FsbHkgZm9yIHRoZSBmYWN0IHRoYXQgd2UncmUgbm90IHRyeWluZyB0byByZW1vdmUgdGhlIGJvZHkuXG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IGJvZHkpIHtcblxuICAgICAgICAgICAgLy9UaGVuIHJlbW92ZXMuXG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGZpbmRFeGl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmluZyk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBuZXdDb3VudGVyID0gMDtcbnZhciBoZWlnaHQgPSAwO1xudmFyIHdpZHRoID0gMDtcbnZhciBjb3VudGluZyA9IDA7XG5cbi8qKlxuICogV2hlcmUgdGhlIHdpbmRvdyBzaG91bGQgYmUgcGxhY2VkIG9uIGxvYWQuXG4gKi9cbmZ1bmN0aW9uIHdpbmRvd1BsYWNlbWVudCgpIHtcblxuICAgIGZ1bmN0aW9uIHdoZXJlVG9QbGFjZSgpIHtcbiAgICAgICAgdmFyIGZpbmRBbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xuICAgICAgICBzZXRaLnNldCgpO1xuXG4gICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgMzAgKiBuZXdDb3VudGVyICsgXCJweFwiO1xuICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyAzMCAqIG5ld0NvdW50ZXIgKyBcInB4XCI7XG5cbiAgICAgICAgaGVpZ2h0ICs9IDMwO1xuICAgICAgICB3aWR0aCArPSAzMDtcblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgd2luZG93cyBhcmUgdG9vIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgaWYgKCh3aWR0aCkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA1MDApIHtcbiAgICAgICAgICAgIG5ld0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgd2lkdGggPSAzMDtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHdpbmRvd3MgYXJlIHRvbyBjbG9zZSB0byB0aGUgcmlnaHQgYm9yZGVyIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgIGlmICgoaGVpZ2h0KSA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNDUwKSB7XG4gICAgICAgICAgICBjb3VudGluZyArPSAxO1xuICAgICAgICAgICAgaGVpZ2h0ID0gNSAqIGNvdW50aW5nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2hlcmVUb1BsYWNlKCk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5wbGFjZSA9IHdpbmRvd1BsYWNlbWVudDtcbiJdfQ==
