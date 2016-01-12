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
        type: "message",
        data: "",
        username: "",
        channel: "",
        key: "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd",
        didUserSend: "userSent"
    };

    //Open socker
    socket.addEventListener("open", function() {
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

/**
 * Obtains the colors from input and checks for errors.
 */
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

                //Selection is the current input (this).
                function setBg(selection) {
                    if (selection === hexIn[0]) {
                        saveTarget.children[0].style.backgroundColor = hexIn[0].value;
                    }

                    if (selection === hexIn[1]) {
                        saveTarget.children[1].style.backgroundColor = hexIn[1].value;
                    }

                    if (selection === hexIn[2]) {
                        saveTarget.style.backgroundColor = hexIn[2].value;
                    }

                    if (selection === hexIn[3]) {
                        saveTarget.children[2].style.backgroundColor = hexIn[3].value;
                    }
                }

                if (this.value.length === 6 && this.value.slice(0, 1) !== "#") {

                    //If there's six letters and no hashtag.
                    this.value = "#" + this.value;
                    this.parentElement.children[0].style.backgroundColor = this.value;
                    setBg(this);

                } else if (this.value.length === 7 && this.value.slice(0, 1) === "#") {

                    //If there's 6 letters + a hashtag - proceed as normal.
                    this.parentElement.children[0].style.backgroundColor = this.value;
                    setBg(this);

                } else if (this.value.length >= 7 && this.value.slice(0, 1) !== "#") {

                    //If there's 7 or more letters (More should be impossible) - then remove that last and add a hash.
                    this.value = "#" + this.value.slice(0, -1);
                    setBg(this);
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

/**
 * Gamelogic (Is it pair? What if it isn't? Can the user press? Etc.)
 */
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

    function outbreak(whichElement) {
        newArr.push(whichElement.parentElement.className);
        saveTarget.push(whichElement);
    }

    function onPair() {
        saveTarget[0].classList.add("aPair");
        saveTarget[1].classList.add("aPair");
        saveTarget[0].setAttribute("tabindex", "0");
        saveTarget[0].setAttribute("tabindex", "0");
        clicks = 0;
        pairCounter += 1;
        if (pairCounter >= 8) {
            winCheck.win(counterInWindow);
        }
    }

    function notPair(theTheme) {

        if (localStorage.theme !== "") {

            // var lastTheme = localStorage.getItem("theme");
            saveTarget[0].style.backgroundImage = "url('../image/" + theTheme + "/0.png')";
            saveTarget[1].style.backgroundImage = "url('../image/" + theTheme + "/0.png')";
        } else {
            saveTarget[0].style.backgroundImage = "url('../image/plain/0.png')";
            saveTarget[1].style.backgroundImage = "url('../image/plain/0.png')";
        }

        clicks = 0;
    }

    function hej(whichElement, currentTheme) {
        if (targetArr[0] !== targetArr[1]) {
            if (newArr.length < 1) {
                outbreak(whichElement);
            } else if (newArr.length < 2) {
                if (targetArr[0] && targetArr[1]) {
                    outbreak(whichElement);

                }
            } else if (newArr.length >= 2) {
                newArr.length = 0;
                saveTarget.length = 0;
                outbreak(whichElement);
            }

            if (newArr[0] && newArr[1]) {
                if (newArr[0] === newArr[1]) {
                    setTimeout(onPair, 1000);
                } else {
                    setTimeout(function() {
                        notPair(currentTheme);
                    }, 1000);
                }
            }
        }
    }

    function checkEnter(selection, event) {
        selection.click();
        event.preventDefault();
    }

    function listener(whichElement) {

        if (clicks < 2) {

            clicks += 1;

            tries += 1;

            var getWindow = whichElement.parentElement.parentElement.parentElement.parentElement;
            var currentTheme = getWindow.getAttribute("data-theme");

            whichElement.style.backgroundImage = "url('../image/" + currentTheme + "/" + whichElement.parentElement.className + ".png')";

            if (targetArr.length >= 2) {
                targetArr.length = 0;
            }

            if (targetArr.length < 2) {
                targetArr.push(whichElement);
            }

            if (targetArr[0] === targetArr[1]) {
                targetArr = targetArr.splice(0, 1);
                clicks = clicks -= 1;
                tries = tries -= 1;
                pairCounter = pairCounter -= 1;
            }

            counterInWindow.textContent = tries;

            hej(whichElement, currentTheme);

        }
    }

    function applyClicks(i, event) {
        cardsInWindow[i].addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                checkEnter(this, event);
            }
        });

        cardsInWindow[i].addEventListener("click", function() {
            listener(this, event);
        });
    }

    for (i = 0; i < cardsInWindow.length; i += 1) {
        applyClicks(i, event);
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
    var lastTheme = "";

    for (i = 0; i < memWindows.length; i += 1) {
        counter += 1;
    }

    if (localStorage.theme !== "") {
        lastTheme = localStorage.getItem("theme");
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

//Off to createMemory
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcblxuLy9Jbml0IHdpbmRvd3NcbnZhciByZW5kZXJXaW5kb3cgPSByZXF1aXJlKFwiLi9yZW5kZXJXaW5kb3dcIik7XG5yZW5kZXJXaW5kb3cucmVuZGVyKCk7XG5cbi8vSW5pdCB0YXNrYmFyXG52YXIgdGFza2JhciA9IHJlcXVpcmUoXCIuL3Rhc2tiYXJcIik7XG50YXNrYmFyLmJyaW5nRm9ydGgoKTtcblxuLy9QcmVsb2FkIGltYWdlc1xudmFyIHByZWxvYWRpbmcgPSByZXF1aXJlKFwiLi9wcmVsb2FkaW5nXCIpO1xucHJlbG9hZGluZy5sb2FkaW5nKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2hhdFNldHRpbmdzKCkge1xuICAgIHZhciBjaGFuZ2VCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5pY2stY2hhbmdlclwiKTtcbiAgICB2YXIgbmlja2luZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcbiAgICB2YXIgayA9IDA7XG4gICAgdmFyIGogPSAwO1xuXG4gICAgZm9yIChqID0gMDsgaiA8IGNoYW5nZUJ1dHRvbi5sZW5ndGg7IGogKz0gMSkge1xuICAgICAgICBrICs9IDE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZEFuZFNldChldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSBjaGVja05pY2sgaGFzIHRyaWdnZXJlZCAobmFtZS1maWVsZC1nb25lKVxuICAgICAgICBuaWNraW5nW2sgLSAxXS5zZXRBdHRyaWJ1dGUoXCJwbGFjZWhvbGRlclwiLCBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpKTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5jb250YWlucyhcIm5hbWUtZmllbGQtZ29uZVwiKSkge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QucmVtb3ZlKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgY2hhbmdlQnV0dG9uW2sgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZmluZEFuZFNldCk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlQ2hhdFxubW9kdWxlLmV4cG9ydHMuY2hhbmdlID0gY2hhdFNldHRpbmdzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNoZWNrTmljaygpIHtcblxuICAgIHZhciBuaWNrSW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XG5cbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGsgPSAwO1xuICAgIHZhciBuaWNrbmFtZSA9IFwiXCI7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbmlja0lucHV0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGsgKz0gMTtcbiAgICB9XG5cbiAgICAvL0NoZWNrIGlmIHRoZXJlIGlzIGEgbmlja25hbWUgaW4gbG9jYWxzdG9yYWdlXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcblxuICAgICAgICAvL0dldCBuaWNrIGZyb20gbG9jYWwgc3RvcmFnZVxuICAgICAgICBuaWNrbmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XG4gICAgICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vRWxzZSBkaXNwbGF5IG5pY2sgYm94LlxuICAgICAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgfVxuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZUNoYXRcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tOaWNrO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNoYXQoKSB7XG5cbiAgICB2YXIgZmluZFN1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3VibWl0XCIpO1xuICAgIHZhciBmaW5kVGV4dEFyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtbWVzc1wiKTtcbiAgICB2YXIgZmluZE5pY2tTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmFjY2VwdC1uYW1lXCIpO1xuICAgIHZhciBmaW5kTmlja0FyZWEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XG4gICAgdmFyIGZpbmROYW1lRmllbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hbWUtZmllbGRcIik7XG4gICAgdmFyIHRleHRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRleHQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjaGVja05pY2sgPSByZXF1aXJlKFwiLi9jaGVja05pY2tcIik7XG4gICAgdmFyIGNoYXRTZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2NoYXRTZXR0aW5nc1wiKTtcbiAgICB2YXIgbm9SZXBlYXRDb3VudGVyID0gMDtcblxuICAgIC8vQ3JlYXRlcyBuZXcgc29ja2V0XG4gICAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQoXCJ3czovL3Zob3N0My5sbnUuc2U6MjAwODAvc29ja2V0L1wiLCBcImNoYXR0ZXh0XCIpO1xuXG4gICAgLy9DaGVjayBmb3IgY2hhdCBzZXR0aW5nc1xuICAgIGNoYXRTZXR0aW5ncy5jaGFuZ2UoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjaGVja05pY2suY2hlY2soKTtcbiAgICAgICAgbm9SZXBlYXRDb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9Hb2VzIGFoZWFkIGFuZCBzZXQgYSB1c2VybmFtZSB3aXRoIHRoZSBoZWxwIGZyb20gdGhlIG5pY2sgY2hhbmdlci5cbiAgICBmaW5kTmlja1N1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICpIaWRlIGFmdGVyIHVzZSAtIHNlbmQgdG8gbG9jYWwgc3RvcmFnZSAgLT4gKklzaFxuICAgICAgICBpZiAoZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBkYXRhLnVzZXJuYW1lID0gZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJuaWNrbmFtZVwiLCBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUpO1xuICAgICAgICAgICAgZmluZE5hbWVGaWVsZFtub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgdGV4dENvbnRhaW5lcltub1JlcGVhdENvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vQ2hlY2tzIGlmIGV2ZXJ5dGhpbmcgbmVjZXNzYXJ5IGlzIHRoZXJlIGZvciBhIG1lc3NhZ2UuXG4gICAgZmluZFN1Ym1pdFtub1JlcGVhdENvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2Uubmlja25hbWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRhdGEudXNlcm5hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xuICAgICAgICAgICAgZGF0YS5kYXRhID0gZmluZFRleHRBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL1RoZSBrZXlzIGFuZCB2YWx1ZXMgbmVlZGVkIGZvciBhIG1lc3NhZ2UuXG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICAgIHR5cGU6IFwibWVzc2FnZVwiLFxuICAgICAgICBkYXRhOiBcIlwiLFxuICAgICAgICB1c2VybmFtZTogXCJcIixcbiAgICAgICAgY2hhbm5lbDogXCJcIixcbiAgICAgICAga2V5OiBcImVEQkU3NmRlVTdMMEg5bUVCZ3hVS1ZSMFZDbnEwWEJkXCIsXG4gICAgICAgIGRpZFVzZXJTZW5kOiBcInVzZXJTZW50XCJcbiAgICB9O1xuXG4gICAgLy9PcGVuIHNvY2tlclxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwib3BlblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2tzIGFnYWluIGZvciBuaWNrLlxuICAgICAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlICE9PSBcIlwiICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgIT09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgIC8vIFNlbmQgbWVzc2FnZVxuICAgICAgICAgICAgICAgIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9FbmFibGUgb24gZW50ZXIgcHJlc3Mgc2VuZGluZy5cbiAgICAgICAgZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGZpbmRTdWJtaXRbY291bnRlciAtIDFdLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vV2hlbiBzZW50LCByZW5kZXIgdGhlIGZvbGxvd2luZyB0byB0aGUgdXNlciB0ZXh0IHdpbmRvdy5cbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIHBUYWdVc2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgICAgIHZhciBwVGFnTWVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICB2YXIgZGl2VGFnVGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJESVZcIik7XG4gICAgICAgIHZhciBpc01lID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5kaWRVc2VyU2VuZDtcbiAgICAgICAgdmFyIGNoYXREYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS5kYXRhO1xuICAgICAgICB2YXIgY2hhdFVzZXIgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLnVzZXJuYW1lO1xuICAgICAgICB2YXIgY3JlYXRlVGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXREYXRhKTtcbiAgICAgICAgdmFyIGNyZWF0ZVVzZXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0VXNlcik7XG4gICAgICAgIHBUYWdVc2VyLmFwcGVuZENoaWxkKGNyZWF0ZVVzZXIpO1xuICAgICAgICBwVGFnTWVzcy5hcHBlbmRDaGlsZChjcmVhdGVUZXh0KTtcbiAgICAgICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnVXNlcik7XG4gICAgICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ01lc3MpO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dENvbnRhaW5lci5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKGNoYXRVc2VyICE9PSBudWxsICYmIGNoYXREYXRhICE9PSB1bmRlZmluZWQgJiYgY2hhdERhdGEgIT09IFwiXCIpIHtcblxuICAgICAgICAgICAgICAgIC8vSWYgaXQgd2FzIHNlbnQgYnkgdGhlIHVzZXIgLSBwdXQgaXQgb24gdGhlIHVzZXIgc2lkZSBvZiB0aGUgY2hhdC5cbiAgICAgICAgICAgICAgICBpZiAoY2hhdFVzZXIgPT09IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikgJiYgaXNNZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGRpdlRhZ1RleHQuY2xhc3NMaXN0LmFkZChcInVzZXItc2VudFwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0FwcGVuZCB0aGUgZWxlbWVudHMgYWJvdmUuXG4gICAgICAgICAgICAgICAgdGV4dENvbnRhaW5lcltpXS5hcHBlbmRDaGlsZChkaXZUYWdUZXh0KTtcblxuICAgICAgICAgICAgICAgIC8vU2Nyb2xsIHRvIGJvdHRvbS5cbiAgICAgICAgICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbFRvcCA9IHRleHRDb250YWluZXJbaV0uc2Nyb2xsSGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gcmVuZGVyV2luZG93XG5tb2R1bGUuZXhwb3J0cy5jaGF0ID0gY3JlYXRlQ2hhdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjb2xvclNjaGVtZWVyKCkge1xuXG4gICAgLy9HZXRzIHRoZSB0ZW1wbGF0ZVxuICAgIHZhciBsb2FkU2NoZW1lID0gcmVxdWlyZShcIi4vbG9hZFNjaGVtZVwiKTtcbiAgICBsb2FkU2NoZW1lLmxvYWQoKTtcblxuICAgIC8vR2V0cyB0aGUgaW5wdXQgdGFncyBoZXgtY29kZXNcbiAgICB2YXIgZmV0Y2hDb2xvciA9IHJlcXVpcmUoXCIuL2ZldGNoQ29sb3JcIik7XG4gICAgZmV0Y2hDb2xvci5mZXRjaCgpO1xuXG4gICAgLy9HZXRzIGhleC1jb2RlIGFuZCBzdHlsaW5nIGZvciB0aGUgZm9udC5cbiAgICB2YXIgc2V0Rm9udEZhbWlseSA9IHJlcXVpcmUoXCIuL3NldEZvbnRGYW1pbHlcIik7XG4gICAgc2V0Rm9udEZhbWlseS5zZXQoKTtcblxufVxuXG4vL09mZiB0byByZW5kZXJXaW5kb3dcbm1vZHVsZS5leHBvcnRzLmluaXRpYWxpemUgPSBjb2xvclNjaGVtZWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogT2J0YWlucyB0aGUgY29sb3JzIGZyb20gaW5wdXQgYW5kIGNoZWNrcyBmb3IgZXJyb3JzLlxuICovXG5mdW5jdGlvbiBmZXRjaENvbG9yKCkge1xuICAgIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jb2xvci1jb250YWluZXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBuZXdDb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgaGV4Q29udGFpbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgdmFyIGhleEluID0gaGV4Q29udGFpbltjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jb2xvci1yb3cgaW5wdXRcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgaGV4SW4ubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICBuZXdDb3VudGVyICs9IDE7XG5cbiAgICAgICAgaGV4SW5baV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzYXZlVGFyZ2V0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcblxuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQgPSBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLmNoaWxkcmVuWzBdO1xuXG4gICAgICAgICAgICAgICAgLy9TZWxlY3Rpb24gaXMgdGhlIGN1cnJlbnQgaW5wdXQgKHRoaXMpLlxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNldEJnKHNlbGVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uID09PSBoZXhJblswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhJblswXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24gPT09IGhleEluWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzFdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleEluWzFdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gaGV4SW5bMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4SW5bMl0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uID09PSBoZXhJblszXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsyXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhJblszXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUncyBzaXggbGV0dGVycyBhbmQgbm8gaGFzaHRhZy5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHNldEJnKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpID09PSBcIiNcIikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUncyA2IGxldHRlcnMgKyBhIGhhc2h0YWcgLSBwcm9jZWVkIGFzIG5vcm1hbC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHNldEJnKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA+PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSdzIDcgb3IgbW9yZSBsZXR0ZXJzIChNb3JlIHNob3VsZCBiZSBpbXBvc3NpYmxlKSAtIHRoZW4gcmVtb3ZlIHRoYXQgbGFzdCBhbmQgYWRkIGEgaGFzaC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIHNldEJnKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgZW50ZXJlZCB0ZXh0IGlzIHZhbGlkIGhleC5cbiAgICAgICAgICAgICAgICB2YXIgcmVnID0gL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezN9KSQvO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9TZXRzIGNvbG9ycyBvbiBpbnB1dHMgZGVwZW5kaW5nIG9uIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVnLnRlc3QodGhpcy52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjOGIzMDMwXCI7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU5QUUzN1wiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbi8vT2ZmIHRvIGNvbG9yU2NoZW1lZXJcbm1vZHVsZS5leHBvcnRzLmZldGNoID0gZmV0Y2hDb2xvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBsb2FkU2NoZW1lKCkge1xuICAgIHZhciBmaW5kU3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kZXNpZ24tc3F1YXJlXCIpO1xuICAgIHZhciB0ZW1wT25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNkZXNpZ24tb25lXCIpO1xuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcE9uZS5jb250ZW50LCB0cnVlKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgdmFyIHNldFBvaW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5iZWZvcmUtdGhpc1wiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3F1YXJlLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICAvL0FwcGVuZHMgdGhlIHRlbXBsYXRlXG4gICAgZmluZFNxdWFyZVtjb3VudGVyIC0gMV0uaW5zZXJ0QmVmb3JlKGNsb25lLCBzZXRQb2ludFtjb3VudGVyIC0gMV0pO1xuXG59XG5cbi8vT2ZmIHRvIGNvbG9yU2NoZW1lZXJcbm1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkU2NoZW1lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNldEZvbnRGYW1pbHkoKSB7XG4gICAgdmFyIGhleENvbnRhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm92ZXItc3F1YXJlXCIpO1xuICAgIHZhciB0ZW1wbGF0ZXNIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmhlYWRlci1vbmUgaW5wdXRcIik7XG4gICAgdmFyIHN3aXRjaENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3dpdGNoLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgc3dpdGNoQ29udGFpbmVyQm9sZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc3dpdGNoLWNvbnRhaW5lci1ib2xkXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgaGV4Q29udGFpbi5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgdmFyIGhleEluID0gaGV4Q29udGFpbltjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvcihcImlucHV0XCIpO1xuXG4gICAgLy9FeGFtcGxlIHRleHRcbiAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLnZhbHVlID0gXCJMT1JFTSBJUFNVTVwiO1xuXG4gICAgaGV4SW4uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICAgICAgICAgIC8vR2V0cyBhICMgaW4gdGhlcmUgLSB0byBkZWNsYXJlIHRoZSBpbnB1dCBhcyBoZXguIC0+IEFkZCBjb2xvciB0byB0ZXh0LlxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA2ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmNvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmNvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPj0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWUuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0NoZWNrIGlmIGVudGVyZWQgdGV4dCBpcyB2YWxpZCBoZXguXG4gICAgICAgICAgICB2YXIgcmVnID0gL14jKFtBLUZhLWYwLTldezZ9fFtBLUZhLWYwLTldezN9KSQvO1xuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcpIHtcblxuICAgICAgICAgICAgICAgIC8vU2V0cyBjb2xvciB0byBpbnB1dCBkZXBlbmRpbmcgb24gdmFsdWVcbiAgICAgICAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjYWUzNzM3XCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OUFFMzdcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPCA3KSB7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwid2hpdGVcIjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICAvL1N3aXRjaCBmb3Igc2VyaWZcbiAgICBzd2l0Y2hDb250YWluZXJbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcyk7XG4gICAgICAgIGlmICh0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5jb250YWlucyhcInNlcmlmXCIpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJzZXJpZlwiKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJzZXJpZlwiKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMjVweFwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL1N3aXRjaCBmb3IgYm9sZFxuICAgIHN3aXRjaENvbnRhaW5lckJvbGRbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiYm9sZFwiKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwiYm9sZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMjVweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwiYm9sZFwiKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RFbGVtZW50Q2hpbGQuc3R5bGUubWFyZ2luTGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRGb250RmFtaWx5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNhcmRSYW5kb21pemVyKCkge1xuICAgIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIgY2FyZEFyciA9IFtdO1xuICAgIHZhciBuZXdOdW1iZXIgPSAwO1xuICAgIHZhciBuZXdDb3VudGVyID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChqID0gMDsgaiA8IDI7IGogKz0gMSkge1xuICAgICAgICAgICAgY2FyZEFyci5wdXNoKGkgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vRmlzaGVyIHlhdGVzIHNodWZmbGUgZnVuY3Rpb25cbiAgICBmdW5jdGlvbiBzaHVmZmxlKGNhcmRBcnIpIHtcbiAgICAgICAgdmFyIG0gPSBjYXJkQXJyLmxlbmd0aDtcbiAgICAgICAgdmFyIHQ7XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxl4oCmXG4gICAgICAgIHdoaWxlIChtKSB7XG5cbiAgICAgICAgICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudOKAplxuICAgICAgICAgICAgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtIC09IDEpKTtcblxuICAgICAgICAgICAgLy8gQW5kIHN3YXAgaXQgd2l0aCB0aGUgY3VycmVudCBlbGVtZW50LlxuICAgICAgICAgICAgdCA9IGNhcmRBcnJbbV07XG4gICAgICAgICAgICBjYXJkQXJyW21dID0gY2FyZEFycltpXTtcbiAgICAgICAgICAgIGNhcmRBcnJbaV0gPSB0O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNhcmRBcnI7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbmV3Q291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJhbmRvbUFuZFNldCgpIHtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgd2luZG93Q291bnQgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB3aW5kb3dDb3VudCArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9TZWxlY3RzIGFsbCB0aGUgY2FyZHNcbiAgICAgICAgdmFyIGNhcmRzSW5XaW5kb3dzID0gd2luZG93c1t3aW5kb3dDb3VudCAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcblxuICAgICAgICAvL0ZvciBlYSB2YWx1ZSBpbiBhcnJheSBhZGRzIGNhcmQgbnVtYmVyIHRvIGNsYXNzLlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgMTY7IGkgKz0gMSkge1xuICAgICAgICAgICAgbmV3TnVtYmVyID0gc2h1ZmZsZShjYXJkQXJyKS5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgICAgICBjYXJkc0luV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKG5ld051bWJlcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJhbmRvbUFuZFNldCgpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMucnVuID0gY2FyZFJhbmRvbWl6ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBHYW1lbG9naWMgKElzIGl0IHBhaXI/IFdoYXQgaWYgaXQgaXNuJ3Q/IENhbiB0aGUgdXNlciBwcmVzcz8gRXRjLilcbiAqL1xuZnVuY3Rpb24gY2hlY2tQYWlyKCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuICAgIHZhciB0YXJnZXRBcnIgPSBbXTtcbiAgICB2YXIgc2F2ZVRhcmdldCA9IFtdO1xuICAgIHZhciBjbGlja3MgPSAwO1xuICAgIHZhciB0cmllcyA9IDA7XG4gICAgdmFyIHBhaXJDb3VudGVyID0gMDtcbiAgICB2YXIgd2luQ2hlY2sgPSByZXF1aXJlKFwiLi93aW5DaGVja1wiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBjYXJkc0luV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gICAgdmFyIGNvdW50ZXJJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcblxuICAgIGZ1bmN0aW9uIG91dGJyZWFrKHdoaWNoRWxlbWVudCkge1xuICAgICAgICBuZXdBcnIucHVzaCh3aGljaEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICBzYXZlVGFyZ2V0LnB1c2god2hpY2hFbGVtZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblBhaXIoKSB7XG4gICAgICAgIHNhdmVUYXJnZXRbMF0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xuICAgICAgICBzYXZlVGFyZ2V0WzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcbiAgICAgICAgc2F2ZVRhcmdldFswXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgIHNhdmVUYXJnZXRbMF0uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICBjbGlja3MgPSAwO1xuICAgICAgICBwYWlyQ291bnRlciArPSAxO1xuICAgICAgICBpZiAocGFpckNvdW50ZXIgPj0gOCkge1xuICAgICAgICAgICAgd2luQ2hlY2sud2luKGNvdW50ZXJJbldpbmRvdyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBub3RQYWlyKHRoZVRoZW1lKSB7XG5cbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuXG4gICAgICAgICAgICAvLyB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgdGhlVGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIHRoZVRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpY2tzID0gMDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoZWood2hpY2hFbGVtZW50LCBjdXJyZW50VGhlbWUpIHtcbiAgICAgICAgaWYgKHRhcmdldEFyclswXSAhPT0gdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICBpZiAobmV3QXJyLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICBvdXRicmVhayh3aGljaEVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgIGlmICh0YXJnZXRBcnJbMF0gJiYgdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dGJyZWFrKHdoaWNoRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5ld0Fyci5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIG5ld0Fyci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBvdXRicmVhayh3aGljaEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV3QXJyWzBdICYmIG5ld0FyclsxXSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG9uUGFpciwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vdFBhaXIoY3VycmVudFRoZW1lKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tFbnRlcihzZWxlY3Rpb24sIGV2ZW50KSB7XG4gICAgICAgIHNlbGVjdGlvbi5jbGljaygpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxpc3RlbmVyKHdoaWNoRWxlbWVudCkge1xuXG4gICAgICAgIGlmIChjbGlja3MgPCAyKSB7XG5cbiAgICAgICAgICAgIGNsaWNrcyArPSAxO1xuXG4gICAgICAgICAgICB0cmllcyArPSAxO1xuXG4gICAgICAgICAgICB2YXIgZ2V0V2luZG93ID0gd2hpY2hFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICB2YXIgY3VycmVudFRoZW1lID0gZ2V0V2luZG93LmdldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIik7XG5cbiAgICAgICAgICAgIHdoaWNoRWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi9cIiArIHdoaWNoRWxlbWVudC5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSArIFwiLnBuZycpXCI7XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyci5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyLnB1c2god2hpY2hFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyclswXSA9PT0gdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyID0gdGFyZ2V0QXJyLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgICAgICBjbGlja3MgPSBjbGlja3MgLT0gMTtcbiAgICAgICAgICAgICAgICB0cmllcyA9IHRyaWVzIC09IDE7XG4gICAgICAgICAgICAgICAgcGFpckNvdW50ZXIgPSBwYWlyQ291bnRlciAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3VudGVySW5XaW5kb3cudGV4dENvbnRlbnQgPSB0cmllcztcblxuICAgICAgICAgICAgaGVqKHdoaWNoRWxlbWVudCwgY3VycmVudFRoZW1lKTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlDbGlja3MoaSwgZXZlbnQpIHtcbiAgICAgICAgY2FyZHNJbldpbmRvd1tpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGNoZWNrRW50ZXIodGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMsIGV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzSW5XaW5kb3cubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYXBwbHlDbGlja3MoaSwgZXZlbnQpO1xuICAgIH1cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrUGFpcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnkoKSB7XG5cbiAgICAvL0dldHMgdGVtcGxhdGVcbiAgICB2YXIgbG9hZGluZ0NhcmRzID0gcmVxdWlyZShcIi4vbG9hZGluZ0NhcmRzXCIpO1xuICAgIGxvYWRpbmdDYXJkcy5sb2FkKCk7XG5cbiAgICAvL0ltcGxlbWVudHMgdGhlIHRoZW1lIGNoYW5nZXJcbiAgICB2YXIgdGhlbWVDaGFuZ2VyID0gcmVxdWlyZShcIi4vdGhlbWVDaGFuZ2VyXCIpO1xuICAgIHRoZW1lQ2hhbmdlci5jaGFuZ2UoKTtcblxuICAgIC8vR2l2ZXMgY2FyZCBpbWcgZGVwZW5kaW5nIG9uIGNsYXNzIHZhbHVlXG4gICAgdmFyIHNldENhcmRzID0gcmVxdWlyZShcIi4vc2V0Q2FyZHNcIik7XG4gICAgc2V0Q2FyZHMuc2V0KCk7XG5cbiAgICAvL1JhbmRvbWl6aW5nIGNhcmRzXG4gICAgdmFyIGNhcmRSYW5kb21pemVyID0gcmVxdWlyZShcIi4vY2FyZFJhbmRvbWl6ZXJcIik7XG4gICAgY2FyZFJhbmRvbWl6ZXIucnVuKCk7XG5cbiAgICAvL1RoZSBnYW1lIGxvZ2ljLlxuICAgIHZhciBjaGVja1BhaXIgPSByZXF1aXJlKFwiLi9jaGVja1BhaXJcIik7XG4gICAgY2hlY2tQYWlyLmNoZWNrKCk7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlTWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEdldHMgdGhlIG1lbW9yeSB0ZW1wbGF0ZVxuICovXG5mdW5jdGlvbiBsb2FkaW5nQ2FyZHMoKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5LXRlbXBsYXRlXCIpO1xuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNsaWNrQ291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2xpY2tDb3VudGVyXCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIGNsaWNrQ291bnRlcltjb3VudGVyIC0gMV0pO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRpbmdDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEdldHMgdGhlbWVcbiAqIEdpdmVzIGVsZW1lbnQgYXBwcm9wcmlhdGUgYW5kIG1hdGNoaW5nIGltYWdlcyB0aGF0IHJlcHJlc2VudHMgY2FyZHMuXG4gKi9cbmZ1bmN0aW9uIHNldENhcmRzKCkge1xuICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcbiAgICB2YXIgbWVtV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGFzdFRoZW1lID0gXCJcIjtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBtZW1XaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBsYXN0VGhlbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIC8vSWYgdGhlcmUncyBubyBpbWFnZSAtIHNldCB0aGUgaW1hZ2VzIHdpdGggdGhlIGxhc3QgdXNlZCB0aGVtZS5cbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhcmRzW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1pbWFnZVwiKSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xuICAgICAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGxhc3RUaGVtZSArIFwiLzAucG5nJylcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3Mgbm8gdGhlbWUsIHRoZW4gdXNlIHRoZSBwbGFpbiB0aGVtZS5cbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIGl0IGF2YWlsYWJsZSBmb3IgdGhlIHVzZXIgdG8gY2hhbmdlIHRoZSB0aGVtZSBvZiB0aGUgbWVtb3J5LlxuICovXG5mdW5jdGlvbiB0aGVtZUNoYW5nZXIoKSB7XG4gICAgdmFyIGhhc0NhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50aGVtZS1zZWxlY3RvclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhhc0NhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICAvL1NlbGVjdCBhbGwgY2FyZHMuXG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKVtjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuXG4gICAgLy9DaGVjayBhbmQgZ2V0IChpZikgdGhlbWVcbiAgICBmdW5jdGlvbiB3aGF0Q2FyZHMoY29sb3IpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIGNvbG9yKTtcblxuICAgICAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIGNvbG9yKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGNvbG9yICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwicGxhaW5cIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwicmVkXCIpO1xuICAgIH0pO1xuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVsyXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoYXRDYXJkcyhcImJsdWVcIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzNdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwiZ3JlZW5cIik7XG4gICAgfSk7XG5cbiAgICB2YXIgdGhlbWVCdXR0b24gPSBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIGZ1bmN0aW9uIGJyaW5nVGhlbWUoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnRvZ2dsZShcInRoZW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnRvZ2dsZShcImNhcmQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgIH1cblxuICAgIHRoZW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBicmluZ1RoZW1lKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IHRoZW1lQ2hhbmdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEFkZHMgYSB3aW5uaW5nIG1lc3NhZ2UgdG8gdGhlIHRoZSBzcGVjaWZpYyB3aW5kb3cgKEN1cnJlbnQgd2luZG93KS5cbiAqIEBwYXJhbSBjdXJyZW50V2luZG93XG4gKi9cbmZ1bmN0aW9uIHdpbkNoZWNrKGN1cnJlbnRXaW5kb3cpIHtcbiAgICB2YXIgeW91V2luID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJZT1UgV0lOIVwiKTtcbiAgICB2YXIgYnJlYWtpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlJcIik7XG4gICAgdmFyIHB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICBwdGFnLmFwcGVuZENoaWxkKHlvdVdpbik7XG4gICAgcHRhZy5jbGFzc0xpc3QuYWRkKFwid2lubmluZy1tZXNzYWdlXCIpO1xuICAgIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQoYnJlYWtpbmcpO1xuICAgIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQocHRhZyk7XG4gICAgY3VycmVudFdpbmRvdy5jbGFzc0xpc3QuYWRkKFwicHJlc2VudC1jbGlja1wiKTtcbn1cblxuLy9PZmYgdG8gY2hlY2tQYWlyXG5tb2R1bGUuZXhwb3J0cy53aW4gPSB3aW5DaGVjaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIHRoZSB3aW5kb3cgZHJhZ2dhYmxlLlxuICovXG5mdW5jdGlvbiBtb3ZhYmxlKCkge1xuXG4gICAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblxuICAgICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRXaW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy9EZWNsYXJlcyB2YXJpYWJsZXMgdXNlZCBmb3IgbG9jYXRpbmcgcG9pbnRlci5cbiAgICB2YXIgYVZhclkgPSAwO1xuICAgIHZhciBhVmFyWCA9IDA7XG4gICAgdmFyIHNhdmVUYXJnZXQgPSAwO1xuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHRhcmdldCBoYXMgdGhlIGNsYXNzbmFtZSBcInRvcFwiLlxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5zbGljZSgwLCAzKSA9PT0gXCJ0b3BcIikge1xuXG4gICAgICAgICAgICAvL1NhdmVzIHRoZSBjdXJyZW50IGNvcmRzIC0gYW5kIHRoZSBjdXJyZW50IHRhcmdldC5cbiAgICAgICAgICAgIGFWYXJZID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgICAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcblxuICAgICAgICAgICAgLy9HaXZlcyB0aGUgY3VycmVudCB0YXJnZXQgYSAncHJldHR5JyBhbmQgcHJhY3RpY2FsIG9wYWNpdHkuXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDAuODU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuXG4gICAgICAgIC8vU2V0cyB0aGUgb3BhY2l0eSB0byAxIHdoZW4gdGhlIHVzZXIgZHJvcHMgdGhlIHdpbmRvdy5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmaW5kV2luZG93c1tpXS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGl2TW92ZShldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB3aW5kb3cgc2hvdWxkIG1vdmUgLSBzZXRzIGJvdW5kaW5nLWJveCAoZm9yIGJvdGggeCBhbmQgeSkuXG4gICAgICAgIGlmIChldmVudC55IC0gYVZhclkgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC55IC0gYVZhclkpO1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQueSAtIGFWYXJZID4gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUpIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAqIDAuNSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBldmVudC55IC0gYVZhclkgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQueCAtIGFWYXJYIDwgMCkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnggLSBhVmFyWCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41KSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBldmVudC54IC0gYVZhclggKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFkZExpc3RlbmVycygpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gcHJlbG9hZGluZygpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGltZzEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzggPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzkgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBpbWcxLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8wLnBuZ1wiO1xuICAgICAgICBpbWcyLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8xLnBuZ1wiO1xuICAgICAgICBpbWczLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8yLnBuZ1wiO1xuICAgICAgICBpbWc0LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8zLnBuZ1wiO1xuICAgICAgICBpbWc1LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS80LnBuZ1wiO1xuICAgICAgICBpbWc2LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS81LnBuZ1wiO1xuICAgICAgICBpbWc3LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS82LnBuZ1wiO1xuICAgICAgICBpbWc4LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS83LnBuZ1wiO1xuICAgICAgICBpbWc5LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS84LnBuZ1wiO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpbWcxMCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzEyID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE1ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE4ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaW1nMTAuc3JjID0gXCIuLi9pbWFnZS9yZWQvMC5wbmdcIjtcbiAgICAgICAgaW1nMTEuc3JjID0gXCIuLi9pbWFnZS9yZWQvMS5wbmdcIjtcbiAgICAgICAgaW1nMTIuc3JjID0gXCIuLi9pbWFnZS9yZWQvMi5wbmdcIjtcbiAgICAgICAgaW1nMTMuc3JjID0gXCIuLi9pbWFnZS9yZWQvMy5wbmdcIjtcbiAgICAgICAgaW1nMTQuc3JjID0gXCIuLi9pbWFnZS9yZWQvNC5wbmdcIjtcbiAgICAgICAgaW1nMTUuc3JjID0gXCIuLi9pbWFnZS9yZWQvNS5wbmdcIjtcbiAgICAgICAgaW1nMTYuc3JjID0gXCIuLi9pbWFnZS9yZWQvNi5wbmdcIjtcbiAgICAgICAgaW1nMTcuc3JjID0gXCIuLi9pbWFnZS9yZWQvNy5wbmdcIjtcbiAgICAgICAgaW1nMTguc3JjID0gXCIuLi9pbWFnZS9yZWQvOC5wbmdcIjtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaW1nMTkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIzID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHZhciBpbWcyOCA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGltZzE5LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMC5wbmdcIjtcbiAgICAgICAgaW1nMjAuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8xLnBuZ1wiO1xuICAgICAgICBpbWcyMS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzIucG5nXCI7XG4gICAgICAgIGltZzIyLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMy5wbmdcIjtcbiAgICAgICAgaW1nMjMuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi80LnBuZ1wiO1xuICAgICAgICBpbWcyNC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzUucG5nXCI7XG4gICAgICAgIGltZzI1LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNi5wbmdcIjtcbiAgICAgICAgaW1nMjYuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi83LnBuZ1wiO1xuICAgICAgICBpbWcyNy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzgucG5nXCI7XG5cbiAgICAgICAgaW1nMjguc3JjID0gXCIuLi9pbWFnZS9pY29ucy9jb2dncmV5LnBuZ1wiO1xuXG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gYXBwXG5tb2R1bGUuZXhwb3J0cy5sb2FkaW5nID0gcHJlbG9hZGluZztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYWxsIHdpbmRvd3MgcmVhZHkgZm9yIHVzZS5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyV2luZG93KCkge1xuXG4gICAgdmFyIG1vdmFibGUgPSByZXF1aXJlKFwiLi9tb3ZhYmxlXCIpO1xuICAgIHZhciB3aW5kb3dEZXN0cm95ZXIgPSByZXF1aXJlKFwiLi93aW5kb3dEZXN0cm95ZXJcIik7XG4gICAgdmFyIGNyZWF0ZU1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeS9jcmVhdGVNZW1vcnlcIik7XG4gICAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jaGF0L2NyZWF0ZUNoYXRcIik7XG4gICAgdmFyIGNvbG9yU2NoZW1lZXIgPSByZXF1aXJlKFwiLi9jb2xvclNjaGVtZWVyL2NvbG9yU2NoZW1lZXJcIik7XG4gICAgdmFyIHdpbmRvd1BsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3dpbmRvd1BsYWNlbWVudFwiKTtcbiAgICB2YXIgc2V0WiA9IHJlcXVpcmUoXCIuL3NldFpcIik7XG5cbiAgICAvL0NoZWNrcyBpZiB3aGljaCBuYXYtYnV0dG9uIGlzIGJlaW5nIHByZXNzZWQuXG4gICAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XG4gICAgICAgIHZhciBmaW5kTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pY29uMVwiKTtcblxuICAgICAgICBmdW5jdGlvbiBjaGVja05hdihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMV0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXJNZW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzJdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyU2NoZW1lZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tOYXYpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5hdkNsaWNrKCk7XG5cbiAgICAvL0NyZWF0ZXMgY2hhdCBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcbiAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgY2hhdC1wYXJ0LCBtb3ZhYmxlLXdpbmRvdywgei1pbmRleCwgYWJsZSB0byBkZXN0cm95IHdpbmRvdy5cbiAgICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICAgIGNyZWF0ZUNoYXQuY2hhdCgpO1xuICAgICAgICBtb3ZhYmxlLm1vdmUoKTtcbiAgICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcblxuICAgIH1cblxuICAgIC8vQ3JlYXRlIG1lbW9yeVxuICAgIGZ1bmN0aW9uIHJlbmRlck1lbSgpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgY3JlYXRlLW1lbW9yeSwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgIGNyZWF0ZU1lbW9yeS5jcmVhdGUoKTtcbiAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG4gIH1cblxuICAgIC8vQ3JlYXRlcyBTY2hlbWVlIChUaGlyZCAnYXBwJylcbiAgICBmdW5jdGlvbiByZW5kZXJTY2hlbWVlKCkge1xuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY2hlbWVlLXRlbXBsYXRlXCIpO1xuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgc2NoZW1lZXItaW5pdCwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgIGNvbG9yU2NoZW1lZXIuaW5pdGlhbGl6ZSgpO1xuICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICBzZXRaLnNldCgpO1xuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcbiAgfVxuXG59XG5cbi8vT2ZmIHRvIGFwcFxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNldFooKSB7XG4gICAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuXG4gICAgZnVuY3Rpb24gaGlnZXN0Wih0aGVXaW5kb3dzLCBuYXZpbmcpIHtcblxuICAgICAgICB2YXIgZ2xhc3NTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoZVdpbmRvd3MpO1xuICAgICAgICB2YXIgaGlnaGVzdCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbGFzc1NxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgLy9DaGVja3MgYWxsIHRoZSB3aW5kb3dzIGZvciB6LWluZGV4XG4gICAgICAgICAgICB2YXIgemluZGV4ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2xhc3NTcXVhcmVbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJ6LWluZGV4XCIpO1xuICAgICAgICAgICAgaWYgKCh6aW5kZXggIT09IFwiYXV0b1wiKSkge1xuXG4gICAgICAgICAgICAgICAgLy9JZiBpdCdzIHRoZSBuYXYgLSB0aGVuIGFkZCAyMDAgdG8gdGhlIHotaW5kZXgsIGVsc2UganVzdCBvbmUgZm9yIG5vcm1hbCB3aW5kb3dzLlxuICAgICAgICAgICAgICAgIGlmIChuYXZpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAyMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAxO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUHVzaCB2YWx1ZXMgaW50byBhcnJheVxuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaChoaWdoZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1NvcnQgYXJyYXlcbiAgICAgICAgbmV3QXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIgLSBhO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL0lmIHRoZSBoaWdoZXN0IGluIGFycmF5IGlzbid0IHVuZGVmaW5lZCwgcmV0dXJuIHRoYXQgdmFsdWUsIGVsc2UgcmV0dXJuIG5vcm1hbCBoaWdoZXN0LlxuICAgICAgICBpZiAobmV3QXJyWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXdBcnJbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGlnaGVzdDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy9XaGVuIHJ1biwgZ2V0IHRoZSBoaWdoZXN0IHotaW5kZXggYW5kIHNldCB0aGF0IHRvIHRoZSBuYXZiYXJcbiAgICBuYXYuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgdHJ1ZSkpO1xuXG4gICAgZnVuY3Rpb24gc2V0dGluZ05lKCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL0luIG9yZGVyIGZvciBuYXYgdG8gZ2V0IHRoZSBoaWdoZXN0IHotaW5kZXgsIGdpdmUgdGhlIHdpbmRvd3Mgei1pbmRleCBvbiBpbml0LlxuICAgICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiKSk7XG5cbiAgICAgICAgLy9XaGVuIGNsaWNraW5nIGEgd2luZG93LCBjaGVjayB0aGUgaGlnaGVzdCB6LWluZGV4IGFuZCBhZGQgdGhhdCB0byB0aGF0IHNwZWNpZmljIHdpbmRvdy5cbiAgICAgICAgd2luZG93c1tjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgZmFsc2UpKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHNldHRpbmdOZSgpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvdyArIHdpbmRvd1BsYWNlbWVudFxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0WjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqTGV0J3MgdGhlIG5hdmJhciBhcHBlYXIgb24gbG9hZCAoR2l2ZXMgYSB2aXN1YWxseSBwbGVhc2luZyBlZmZlY3QpLlxuICovXG5mdW5jdGlvbiB0YXNrYmFyKCkge1xuICAgIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5icmluZ0ZvcnRoID0gdGFza2JhcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIHRoZSB3aW5kb3dzIHJlbW92YWJsZS5cbiAqL1xuZnVuY3Rpb24gd2luZG93RGVzdHJveWVyKCkge1xuICAgIHZhciBmaW5kRXhpdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZXhpdFwiKTtcbiAgICB2YXIgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuXG4gICAgZnVuY3Rpb24gcmVtb3ZpbmcoZXZlbnQpIHtcblxuICAgICAgICAvL0NoZWNrcyBzcGVjaWZpY2FsbHkgZm9yIHRoZSBmYWN0IHRoYXQgd2UncmUgbm90IHRyeWluZyB0byByZW1vdmUgdGhlIGJvZHkuXG4gICAgICAgIGlmIChldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IGJvZHkpIHtcblxuICAgICAgICAgICAgLy9UaGVuIHJlbW92ZXMuXG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRFeGl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGZpbmRFeGl0W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByZW1vdmluZyk7XG4gICAgfVxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmRlc3Ryb3kgPSB3aW5kb3dEZXN0cm95ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG5ld0NvdW50ZXIgPSAwO1xudmFyIGhlaWdodCA9IDA7XG52YXIgd2lkdGggPSAwO1xudmFyIGNvdW50aW5nID0gMDtcblxuLyoqXG4gKiBXaGVyZSB0aGUgd2luZG93IHNob3VsZCBiZSBwbGFjZWQgb24gbG9hZC5cbiAqL1xuZnVuY3Rpb24gd2luZG93UGxhY2VtZW50KCkge1xuXG4gICAgZnVuY3Rpb24gd2hlcmVUb1BsYWNlKCkge1xuICAgICAgICB2YXIgZmluZEFsbFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgaSA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRBbGxXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2V0WiA9IHJlcXVpcmUoXCIuL3NldFpcIik7XG4gICAgICAgIHNldFouc2V0KCk7XG5cbiAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyAzMCAqIG5ld0NvdW50ZXIgKyBcInB4XCI7XG4gICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcblxuICAgICAgICBoZWlnaHQgKz0gMzA7XG4gICAgICAgIHdpZHRoICs9IDMwO1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB3aW5kb3dzIGFyZSB0b28gY2xvc2UgdG8gdGhlIGJvdHRvbSBvZiB0aGUgc2NyZWVuLlxuICAgICAgICBpZiAoKHdpZHRoKSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDUwMCkge1xuICAgICAgICAgICAgbmV3Q291bnRlciA9IDA7XG4gICAgICAgICAgICB3aWR0aCA9IDMwO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIGhlaWdodCArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgd2luZG93cyBhcmUgdG9vIGNsb3NlIHRvIHRoZSByaWdodCBib3JkZXIgb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgaWYgKChoZWlnaHQpID4gd2luZG93LmlubmVyV2lkdGggLSA0NTApIHtcbiAgICAgICAgICAgIGNvdW50aW5nICs9IDE7XG4gICAgICAgICAgICBoZWlnaHQgPSA1ICogY291bnRpbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB3aGVyZVRvUGxhY2UoKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLnBsYWNlID0gd2luZG93UGxhY2VtZW50O1xuIl19
