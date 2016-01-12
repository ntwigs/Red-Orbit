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

    //Open socket
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

    //Pushes cards into array.
    function checkerTool(whichElement) {
        newArr.push(whichElement.parentElement.className);
        saveTarget.push(whichElement);
    }

    //If it's a pair, do the following.
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

    //If it's not a pair, do the following.
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

    //Runs either onPair, or notPair with checkerTool.
    function isPair(whichElement, currentTheme) {
        if (targetArr[0] !== targetArr[1]) {
            if (newArr.length < 1) {
                checkerTool(whichElement);
            } else if (newArr.length < 2) {
                if (targetArr[0] && targetArr[1]) {
                    checkerTool(whichElement);

                }
            } else if (newArr.length >= 2) {
                newArr.length = 0;
                saveTarget.length = 0;
                checkerTool(whichElement);
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

    //Click with enter.
    function checkEnter(selection, event) {
        selection.click();
        event.preventDefault();
    }

    //Game logic init.
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

            isPair(whichElement, currentTheme);

        }
    }

    //Check if pressing with enter.
    function applyClicks(i, event) {
        cardsInWindow[i].addEventListener("keypress", function(event) {
            if (event.keyCode === 13) {
                checkEnter(this, event);
            }
        });

        //Check if clicked.
        cardsInWindow[i].addEventListener("click", function() {
            listener(this, event);
        });
    }

    //Apply the events to the cards.
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

//Off to renderWindow
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

//Off to app
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vSW5pdCB3aW5kb3dzXG52YXIgcmVuZGVyV2luZG93ID0gcmVxdWlyZShcIi4vcmVuZGVyV2luZG93XCIpO1xucmVuZGVyV2luZG93LnJlbmRlcigpO1xuXG4vL0luaXQgdGFza2JhclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xudGFza2Jhci5icmluZ0ZvcnRoKCk7XG5cbi8vUHJlbG9hZCBpbWFnZXNcbnZhciBwcmVsb2FkaW5nID0gcmVxdWlyZShcIi4vcHJlbG9hZGluZ1wiKTtcbnByZWxvYWRpbmcubG9hZGluZygpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNoYXRTZXR0aW5ncygpIHtcbiAgICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaWNrLWNoYW5nZXJcIik7XG4gICAgdmFyIG5pY2tpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XG4gICAgdmFyIGsgPSAwO1xuICAgIHZhciBqID0gMDtcblxuICAgIGZvciAoaiA9IDA7IGogPCBjaGFuZ2VCdXR0b24ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgayArPSAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRBbmRTZXQoZXZlbnQpIHtcblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgY2hlY2tOaWNrIGhhcyB0cmlnZ2VyZWQgKG5hbWUtZmllbGQtZ29uZSlcbiAgICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwibmljay1jb2ctcm90YXRlXCIpO1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnJlbW92ZShcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNoYW5nZUJ1dHRvbltrIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZpbmRBbmRTZXQpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZUNoYXRcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IGNoYXRTZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGVja05pY2soKSB7XG5cbiAgICB2YXIgbmlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrID0gMDtcbiAgICB2YXIgbmlja25hbWUgPSBcIlwiO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG5pY2tJbnB1dC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBrICs9IDE7XG4gICAgfVxuXG4gICAgLy9DaGVjayBpZiB0aGVyZSBpcyBhIG5pY2tuYW1lIGluIGxvY2Fsc3RvcmFnZVxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XG5cbiAgICAgICAgLy9HZXQgbmljayBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgbmlja25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xuICAgICAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvL0Vsc2UgZGlzcGxheSBuaWNrIGJveC5cbiAgICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgIH1cblxufVxuXG4vL09mZiB0byBjcmVhdGVDaGF0XG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrTmljaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xuXG4gICAgdmFyIGZpbmRTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1Ym1pdFwiKTtcbiAgICB2YXIgZmluZFRleHRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LW1lc3NcIik7XG4gICAgdmFyIGZpbmROaWNrU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY2NlcHQtbmFtZVwiKTtcbiAgICB2YXIgZmluZE5pY2tBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xuICAgIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xuICAgIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY2hlY2tOaWNrID0gcmVxdWlyZShcIi4vY2hlY2tOaWNrXCIpO1xuICAgIHZhciBjaGF0U2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jaGF0U2V0dGluZ3NcIik7XG4gICAgdmFyIG5vUmVwZWF0Q291bnRlciA9IDA7XG5cbiAgICAvL0NyZWF0ZXMgbmV3IHNvY2tldFxuICAgIHZhciBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIiwgXCJjaGF0dGV4dFwiKTtcblxuICAgIC8vQ2hlY2sgZm9yIGNoYXQgc2V0dGluZ3NcbiAgICBjaGF0U2V0dGluZ3MuY2hhbmdlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY2hlY2tOaWNrLmNoZWNrKCk7XG4gICAgICAgIG5vUmVwZWF0Q291bnRlciArPSAxO1xuICAgIH1cblxuICAgIC8vR29lcyBhaGVhZCBhbmQgc2V0IGEgdXNlcm5hbWUgd2l0aCB0aGUgaGVscCBmcm9tIHRoZSBuaWNrIGNoYW5nZXIuXG4gICAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAqSGlkZSBhZnRlciB1c2UgLSBzZW5kIHRvIGxvY2FsIHN0b3JhZ2UgIC0+ICpJc2hcbiAgICAgICAgaWYgKGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZGF0YS51c2VybmFtZSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmlja25hbWVcIiwgZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlKTtcbiAgICAgICAgICAgIGZpbmROYW1lRmllbGRbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIHRleHRDb250YWluZXJbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL0NoZWNrcyBpZiBldmVyeXRoaW5nIG5lY2Vzc2FyeSBpcyB0aGVyZSBmb3IgYSBtZXNzYWdlLlxuICAgIGZpbmRTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLm5pY2tuYW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBkYXRhLnVzZXJuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKTtcbiAgICAgICAgICAgIGRhdGEuZGF0YSA9IGZpbmRUZXh0QXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9UaGUga2V5cyBhbmQgdmFsdWVzIG5lZWRlZCBmb3IgYSBtZXNzYWdlLlxuICAgIHZhciBkYXRhID0ge1xuICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZGF0YTogXCJcIixcbiAgICAgICAgdXNlcm5hbWU6IFwiXCIsXG4gICAgICAgIGNoYW5uZWw6IFwiXCIsXG4gICAgICAgIGtleTogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiLFxuICAgICAgICBkaWRVc2VyU2VuZDogXCJ1c2VyU2VudFwiXG4gICAgfTtcblxuICAgIC8vT3BlbiBzb2NrZXRcbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrcyBhZ2FpbiBmb3Igbmljay5cbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIiAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBTZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vRW5hYmxlIG9uIGVudGVyIHByZXNzIHNlbmRpbmcuXG4gICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5jbGljaygpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL1doZW4gc2VudCwgcmVuZGVyIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHVzZXIgdGV4dCB3aW5kb3cuXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICB2YXIgcFRhZ01lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdmFyIGRpdlRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICB2YXIgaXNNZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGlkVXNlclNlbmQ7XG4gICAgICAgIHZhciBjaGF0RGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGF0YTtcbiAgICAgICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcbiAgICAgICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XG4gICAgICAgIHZhciBjcmVhdGVVc2VyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdFVzZXIpO1xuICAgICAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcbiAgICAgICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XG4gICAgICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ1VzZXIpO1xuICAgICAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChjaGF0VXNlciAhPT0gbnVsbCAmJiBjaGF0RGF0YSAhPT0gdW5kZWZpbmVkICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIGl0IHdhcyBzZW50IGJ5IHRoZSB1c2VyIC0gcHV0IGl0IG9uIHRoZSB1c2VyIHNpZGUgb2YgdGhlIGNoYXQuXG4gICAgICAgICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICYmIGlzTWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkaXZUYWdUZXh0LmNsYXNzTGlzdC5hZGQoXCJ1c2VyLXNlbnRcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9BcHBlbmQgdGhlIGVsZW1lbnRzIGFib3ZlLlxuICAgICAgICAgICAgICAgIHRleHRDb250YWluZXJbaV0uYXBwZW5kQ2hpbGQoZGl2VGFnVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAvL1Njcm9sbCB0byBib3R0b20uXG4gICAgICAgICAgICAgICAgdGV4dENvbnRhaW5lcltpXS5zY3JvbGxUb3AgPSB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMuY2hhdCA9IGNyZWF0ZUNoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY29sb3JTY2hlbWVlcigpIHtcblxuICAgIC8vR2V0cyB0aGUgdGVtcGxhdGVcbiAgICB2YXIgbG9hZFNjaGVtZSA9IHJlcXVpcmUoXCIuL2xvYWRTY2hlbWVcIik7XG4gICAgbG9hZFNjaGVtZS5sb2FkKCk7XG5cbiAgICAvL0dldHMgdGhlIGlucHV0IHRhZ3MgaGV4LWNvZGVzXG4gICAgdmFyIGZldGNoQ29sb3IgPSByZXF1aXJlKFwiLi9mZXRjaENvbG9yXCIpO1xuICAgIGZldGNoQ29sb3IuZmV0Y2goKTtcblxuICAgIC8vR2V0cyBoZXgtY29kZSBhbmQgc3R5bGluZyBmb3IgdGhlIGZvbnQuXG4gICAgdmFyIHNldEZvbnRGYW1pbHkgPSByZXF1aXJlKFwiLi9zZXRGb250RmFtaWx5XCIpO1xuICAgIHNldEZvbnRGYW1pbHkuc2V0KCk7XG5cbn1cblxuLy9PZmYgdG8gcmVuZGVyV2luZG93XG5tb2R1bGUuZXhwb3J0cy5pbml0aWFsaXplID0gY29sb3JTY2hlbWVlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE9idGFpbnMgdGhlIGNvbG9ycyBmcm9tIGlucHV0IGFuZCBjaGVja3MgZm9yIGVycm9ycy5cbiAqL1xuZnVuY3Rpb24gZmV0Y2hDb2xvcigpIHtcbiAgICB2YXIgaGV4Q29udGFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3ItY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleEluLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgbmV3Q291bnRlciArPSAxO1xuXG4gICAgICAgIGhleEluW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0ID0gc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5jaGlsZHJlblswXTtcblxuICAgICAgICAgICAgICAgIC8vU2VsZWN0aW9uIGlzIHRoZSBjdXJyZW50IGlucHV0ICh0aGlzKS5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRCZyhzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gaGV4SW5bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4SW5bMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uID09PSBoZXhJblsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhJblsxXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24gPT09IGhleEluWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleEluWzJdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gaGV4SW5bM10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4SW5bM10udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDYgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3Mgc2l4IGxldHRlcnMgYW5kIG5vIGhhc2h0YWcuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzZXRCZyh0aGlzKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSA9PT0gXCIjXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3MgNiBsZXR0ZXJzICsgYSBoYXNodGFnIC0gcHJvY2VlZCBhcyBub3JtYWwuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzZXRCZyh0aGlzKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPj0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUncyA3IG9yIG1vcmUgbGV0dGVycyAoTW9yZSBzaG91bGQgYmUgaW1wb3NzaWJsZSkgLSB0aGVuIHJlbW92ZSB0aGF0IGxhc3QgYW5kIGFkZCBhIGhhc2guXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWUuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBzZXRCZyh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGVudGVyZWQgdGV4dCBpcyB2YWxpZCBoZXguXG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNykge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vU2V0cyBjb2xvcnMgb24gaW5wdXRzIGRlcGVuZGluZyBvbiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzhiMzAzMFwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OUFFMzdcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5mZXRjaCA9IGZldGNoQ29sb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gbG9hZFNjaGVtZSgpIHtcbiAgICB2YXIgZmluZFNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGVzaWduLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcE9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzaWduLW9uZVwiKTtcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBPbmUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIHZhciBzZXRQb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmVmb3JlLXRoaXNcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFNxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9BcHBlbmRzIHRoZSB0ZW1wbGF0ZVxuICAgIGZpbmRTcXVhcmVbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgc2V0UG9pbnRbY291bnRlciAtIDFdKTtcblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRGb250RmFtaWx5KCkge1xuICAgIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vdmVyLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcGxhdGVzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oZWFkZXItb25lIGlucHV0XCIpO1xuICAgIHZhciBzd2l0Y2hDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXJcIik7XG4gICAgdmFyIHN3aXRjaENvbnRhaW5lckJvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXItYm9sZFwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcblxuICAgIC8vRXhhbXBsZSB0ZXh0XG4gICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiTE9SRU0gSVBTVU1cIjtcblxuICAgIGhleEluLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgICAgICAvL0dldHMgYSAjIGluIHRoZXJlIC0gdG8gZGVjbGFyZSB0aGUgaW5wdXQgYXMgaGV4LiAtPiBBZGQgY29sb3IgdG8gdGV4dC5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxuICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XG5cbiAgICAgICAgICAgICAgICAvL1NldHMgY29sb3IgdG8gaW5wdXQgZGVwZW5kaW5nIG9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2FlMzczN1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIHNlcmlmXG4gICAgc3dpdGNoQ29udGFpbmVyW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZXJpZlwiKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIGJvbGRcbiAgICBzd2l0Y2hDb250YWluZXJCb2xkW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5jb250YWlucyhcImJvbGRcIikpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gY29sb3JTY2hlbWVlclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Rm9udEZhbWlseTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjYXJkUmFuZG9taXplcigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGNhcmRBcnIgPSBbXTtcbiAgICB2YXIgbmV3TnVtYmVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRBcnIucHVzaChpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0Zpc2hlciB5YXRlcyBzaHVmZmxlIGZ1bmN0aW9uXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShjYXJkQXJyKSB7XG4gICAgICAgIHZhciBtID0gY2FyZEFyci5sZW5ndGg7XG4gICAgICAgIHZhciB0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxuICAgICAgICB3aGlsZSAobSkge1xuXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnTigKZcbiAgICAgICAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobSAtPSAxKSk7XG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHQgPSBjYXJkQXJyW21dO1xuICAgICAgICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XG4gICAgICAgICAgICBjYXJkQXJyW2ldID0gdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYXJkQXJyO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG5ld0NvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5kb21BbmRTZXQoKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdmFyIHdpbmRvd0NvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgd2luZG93Q291bnQgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0cyBhbGwgdGhlIGNhcmRzXG4gICAgICAgIHZhciBjYXJkc0luV2luZG93cyA9IHdpbmRvd3Nbd2luZG93Q291bnQgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG5cbiAgICAgICAgLy9Gb3IgZWEgdmFsdWUgaW4gYXJyYXkgYWRkcyBjYXJkIG51bWJlciB0byBjbGFzcy5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICAgIG5ld051bWJlciA9IHNodWZmbGUoY2FyZEFycikuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgY2FyZHNJbldpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChuZXdOdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByYW5kb21BbmRTZXQoKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLnJ1biA9IGNhcmRSYW5kb21pemVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogR2FtZWxvZ2ljIChJcyBpdCBwYWlyPyBXaGF0IGlmIGl0IGlzbid0PyBDYW4gdGhlIHVzZXIgcHJlc3M/IEV0Yy4pXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUGFpcigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBuZXdBcnIgPSBbXTtcbiAgICB2YXIgdGFyZ2V0QXJyID0gW107XG4gICAgdmFyIHNhdmVUYXJnZXQgPSBbXTtcbiAgICB2YXIgY2xpY2tzID0gMDtcbiAgICB2YXIgdHJpZXMgPSAwO1xuICAgIHZhciBwYWlyQ291bnRlciA9IDA7XG4gICAgdmFyIHdpbkNoZWNrID0gcmVxdWlyZShcIi4vd2luQ2hlY2tcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZHNJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICAgIHZhciBjb3VudGVySW5XaW5kb3cgPSBjb250YWluZXJbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XG5cbiAgICAvL1B1c2hlcyBjYXJkcyBpbnRvIGFycmF5LlxuICAgIGZ1bmN0aW9uIGNoZWNrZXJUb29sKHdoaWNoRWxlbWVudCkge1xuICAgICAgICBuZXdBcnIucHVzaCh3aGljaEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICBzYXZlVGFyZ2V0LnB1c2god2hpY2hFbGVtZW50KTtcbiAgICB9XG5cbiAgICAvL0lmIGl0J3MgYSBwYWlyLCBkbyB0aGUgZm9sbG93aW5nLlxuICAgIGZ1bmN0aW9uIG9uUGFpcigpIHtcbiAgICAgICAgc2F2ZVRhcmdldFswXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XG4gICAgICAgIHNhdmVUYXJnZXRbMV0uY2xhc3NMaXN0LmFkZChcImFQYWlyXCIpO1xuICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgc2F2ZVRhcmdldFswXS5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBcIjBcIik7XG4gICAgICAgIGNsaWNrcyA9IDA7XG4gICAgICAgIHBhaXJDb3VudGVyICs9IDE7XG4gICAgICAgIGlmIChwYWlyQ291bnRlciA+PSA4KSB7XG4gICAgICAgICAgICB3aW5DaGVjay53aW4oY291bnRlckluV2luZG93KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vSWYgaXQncyBub3QgYSBwYWlyLCBkbyB0aGUgZm9sbG93aW5nLlxuICAgIGZ1bmN0aW9uIG5vdFBhaXIodGhlVGhlbWUpIHtcblxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG5cbiAgICAgICAgICAgIC8vIHZhciBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xuICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyB0aGVUaGVtZSArIFwiLzAucG5nJylcIjtcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgdGhlVGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XG4gICAgICAgIH1cblxuICAgICAgICBjbGlja3MgPSAwO1xuICAgIH1cblxuICAgIC8vUnVucyBlaXRoZXIgb25QYWlyLCBvciBub3RQYWlyIHdpdGggY2hlY2tlclRvb2wuXG4gICAgZnVuY3Rpb24gaXNQYWlyKHdoaWNoRWxlbWVudCwgY3VycmVudFRoZW1lKSB7XG4gICAgICAgIGlmICh0YXJnZXRBcnJbMF0gIT09IHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgaWYgKG5ld0Fyci5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgY2hlY2tlclRvb2wod2hpY2hFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdICYmIHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICBjaGVja2VyVG9vbCh3aGljaEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICBuZXdBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgY2hlY2tlclRvb2wod2hpY2hFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld0FyclswXSAmJiBuZXdBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3QXJyWzBdID09PSBuZXdBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChvblBhaXIsIDEwMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RQYWlyKGN1cnJlbnRUaGVtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vQ2xpY2sgd2l0aCBlbnRlci5cbiAgICBmdW5jdGlvbiBjaGVja0VudGVyKHNlbGVjdGlvbiwgZXZlbnQpIHtcbiAgICAgICAgc2VsZWN0aW9uLmNsaWNrKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgLy9HYW1lIGxvZ2ljIGluaXQuXG4gICAgZnVuY3Rpb24gbGlzdGVuZXIod2hpY2hFbGVtZW50KSB7XG5cbiAgICAgICAgaWYgKGNsaWNrcyA8IDIpIHtcblxuICAgICAgICAgICAgY2xpY2tzICs9IDE7XG5cbiAgICAgICAgICAgIHRyaWVzICs9IDE7XG5cbiAgICAgICAgICAgIHZhciBnZXRXaW5kb3cgPSB3aGljaEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIHZhciBjdXJyZW50VGhlbWUgPSBnZXRXaW5kb3cuZ2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiKTtcblxuICAgICAgICAgICAgd2hpY2hFbGVtZW50LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiL1wiICsgd2hpY2hFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lICsgXCIucG5nJylcIjtcblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyci5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyci5sZW5ndGggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIucHVzaCh3aGljaEVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdID09PSB0YXJnZXRBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIgPSB0YXJnZXRBcnIuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgICAgIGNsaWNrcyA9IGNsaWNrcyAtPSAxO1xuICAgICAgICAgICAgICAgIHRyaWVzID0gdHJpZXMgLT0gMTtcbiAgICAgICAgICAgICAgICBwYWlyQ291bnRlciA9IHBhaXJDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvdW50ZXJJbldpbmRvdy50ZXh0Q29udGVudCA9IHRyaWVzO1xuXG4gICAgICAgICAgICBpc1BhaXIod2hpY2hFbGVtZW50LCBjdXJyZW50VGhlbWUpO1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0NoZWNrIGlmIHByZXNzaW5nIHdpdGggZW50ZXIuXG4gICAgZnVuY3Rpb24gYXBwbHlDbGlja3MoaSwgZXZlbnQpIHtcbiAgICAgICAgY2FyZHNJbldpbmRvd1tpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgICAgIGNoZWNrRW50ZXIodGhpcywgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvL0NoZWNrIGlmIGNsaWNrZWQuXG4gICAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGlzdGVuZXIodGhpcywgZXZlbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvL0FwcGx5IHRoZSBldmVudHMgdG8gdGhlIGNhcmRzLlxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkc0luV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGFwcGx5Q2xpY2tzKGksIGV2ZW50KTtcbiAgICB9XG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja1BhaXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xuXG4gICAgLy9HZXRzIHRlbXBsYXRlXG4gICAgdmFyIGxvYWRpbmdDYXJkcyA9IHJlcXVpcmUoXCIuL2xvYWRpbmdDYXJkc1wiKTtcbiAgICBsb2FkaW5nQ2FyZHMubG9hZCgpO1xuXG4gICAgLy9JbXBsZW1lbnRzIHRoZSB0aGVtZSBjaGFuZ2VyXG4gICAgdmFyIHRoZW1lQ2hhbmdlciA9IHJlcXVpcmUoXCIuL3RoZW1lQ2hhbmdlclwiKTtcbiAgICB0aGVtZUNoYW5nZXIuY2hhbmdlKCk7XG5cbiAgICAvL0dpdmVzIGNhcmQgaW1nIGRlcGVuZGluZyBvbiBjbGFzcyB2YWx1ZVxuICAgIHZhciBzZXRDYXJkcyA9IHJlcXVpcmUoXCIuL3NldENhcmRzXCIpO1xuICAgIHNldENhcmRzLnNldCgpO1xuXG4gICAgLy9SYW5kb21pemluZyBjYXJkc1xuICAgIHZhciBjYXJkUmFuZG9taXplciA9IHJlcXVpcmUoXCIuL2NhcmRSYW5kb21pemVyXCIpO1xuICAgIGNhcmRSYW5kb21pemVyLnJ1bigpO1xuXG4gICAgLy9UaGUgZ2FtZSBsb2dpYy5cbiAgICB2YXIgY2hlY2tQYWlyID0gcmVxdWlyZShcIi4vY2hlY2tQYWlyXCIpO1xuICAgIGNoZWNrUGFpci5jaGVjaygpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMuY3JlYXRlID0gY3JlYXRlTWVtb3J5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4vKipcbiAqIEdldHMgdGhlIG1lbW9yeSB0ZW1wbGF0ZVxuICovXG5mdW5jdGlvbiBsb2FkaW5nQ2FyZHMoKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVtb3J5LXRlbXBsYXRlXCIpO1xuICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNsaWNrQ291bnRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2xpY2tDb3VudGVyXCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIGNsaWNrQ291bnRlcltjb3VudGVyIC0gMV0pO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRpbmdDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEdldHMgdGhlbWVcbiAqIEdpdmVzIGVsZW1lbnQgYXBwcm9wcmlhdGUgYW5kIG1hdGNoaW5nIGltYWdlcyB0aGF0IHJlcHJlc2VudHMgY2FyZHMuXG4gKi9cbmZ1bmN0aW9uIHNldENhcmRzKCkge1xuICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcbiAgICB2YXIgbWVtV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGFzdFRoZW1lID0gXCJcIjtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBtZW1XaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBsYXN0VGhlbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG1lbVdpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBcInBsYWluXCIpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIC8vSWYgdGhlcmUncyBubyBpbWFnZSAtIHNldCB0aGUgaW1hZ2VzIHdpdGggdGhlIGxhc3QgdXNlZCB0aGVtZS5cbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhcmRzW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiYmFja2dyb3VuZC1pbWFnZVwiKSA9PT0gXCJub25lXCIpIHtcbiAgICAgICAgICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xuICAgICAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGxhc3RUaGVtZSArIFwiLzAucG5nJylcIjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3Mgbm8gdGhlbWUsIHRoZW4gdXNlIHRoZSBwbGFpbiB0aGVtZS5cbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRDYXJkcztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIGl0IGF2YWlsYWJsZSBmb3IgdGhlIHVzZXIgdG8gY2hhbmdlIHRoZSB0aGVtZSBvZiB0aGUgbWVtb3J5LlxuICovXG5mdW5jdGlvbiB0aGVtZUNoYW5nZXIoKSB7XG4gICAgdmFyIGhhc0NhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50aGVtZS1zZWxlY3RvclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhhc0NhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICAvL1NlbGVjdCBhbGwgY2FyZHMuXG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKVtjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuXG4gICAgLy9DaGVjayBhbmQgZ2V0IChpZikgdGhlbWVcbiAgICBmdW5jdGlvbiB3aGF0Q2FyZHMoY29sb3IpIHtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInRoZW1lXCIsIGNvbG9yKTtcblxuICAgICAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIGNvbG9yKTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGNvbG9yICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwicGxhaW5cIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwicmVkXCIpO1xuICAgIH0pO1xuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVsyXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoYXRDYXJkcyhcImJsdWVcIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzNdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwiZ3JlZW5cIik7XG4gICAgfSk7XG5cbiAgICB2YXIgdGhlbWVCdXR0b24gPSBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIGZ1bmN0aW9uIGJyaW5nVGhlbWUoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmNsYXNzTGlzdC50b2dnbGUoXCJuaWNrLWNvZy1yb3RhdGVcIik7XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnRvZ2dsZShcInRoZW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnRvZ2dsZShcImNhcmQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgIH1cblxuICAgIHRoZW1lQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBicmluZ1RoZW1lKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IHRoZW1lQ2hhbmdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEFkZHMgYSB3aW5uaW5nIG1lc3NhZ2UgdG8gdGhlIHRoZSBzcGVjaWZpYyB3aW5kb3cgKEN1cnJlbnQgd2luZG93KS5cbiAqIEBwYXJhbSBjdXJyZW50V2luZG93XG4gKi9cbmZ1bmN0aW9uIHdpbkNoZWNrKGN1cnJlbnRXaW5kb3cpIHtcbiAgICB2YXIgeW91V2luID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJZT1UgV0lOIVwiKTtcbiAgICB2YXIgYnJlYWtpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiQlJcIik7XG4gICAgdmFyIHB0YWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICBwdGFnLmFwcGVuZENoaWxkKHlvdVdpbik7XG4gICAgcHRhZy5jbGFzc0xpc3QuYWRkKFwid2lubmluZy1tZXNzYWdlXCIpO1xuICAgIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQoYnJlYWtpbmcpO1xuICAgIGN1cnJlbnRXaW5kb3cuYXBwZW5kQ2hpbGQocHRhZyk7XG4gICAgY3VycmVudFdpbmRvdy5jbGFzc0xpc3QuYWRkKFwicHJlc2VudC1jbGlja1wiKTtcbn1cblxuLy9PZmYgdG8gY2hlY2tQYWlyXG5tb2R1bGUuZXhwb3J0cy53aW4gPSB3aW5DaGVjaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE1ha2VzIHRoZSB3aW5kb3cgZHJhZ2dhYmxlLlxuICovXG5mdW5jdGlvbiBtb3ZhYmxlKCkge1xuXG4gICAgdmFyIGZpbmRXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgIGZ1bmN0aW9uIGFkZExpc3RlbmVycygpIHtcblxuICAgICAgICAvL0xvb2sgZm9yIHRoZSB3aW5kb3cgYW5kIGFkZCBtb3VzZWRvd24gKyBhbmQgbW91c2V1cFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZpbmRXaW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIG1vdXNlRG93biwgZmFsc2UpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCBtb3VzZVVwLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLy9EZWNsYXJlcyB2YXJpYWJsZXMgdXNlZCBmb3IgbG9jYXRpbmcgcG9pbnRlci5cbiAgICB2YXIgYVZhclkgPSAwO1xuICAgIHZhciBhVmFyWCA9IDA7XG4gICAgdmFyIHNhdmVUYXJnZXQgPSAwO1xuXG4gICAgZnVuY3Rpb24gbW91c2VEb3duKGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHRhcmdldCBoYXMgdGhlIGNsYXNzbmFtZSBcInRvcFwiLlxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LmNsYXNzTmFtZS5zbGljZSgwLCAzKSA9PT0gXCJ0b3BcIikge1xuXG4gICAgICAgICAgICAvL1NhdmVzIHRoZSBjdXJyZW50IGNvcmRzIC0gYW5kIHRoZSBjdXJyZW50IHRhcmdldC5cbiAgICAgICAgICAgIGFWYXJZID0gZXZlbnQub2Zmc2V0WTtcbiAgICAgICAgICAgIGFWYXJYID0gZXZlbnQub2Zmc2V0WDtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcblxuICAgICAgICAgICAgLy9HaXZlcyB0aGUgY3VycmVudCB0YXJnZXQgYSAncHJldHR5JyBhbmQgcHJhY3RpY2FsIG9wYWNpdHkuXG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDAuODU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3VzZVVwKCkge1xuXG4gICAgICAgIC8vU2V0cyB0aGUgb3BhY2l0eSB0byAxIHdoZW4gdGhlIHVzZXIgZHJvcHMgdGhlIHdpbmRvdy5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmaW5kV2luZG93c1tpXS5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGl2TW92ZShldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB3aW5kb3cgc2hvdWxkIG1vdmUgLSBzZXRzIGJvdW5kaW5nLWJveCAoZm9yIGJvdGggeCBhbmQgeSkuXG4gICAgICAgIGlmIChldmVudC55IC0gYVZhclkgPCAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhldmVudC55IC0gYVZhclkpO1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IFwiMHB4XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQueSAtIGFWYXJZID4gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUpIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAqIDAuNSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBldmVudC55IC0gYVZhclkgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQueCAtIGFWYXJYIDwgMCkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnggLSBhVmFyWCA+IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41KSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoICogMC41ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSBldmVudC54IC0gYVZhclggKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGFkZExpc3RlbmVycygpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMubW92ZSA9IG1vdmFibGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gcHJlbG9hZGluZygpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGltZzEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzggPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzkgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBpbWcxLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8wLnBuZ1wiO1xuICAgICAgICBpbWcyLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8xLnBuZ1wiO1xuICAgICAgICBpbWczLnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8yLnBuZ1wiO1xuICAgICAgICBpbWc0LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS8zLnBuZ1wiO1xuICAgICAgICBpbWc1LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS80LnBuZ1wiO1xuICAgICAgICBpbWc2LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS81LnBuZ1wiO1xuICAgICAgICBpbWc3LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS82LnBuZ1wiO1xuICAgICAgICBpbWc4LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS83LnBuZ1wiO1xuICAgICAgICBpbWc5LnNyYyA9IFwiLi4vaW1hZ2UvYmx1ZS84LnBuZ1wiO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpbWcxMCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzEyID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE1ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE4ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaW1nMTAuc3JjID0gXCIuLi9pbWFnZS9yZWQvMC5wbmdcIjtcbiAgICAgICAgaW1nMTEuc3JjID0gXCIuLi9pbWFnZS9yZWQvMS5wbmdcIjtcbiAgICAgICAgaW1nMTIuc3JjID0gXCIuLi9pbWFnZS9yZWQvMi5wbmdcIjtcbiAgICAgICAgaW1nMTMuc3JjID0gXCIuLi9pbWFnZS9yZWQvMy5wbmdcIjtcbiAgICAgICAgaW1nMTQuc3JjID0gXCIuLi9pbWFnZS9yZWQvNC5wbmdcIjtcbiAgICAgICAgaW1nMTUuc3JjID0gXCIuLi9pbWFnZS9yZWQvNS5wbmdcIjtcbiAgICAgICAgaW1nMTYuc3JjID0gXCIuLi9pbWFnZS9yZWQvNi5wbmdcIjtcbiAgICAgICAgaW1nMTcuc3JjID0gXCIuLi9pbWFnZS9yZWQvNy5wbmdcIjtcbiAgICAgICAgaW1nMTguc3JjID0gXCIuLi9pbWFnZS9yZWQvOC5wbmdcIjtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaW1nMTkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIzID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNyA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIHZhciBpbWcyOCA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGltZzE5LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMC5wbmdcIjtcbiAgICAgICAgaW1nMjAuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8xLnBuZ1wiO1xuICAgICAgICBpbWcyMS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzIucG5nXCI7XG4gICAgICAgIGltZzIyLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMy5wbmdcIjtcbiAgICAgICAgaW1nMjMuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi80LnBuZ1wiO1xuICAgICAgICBpbWcyNC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzUucG5nXCI7XG4gICAgICAgIGltZzI1LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNi5wbmdcIjtcbiAgICAgICAgaW1nMjYuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi83LnBuZ1wiO1xuICAgICAgICBpbWcyNy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzgucG5nXCI7XG5cbiAgICAgICAgaW1nMjguc3JjID0gXCIuLi9pbWFnZS9pY29ucy9jb2dncmV5LnBuZ1wiO1xuXG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gYXBwXG5tb2R1bGUuZXhwb3J0cy5sb2FkaW5nID0gcHJlbG9hZGluZztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEluaXRpYWxpemUgYWxsIHdpbmRvd3MgcmVhZHkgZm9yIHVzZS5cbiAqL1xuZnVuY3Rpb24gcmVuZGVyV2luZG93KCkge1xuXG4gICAgdmFyIG1vdmFibGUgPSByZXF1aXJlKFwiLi9tb3ZhYmxlXCIpO1xuICAgIHZhciB3aW5kb3dEZXN0cm95ZXIgPSByZXF1aXJlKFwiLi93aW5kb3dEZXN0cm95ZXJcIik7XG4gICAgdmFyIGNyZWF0ZU1lbW9yeSA9IHJlcXVpcmUoXCIuL21lbW9yeS9jcmVhdGVNZW1vcnlcIik7XG4gICAgdmFyIGNyZWF0ZUNoYXQgPSByZXF1aXJlKFwiLi9jaGF0L2NyZWF0ZUNoYXRcIik7XG4gICAgdmFyIGNvbG9yU2NoZW1lZXIgPSByZXF1aXJlKFwiLi9jb2xvclNjaGVtZWVyL2NvbG9yU2NoZW1lZXJcIik7XG4gICAgdmFyIHdpbmRvd1BsYWNlbWVudCA9IHJlcXVpcmUoXCIuL3dpbmRvd1BsYWNlbWVudFwiKTtcbiAgICB2YXIgc2V0WiA9IHJlcXVpcmUoXCIuL3NldFpcIik7XG5cbiAgICAvL0NoZWNrcyBpZiB3aGljaCBuYXYtYnV0dG9uIGlzIGJlaW5nIHByZXNzZWQuXG4gICAgZnVuY3Rpb24gbmF2Q2xpY2soKSB7XG4gICAgICAgIHZhciBmaW5kTmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5pY29uMVwiKTtcblxuICAgICAgICBmdW5jdGlvbiBjaGVja05hdihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlswXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMV0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXJNZW0oKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzJdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyU2NoZW1lZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmROYXYubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAgICAgZmluZE5hdltpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgY2hlY2tOYXYpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIG5hdkNsaWNrKCk7XG5cbiAgICAvL0NyZWF0ZXMgY2hhdCBpbnN0YW5jZS5cbiAgICBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjY2hhdC10ZW1wbGF0ZVwiKTtcbiAgICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgY2hhdC1wYXJ0LCBtb3ZhYmxlLXdpbmRvdywgei1pbmRleCwgYWJsZSB0byBkZXN0cm95IHdpbmRvdy5cbiAgICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICAgIGNyZWF0ZUNoYXQuY2hhdCgpO1xuICAgICAgICBtb3ZhYmxlLm1vdmUoKTtcbiAgICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcblxuICAgIH1cblxuICAgIC8vQ3JlYXRlIG1lbW9yeVxuICAgIGZ1bmN0aW9uIHJlbmRlck1lbSgpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2luZG93LXRlbXBsYXRlXCIpO1xuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgY3JlYXRlLW1lbW9yeSwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgIGNyZWF0ZU1lbW9yeS5jcmVhdGUoKTtcbiAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG4gIH1cblxuICAgIC8vQ3JlYXRlcyBTY2hlbWVlIChUaGlyZCAnYXBwJylcbiAgICBmdW5jdGlvbiByZW5kZXJTY2hlbWVlKCkge1xuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzY2hlbWVlLXRlbXBsYXRlXCIpO1xuICAgICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAvL2luaXRpYWxpemVzIFBsYWNlbWVudCwgc2NoZW1lZXItaW5pdCwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgIGNvbG9yU2NoZW1lZXIuaW5pdGlhbGl6ZSgpO1xuICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICBzZXRaLnNldCgpO1xuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcbiAgfVxuXG59XG5cbi8vT2ZmIHRvIGFwcFxubW9kdWxlLmV4cG9ydHMucmVuZGVyID0gcmVuZGVyV2luZG93O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHNldFooKSB7XG4gICAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuXG4gICAgZnVuY3Rpb24gaGlnZXN0Wih0aGVXaW5kb3dzLCBuYXZpbmcpIHtcblxuICAgICAgICB2YXIgZ2xhc3NTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoZVdpbmRvd3MpO1xuICAgICAgICB2YXIgaGlnaGVzdCA9IDA7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBnbGFzc1NxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgLy9DaGVja3MgYWxsIHRoZSB3aW5kb3dzIGZvciB6LWluZGV4XG4gICAgICAgICAgICB2YXIgemluZGV4ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2xhc3NTcXVhcmVbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJ6LWluZGV4XCIpO1xuICAgICAgICAgICAgaWYgKCh6aW5kZXggIT09IFwiYXV0b1wiKSkge1xuXG4gICAgICAgICAgICAgICAgLy9JZiBpdCdzIHRoZSBuYXYgLSB0aGVuIGFkZCAyMDAgdG8gdGhlIHotaW5kZXgsIGVsc2UganVzdCBvbmUgZm9yIG5vcm1hbCB3aW5kb3dzLlxuICAgICAgICAgICAgICAgIGlmIChuYXZpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAyMDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaGlnaGVzdCA9IHBhcnNlSW50KHppbmRleCkgKyAxO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vUHVzaCB2YWx1ZXMgaW50byBhcnJheVxuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaChoaWdoZXN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvL1NvcnQgYXJyYXlcbiAgICAgICAgbmV3QXJyLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGIgLSBhO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL0lmIHRoZSBoaWdoZXN0IGluIGFycmF5IGlzbid0IHVuZGVmaW5lZCwgcmV0dXJuIHRoYXQgdmFsdWUsIGVsc2UgcmV0dXJuIG5vcm1hbCBoaWdoZXN0LlxuICAgICAgICBpZiAobmV3QXJyWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXdBcnJbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaGlnaGVzdDtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLy9XaGVuIHJ1biwgZ2V0IHRoZSBoaWdoZXN0IHotaW5kZXggYW5kIHNldCB0aGF0IHRvIHRoZSBuYXZiYXJcbiAgICBuYXYuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgdHJ1ZSkpO1xuXG4gICAgZnVuY3Rpb24gc2V0dGluZ05lKCkge1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL0luIG9yZGVyIGZvciBuYXYgdG8gZ2V0IHRoZSBoaWdoZXN0IHotaW5kZXgsIGdpdmUgdGhlIHdpbmRvd3Mgei1pbmRleCBvbiBpbml0LlxuICAgICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiKSk7XG5cbiAgICAgICAgLy9XaGVuIGNsaWNraW5nIGEgd2luZG93LCBjaGVjayB0aGUgaGlnaGVzdCB6LWluZGV4IGFuZCBhZGQgdGhhdCB0byB0aGF0IHNwZWNpZmljIHdpbmRvdy5cbiAgICAgICAgd2luZG93c1tjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIiwgZmFsc2UpKTtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHNldHRpbmdOZSgpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvdyArIHdpbmRvd1BsYWNlbWVudFxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0WjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqTGV0J3MgdGhlIG5hdmJhciBhcHBlYXIgb24gbG9hZCAoR2l2ZXMgYSB2aXN1YWxseSBwbGVhc2luZyBlZmZlY3QpLlxuICovXG5mdW5jdGlvbiB0YXNrYmFyKCkge1xuICAgIHZhciBmaW5kVGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBmaW5kVGFza2Jhci5jbGFzc0xpc3QuYWRkKFwidGFzay1hcHBlYXJcIik7XG4gIH0pO1xufVxuXG4vL09mZiB0byBhcHBcbm1vZHVsZS5leHBvcnRzLmJyaW5nRm9ydGggPSB0YXNrYmFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWFrZXMgdGhlIHdpbmRvd3MgcmVtb3ZhYmxlLlxuICovXG5mdW5jdGlvbiB3aW5kb3dEZXN0cm95ZXIoKSB7XG4gICAgdmFyIGZpbmRFeGl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leGl0XCIpO1xuICAgIHZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG5cbiAgICBmdW5jdGlvbiByZW1vdmluZyhldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIHNwZWNpZmljYWxseSBmb3IgdGhlIGZhY3QgdGhhdCB3ZSdyZSBub3QgdHJ5aW5nIHRvIHJlbW92ZSB0aGUgYm9keS5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gYm9keSkge1xuXG4gICAgICAgICAgICAvL1RoZW4gcmVtb3Zlcy5cbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZEV4aXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZmluZEV4aXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92aW5nKTtcbiAgICB9XG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMuZGVzdHJveSA9IHdpbmRvd0Rlc3Ryb3llcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbmV3Q291bnRlciA9IDA7XG52YXIgaGVpZ2h0ID0gMDtcbnZhciB3aWR0aCA9IDA7XG52YXIgY291bnRpbmcgPSAwO1xuXG4vKipcbiAqIFdoZXJlIHRoZSB3aW5kb3cgc2hvdWxkIGJlIHBsYWNlZCBvbiBsb2FkLlxuICovXG5mdW5jdGlvbiB3aW5kb3dQbGFjZW1lbnQoKSB7XG5cbiAgICBmdW5jdGlvbiB3aGVyZVRvUGxhY2UoKSB7XG4gICAgICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHZhciBpID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZEFsbFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZXRaID0gcmVxdWlyZShcIi4vc2V0WlwiKTtcbiAgICAgICAgc2V0Wi5zZXQoKTtcblxuICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcbiAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgMzAgKiBuZXdDb3VudGVyICsgXCJweFwiO1xuXG4gICAgICAgIGhlaWdodCArPSAzMDtcbiAgICAgICAgd2lkdGggKz0gMzA7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHdpbmRvd3MgYXJlIHRvbyBjbG9zZSB0byB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgIGlmICgod2lkdGgpID4gd2luZG93LmlubmVySGVpZ2h0IC0gNTAwKSB7XG4gICAgICAgICAgICBuZXdDb3VudGVyID0gMDtcbiAgICAgICAgICAgIHdpZHRoID0gMzA7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIGhlaWdodCArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB3aW5kb3dzIGFyZSB0b28gY2xvc2UgdG8gdGhlIHJpZ2h0IGJvcmRlciBvZiB0aGUgc2NyZWVuLlxuICAgICAgICBpZiAoKGhlaWdodCkgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDQ1MCkge1xuICAgICAgICAgICAgY291bnRpbmcgKz0gMTtcbiAgICAgICAgICAgIGhlaWdodCA9IDUgKiBjb3VudGluZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdoZXJlVG9QbGFjZSgpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMucGxhY2UgPSB3aW5kb3dQbGFjZW1lbnQ7XG4iXX0=
