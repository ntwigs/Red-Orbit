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
        if (event.keyCode === 13) {
            selection.click();
        }

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

    for (i = 0; i < cardsInWindow.length; i += 1) {
        cardsInWindow[i].addEventListener("keypress", function() {
            checkEnter(this, event);
        });
        cardsInWindow[i].addEventListener("click", function() {
            listener(this);
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vSW5pdCB3aW5kb3dzXG52YXIgcmVuZGVyV2luZG93ID0gcmVxdWlyZShcIi4vcmVuZGVyV2luZG93XCIpO1xucmVuZGVyV2luZG93LnJlbmRlcigpO1xuXG4vL0luaXQgdGFza2JhclxudmFyIHRhc2tiYXIgPSByZXF1aXJlKFwiLi90YXNrYmFyXCIpO1xudGFza2Jhci5icmluZ0ZvcnRoKCk7XG5cbi8vUHJlbG9hZCBpbWFnZXNcbnZhciBwcmVsb2FkaW5nID0gcmVxdWlyZShcIi4vcHJlbG9hZGluZ1wiKTtcbnByZWxvYWRpbmcubG9hZGluZygpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNoYXRTZXR0aW5ncygpIHtcbiAgICB2YXIgY2hhbmdlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uaWNrLWNoYW5nZXJcIik7XG4gICAgdmFyIG5pY2tpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmVudGVyLW5pY2tcIik7XG4gICAgdmFyIGsgPSAwO1xuICAgIHZhciBqID0gMDtcblxuICAgIGZvciAoaiA9IDA7IGogPCBjaGFuZ2VCdXR0b24ubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgICAgayArPSAxO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbmRBbmRTZXQoZXZlbnQpIHtcblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgY2hlY2tOaWNrIGhhcyB0cmlnZ2VyZWQgKG5hbWUtZmllbGQtZ29uZSlcbiAgICAgICAgbmlja2luZ1trIC0gMV0uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSk7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwibmljay1jb2ctcm90YXRlXCIpO1xuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJuYW1lLWZpZWxkLWdvbmVcIikpIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LnJlbW92ZShcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QuYWRkKFwidGV4dC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGNoYW5nZUJ1dHRvbltrIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZpbmRBbmRTZXQpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZUNoYXRcbm1vZHVsZS5leHBvcnRzLmNoYW5nZSA9IGNoYXRTZXR0aW5ncztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGVja05pY2soKSB7XG5cbiAgICB2YXIgbmlja0lucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrID0gMDtcbiAgICB2YXIgbmlja25hbWUgPSBcIlwiO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG5pY2tJbnB1dC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBrICs9IDE7XG4gICAgfVxuXG4gICAgLy9DaGVjayBpZiB0aGVyZSBpcyBhIG5pY2tuYW1lIGluIGxvY2Fsc3RvcmFnZVxuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XG5cbiAgICAgICAgLy9HZXQgbmljayBmcm9tIGxvY2FsIHN0b3JhZ2VcbiAgICAgICAgbmlja25hbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpO1xuICAgICAgICBuaWNrSW5wdXRbayAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgfSBlbHNlIHtcblxuICAgICAgICAvL0Vsc2UgZGlzcGxheSBuaWNrIGJveC5cbiAgICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgIH1cblxufVxuXG4vL09mZiB0byBjcmVhdGVDaGF0XG5tb2R1bGUuZXhwb3J0cy5jaGVjayA9IGNoZWNrTmljaztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjcmVhdGVDaGF0KCkge1xuXG4gICAgdmFyIGZpbmRTdWJtaXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN1Ym1pdFwiKTtcbiAgICB2YXIgZmluZFRleHRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LW1lc3NcIik7XG4gICAgdmFyIGZpbmROaWNrU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5hY2NlcHQtbmFtZVwiKTtcbiAgICB2YXIgZmluZE5pY2tBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xuICAgIHZhciBmaW5kTmFtZUZpZWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5uYW1lLWZpZWxkXCIpO1xuICAgIHZhciB0ZXh0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi50ZXh0LWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY2hlY2tOaWNrID0gcmVxdWlyZShcIi4vY2hlY2tOaWNrXCIpO1xuICAgIHZhciBjaGF0U2V0dGluZ3MgPSByZXF1aXJlKFwiLi9jaGF0U2V0dGluZ3NcIik7XG4gICAgdmFyIG5vUmVwZWF0Q291bnRlciA9IDA7XG5cbiAgICAvL0NyZWF0ZXMgbmV3IHNvY2tldFxuICAgIHZhciBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly92aG9zdDMubG51LnNlOjIwMDgwL3NvY2tldC9cIiwgXCJjaGF0dGV4dFwiKTtcblxuICAgIC8vQ2hlY2sgZm9yIGNoYXQgc2V0dGluZ3NcbiAgICBjaGF0U2V0dGluZ3MuY2hhbmdlKCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbmRTdWJtaXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY2hlY2tOaWNrLmNoZWNrKCk7XG4gICAgICAgIG5vUmVwZWF0Q291bnRlciArPSAxO1xuICAgIH1cblxuICAgIC8vR29lcyBhaGVhZCBhbmQgc2V0IGEgdXNlcm5hbWUgd2l0aCB0aGUgaGVscCBmcm9tIHRoZSBuaWNrIGNoYW5nZXIuXG4gICAgZmluZE5pY2tTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAqSGlkZSBhZnRlciB1c2UgLSBzZW5kIHRvIGxvY2FsIHN0b3JhZ2UgIC0+ICpJc2hcbiAgICAgICAgaWYgKGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZGF0YS51c2VybmFtZSA9IGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwibmlja25hbWVcIiwgZmluZE5pY2tBcmVhW25vUmVwZWF0Q291bnRlciAtIDFdLnZhbHVlKTtcbiAgICAgICAgICAgIGZpbmROYW1lRmllbGRbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIHRleHRDb250YWluZXJbbm9SZXBlYXRDb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvL0NoZWNrcyBpZiBldmVyeXRoaW5nIG5lY2Vzc2FyeSBpcyB0aGVyZSBmb3IgYSBtZXNzYWdlLlxuICAgIGZpbmRTdWJtaXRbbm9SZXBlYXRDb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAobG9jYWxTdG9yYWdlLm5pY2tuYW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICBkYXRhLnVzZXJuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKTtcbiAgICAgICAgICAgIGRhdGEuZGF0YSA9IGZpbmRUZXh0QXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9UaGUga2V5cyBhbmQgdmFsdWVzIG5lZWRlZCBmb3IgYSBtZXNzYWdlLlxuICAgIHZhciBkYXRhID0ge1xuICAgICAgICB0eXBlOiBcIm1lc3NhZ2VcIixcbiAgICAgICAgZGF0YTogXCJcIixcbiAgICAgICAgdXNlcm5hbWU6IFwiXCIsXG4gICAgICAgIGNoYW5uZWw6IFwiXCIsXG4gICAgICAgIGtleTogXCJlREJFNzZkZVU3TDBIOW1FQmd4VUtWUjBWQ25xMFhCZFwiLFxuICAgICAgICBkaWRVc2VyU2VuZDogXCJ1c2VyU2VudFwiXG4gICAgfTtcblxuICAgIC8vT3BlbiBzb2NrZXJcbiAgICBzb2NrZXQuYWRkRXZlbnRMaXN0ZW5lcihcIm9wZW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL0NoZWNrcyBhZ2FpbiBmb3Igbmljay5cbiAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSAhPT0gXCJcIiAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICE9PSBudWxsKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBTZW5kIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBzb2NrZXQuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgZmluZFRleHRBcmVhW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vRW5hYmxlIG9uIGVudGVyIHByZXNzIHNlbmRpbmcuXG4gICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgICAgICBmaW5kU3VibWl0W2NvdW50ZXIgLSAxXS5jbGljaygpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL1doZW4gc2VudCwgcmVuZGVyIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHVzZXIgdGV4dCB3aW5kb3cuXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBwVGFnVXNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgICAgICB2YXIgcFRhZ01lc3MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdmFyIGRpdlRhZ1RleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xuICAgICAgICB2YXIgaXNNZSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGlkVXNlclNlbmQ7XG4gICAgICAgIHZhciBjaGF0RGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkuZGF0YTtcbiAgICAgICAgdmFyIGNoYXRVc2VyID0gSlNPTi5wYXJzZShldmVudC5kYXRhKS51c2VybmFtZTtcbiAgICAgICAgdmFyIGNyZWF0ZVRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGF0RGF0YSk7XG4gICAgICAgIHZhciBjcmVhdGVVc2VyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdFVzZXIpO1xuICAgICAgICBwVGFnVXNlci5hcHBlbmRDaGlsZChjcmVhdGVVc2VyKTtcbiAgICAgICAgcFRhZ01lc3MuYXBwZW5kQ2hpbGQoY3JlYXRlVGV4dCk7XG4gICAgICAgIGRpdlRhZ1RleHQuYXBwZW5kQ2hpbGQocFRhZ1VzZXIpO1xuICAgICAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdNZXNzKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRleHRDb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChjaGF0VXNlciAhPT0gbnVsbCAmJiBjaGF0RGF0YSAhPT0gdW5kZWZpbmVkICYmIGNoYXREYXRhICE9PSBcIlwiKSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIGl0IHdhcyBzZW50IGJ5IHRoZSB1c2VyIC0gcHV0IGl0IG9uIHRoZSB1c2VyIHNpZGUgb2YgdGhlIGNoYXQuXG4gICAgICAgICAgICAgICAgaWYgKGNoYXRVc2VyID09PSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIm5pY2tuYW1lXCIpICYmIGlzTWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBkaXZUYWdUZXh0LmNsYXNzTGlzdC5hZGQoXCJ1c2VyLXNlbnRcIik7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9BcHBlbmQgdGhlIGVsZW1lbnRzIGFib3ZlLlxuICAgICAgICAgICAgICAgIHRleHRDb250YWluZXJbaV0uYXBwZW5kQ2hpbGQoZGl2VGFnVGV4dCk7XG5cbiAgICAgICAgICAgICAgICAvL1Njcm9sbCB0byBib3R0b20uXG4gICAgICAgICAgICAgICAgdGV4dENvbnRhaW5lcltpXS5zY3JvbGxUb3AgPSB0ZXh0Q29udGFpbmVyW2ldLnNjcm9sbEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMuY2hhdCA9IGNyZWF0ZUNoYXQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY29sb3JTY2hlbWVlcigpIHtcblxuICAgIC8vR2V0cyB0aGUgdGVtcGxhdGVcbiAgICB2YXIgbG9hZFNjaGVtZSA9IHJlcXVpcmUoXCIuL2xvYWRTY2hlbWVcIik7XG4gICAgbG9hZFNjaGVtZS5sb2FkKCk7XG5cbiAgICAvL0dldHMgdGhlIGlucHV0IHRhZ3MgaGV4LWNvZGVzXG4gICAgdmFyIGZldGNoQ29sb3IgPSByZXF1aXJlKFwiLi9mZXRjaENvbG9yXCIpO1xuICAgIGZldGNoQ29sb3IuZmV0Y2goKTtcblxuICAgIC8vR2V0cyBoZXgtY29kZSBhbmQgc3R5bGluZyBmb3IgdGhlIGZvbnQuXG4gICAgdmFyIHNldEZvbnRGYW1pbHkgPSByZXF1aXJlKFwiLi9zZXRGb250RmFtaWx5XCIpO1xuICAgIHNldEZvbnRGYW1pbHkuc2V0KCk7XG5cbn1cblxuLy9PZmYgdG8gcmVuZGVyV2luZG93XG5tb2R1bGUuZXhwb3J0cy5pbml0aWFsaXplID0gY29sb3JTY2hlbWVlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIE9idGFpbnMgdGhlIGNvbG9ycyBmcm9tIGlucHV0IGFuZCBjaGVja3MgZm9yIGVycm9ycy5cbiAqL1xuZnVuY3Rpb24gZmV0Y2hDb2xvcigpIHtcbiAgICB2YXIgaGV4Q29udGFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3ItY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY29sb3Itcm93IGlucHV0XCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleEluLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgbmV3Q291bnRlciArPSAxO1xuXG4gICAgICAgIGhleEluW2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2F2ZVRhcmdldCA9IHRoaXMucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0ID0gc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5jaGlsZHJlblswXTtcblxuICAgICAgICAgICAgICAgIC8vU2VsZWN0aW9uIGlzIHRoZSBjdXJyZW50IGlucHV0ICh0aGlzKS5cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZXRCZyhzZWxlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gaGV4SW5bMF0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4SW5bMF0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uID09PSBoZXhJblsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5jaGlsZHJlblsxXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhJblsxXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24gPT09IGhleEluWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleEluWzJdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gaGV4SW5bM10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMl0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4SW5bM10udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDYgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3Mgc2l4IGxldHRlcnMgYW5kIG5vIGhhc2h0YWcuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzZXRCZyh0aGlzKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSA9PT0gXCIjXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3MgNiBsZXR0ZXJzICsgYSBoYXNodGFnIC0gcHJvY2VlZCBhcyBub3JtYWwuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFyZW50RWxlbWVudC5jaGlsZHJlblswXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBzZXRCZyh0aGlzKTtcblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPj0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUncyA3IG9yIG1vcmUgbGV0dGVycyAoTW9yZSBzaG91bGQgYmUgaW1wb3NzaWJsZSkgLSB0aGVuIHJlbW92ZSB0aGF0IGxhc3QgYW5kIGFkZCBhIGhhc2guXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWUuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgICAgICAgICBzZXRCZyh0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIGVudGVyZWQgdGV4dCBpcyB2YWxpZCBoZXguXG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNykge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vU2V0cyBjb2xvcnMgb24gaW5wdXRzIGRlcGVuZGluZyBvbiB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlZy50ZXN0KHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzhiMzAzMFwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM1OUFFMzdcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5mZXRjaCA9IGZldGNoQ29sb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gbG9hZFNjaGVtZSgpIHtcbiAgICB2YXIgZmluZFNxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZGVzaWduLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcE9uZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZGVzaWduLW9uZVwiKTtcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBPbmUuY29udGVudCwgdHJ1ZSk7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIHZhciBzZXRQb2ludCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmVmb3JlLXRoaXNcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFNxdWFyZS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9BcHBlbmRzIHRoZSB0ZW1wbGF0ZVxuICAgIGZpbmRTcXVhcmVbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgc2V0UG9pbnRbY291bnRlciAtIDFdKTtcblxufVxuXG4vL09mZiB0byBjb2xvclNjaGVtZWVyXG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZFNjaGVtZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRGb250RmFtaWx5KCkge1xuICAgIHZhciBoZXhDb250YWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5vdmVyLXNxdWFyZVwiKTtcbiAgICB2YXIgdGVtcGxhdGVzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5oZWFkZXItb25lIGlucHV0XCIpO1xuICAgIHZhciBzd2l0Y2hDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXJcIik7XG4gICAgdmFyIHN3aXRjaENvbnRhaW5lckJvbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnN3aXRjaC1jb250YWluZXItYm9sZFwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGhleENvbnRhaW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBoZXhJbiA9IGhleENvbnRhaW5bY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3IoXCJpbnB1dFwiKTtcblxuICAgIC8vRXhhbXBsZSB0ZXh0XG4gICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS52YWx1ZSA9IFwiTE9SRU0gSVBTVU1cIjtcblxuICAgIGhleEluLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgICAgICAgICAvL0dldHMgYSAjIGluIHRoZXJlIC0gdG8gZGVjbGFyZSB0aGUgaW5wdXQgYXMgaGV4LiAtPiBBZGQgY29sb3IgdG8gdGV4dC5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNiAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpICE9PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSBcIiNcIiArIHRoaXMudmFsdWU7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5jb2xvciA9IHRoaXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxuICAgICAgICAgICAgdmFyIHJlZyA9IC9eIyhbQS1GYS1mMC05XXs2fXxbQS1GYS1mMC05XXszfSkkLztcblxuICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3KSB7XG5cbiAgICAgICAgICAgICAgICAvL1NldHMgY29sb3IgdG8gaW5wdXQgZGVwZW5kaW5nIG9uIHZhbHVlXG4gICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiI2FlMzczN1wiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoIDwgNykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIHNlcmlmXG4gICAgc3dpdGNoQ29udGFpbmVyW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMpO1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZXJpZlwiKSkge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuYWRkKFwic2VyaWZcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9Td2l0Y2ggZm9yIGJvbGRcbiAgICBzd2l0Y2hDb250YWluZXJCb2xkW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5jb250YWlucyhcImJvbGRcIikpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjI1cHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcImJvbGRcIik7XG4gICAgICAgICAgICB0aGlzLmZpcnN0RWxlbWVudENoaWxkLnN0eWxlLm1hcmdpbkxlZnQgPSBcIjBweFwiO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxuLy9PZmYgdG8gY29sb3JTY2hlbWVlclxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Rm9udEZhbWlseTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjYXJkUmFuZG9taXplcigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGNhcmRBcnIgPSBbXTtcbiAgICB2YXIgbmV3TnVtYmVyID0gMDtcbiAgICB2YXIgbmV3Q291bnRlciA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgODsgaSArPSAxKSB7XG4gICAgICAgIGZvciAoaiA9IDA7IGogPCAyOyBqICs9IDEpIHtcbiAgICAgICAgICAgIGNhcmRBcnIucHVzaChpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0Zpc2hlciB5YXRlcyBzaHVmZmxlIGZ1bmN0aW9uXG4gICAgZnVuY3Rpb24gc2h1ZmZsZShjYXJkQXJyKSB7XG4gICAgICAgIHZhciBtID0gY2FyZEFyci5sZW5ndGg7XG4gICAgICAgIHZhciB0O1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZeKAplxuICAgICAgICB3aGlsZSAobSkge1xuXG4gICAgICAgICAgICAvLyBQaWNrIGEgcmVtYWluaW5nIGVsZW1lbnTigKZcbiAgICAgICAgICAgIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobSAtPSAxKSk7XG5cbiAgICAgICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgICAgIHQgPSBjYXJkQXJyW21dO1xuICAgICAgICAgICAgY2FyZEFyclttXSA9IGNhcmRBcnJbaV07XG4gICAgICAgICAgICBjYXJkQXJyW2ldID0gdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYXJkQXJyO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIG5ld0NvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByYW5kb21BbmRTZXQoKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdmFyIHdpbmRvd0NvdW50ID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgd2luZG93Q291bnQgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU2VsZWN0cyBhbGwgdGhlIGNhcmRzXG4gICAgICAgIHZhciBjYXJkc0luV2luZG93cyA9IHdpbmRvd3Nbd2luZG93Q291bnQgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG5cbiAgICAgICAgLy9Gb3IgZWEgdmFsdWUgaW4gYXJyYXkgYWRkcyBjYXJkIG51bWJlciB0byBjbGFzcy5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IDE2OyBpICs9IDEpIHtcbiAgICAgICAgICAgIG5ld051bWJlciA9IHNodWZmbGUoY2FyZEFycikuc3BsaWNlKDAsIDEpO1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICAgICAgY2FyZHNJbldpbmRvd3NbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZChuZXdOdW1iZXIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByYW5kb21BbmRTZXQoKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLnJ1biA9IGNhcmRSYW5kb21pemVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogR2FtZWxvZ2ljIChJcyBpdCBwYWlyPyBXaGF0IGlmIGl0IGlzbid0PyBDYW4gdGhlIHVzZXIgcHJlc3M/IEV0Yy4pXG4gKi9cbmZ1bmN0aW9uIGNoZWNrUGFpcigpIHtcbiAgICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBuZXdBcnIgPSBbXTtcbiAgICB2YXIgdGFyZ2V0QXJyID0gW107XG4gICAgdmFyIHNhdmVUYXJnZXQgPSBbXTtcbiAgICB2YXIgY2xpY2tzID0gMDtcbiAgICB2YXIgdHJpZXMgPSAwO1xuICAgIHZhciBwYWlyQ291bnRlciA9IDA7XG4gICAgdmFyIHdpbkNoZWNrID0gcmVxdWlyZShcIi4vd2luQ2hlY2tcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgY2FyZHNJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICAgIHZhciBjb3VudGVySW5XaW5kb3cgPSBjb250YWluZXJbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihcIi5jbGlja0NvdW50ZXJcIik7XG5cbiAgICBmdW5jdGlvbiBvdXRicmVhayh3aGljaEVsZW1lbnQpIHtcbiAgICAgICAgbmV3QXJyLnB1c2god2hpY2hFbGVtZW50LnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHdoaWNoRWxlbWVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25QYWlyKCkge1xuICAgICAgICBzYXZlVGFyZ2V0WzBdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcbiAgICAgICAgc2F2ZVRhcmdldFsxXS5jbGFzc0xpc3QuYWRkKFwiYVBhaXJcIik7XG4gICAgICAgIHNhdmVUYXJnZXRbMF0uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgXCIwXCIpO1xuICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgY2xpY2tzID0gMDtcbiAgICAgICAgcGFpckNvdW50ZXIgKz0gMTtcbiAgICAgICAgaWYgKHBhaXJDb3VudGVyID49IDgpIHtcbiAgICAgICAgICAgIHdpbkNoZWNrLndpbihjb3VudGVySW5XaW5kb3cpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm90UGFpcih0aGVUaGVtZSkge1xuXG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcblxuICAgICAgICAgICAgLy8gdmFyIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIHRoZVRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyB0aGVUaGVtZSArIFwiLzAucG5nJylcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsaWNrcyA9IDA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGVqKHdoaWNoRWxlbWVudCwgY3VycmVudFRoZW1lKSB7XG4gICAgICAgIGlmICh0YXJnZXRBcnJbMF0gIT09IHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgaWYgKG5ld0Fyci5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgb3V0YnJlYWsod2hpY2hFbGVtZW50KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobmV3QXJyLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdICYmIHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRicmVhayh3aGljaEVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICBuZXdBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0Lmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgb3V0YnJlYWsod2hpY2hFbGVtZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG5ld0FyclswXSAmJiBuZXdBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3QXJyWzBdID09PSBuZXdBcnJbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChvblBhaXIsIDEwMDApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub3RQYWlyKGN1cnJlbnRUaGVtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrRW50ZXIoc2VsZWN0aW9uLCBldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIHNlbGVjdGlvbi5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0ZW5lcih3aGljaEVsZW1lbnQpIHtcblxuICAgICAgICBpZiAoY2xpY2tzIDwgMikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjbGlja3MgKz0gMTtcblxuICAgICAgICAgICAgdHJpZXMgKz0gMTtcblxuICAgICAgICAgICAgdmFyIGdldFdpbmRvdyA9IHdoaWNoRWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaGVtZSA9IGdldFdpbmRvdy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIpO1xuXG4gICAgICAgICAgICB3aGljaEVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvXCIgKyB3aGljaEVsZW1lbnQucGFyZW50RWxlbWVudC5jbGFzc05hbWUgKyBcIi5wbmcnKVwiO1xuXG4gICAgICAgICAgICBpZiAodGFyZ2V0QXJyLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyci5wdXNoKHdoaWNoRWxlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnJbMF0gPT09IHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyciA9IHRhcmdldEFyci5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgY2xpY2tzID0gY2xpY2tzIC09IDE7XG4gICAgICAgICAgICAgICAgdHJpZXMgPSB0cmllcyAtPSAxO1xuICAgICAgICAgICAgICAgIHBhaXJDb3VudGVyID0gcGFpckNvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY291bnRlckluV2luZG93LnRleHRDb250ZW50ID0gdHJpZXM7XG5cbiAgICAgICAgICAgIGhlaih3aGljaEVsZW1lbnQsIGN1cnJlbnRUaGVtZSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkc0luV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hlY2tFbnRlcih0aGlzLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja1BhaXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY3JlYXRlTWVtb3J5KCkge1xuXG4gICAgLy9HZXRzIHRlbXBsYXRlXG4gICAgdmFyIGxvYWRpbmdDYXJkcyA9IHJlcXVpcmUoXCIuL2xvYWRpbmdDYXJkc1wiKTtcbiAgICBsb2FkaW5nQ2FyZHMubG9hZCgpO1xuXG4gICAgLy9JbXBsZW1lbnRzIHRoZSB0aGVtZSBjaGFuZ2VyXG4gICAgdmFyIHRoZW1lQ2hhbmdlciA9IHJlcXVpcmUoXCIuL3RoZW1lQ2hhbmdlclwiKTtcbiAgICB0aGVtZUNoYW5nZXIuY2hhbmdlKCk7XG5cbiAgICAvL0dpdmVzIGNhcmQgaW1nIGRlcGVuZGluZyBvbiBjbGFzcyB2YWx1ZVxuICAgIHZhciBzZXRDYXJkcyA9IHJlcXVpcmUoXCIuL3NldENhcmRzXCIpO1xuICAgIHNldENhcmRzLnNldCgpO1xuXG4gICAgLy9SYW5kb21pemluZyBjYXJkc1xuICAgIHZhciBjYXJkUmFuZG9taXplciA9IHJlcXVpcmUoXCIuL2NhcmRSYW5kb21pemVyXCIpO1xuICAgIGNhcmRSYW5kb21pemVyLnJ1bigpO1xuXG4gICAgLy9UaGUgZ2FtZSBsb2dpYy5cbiAgICB2YXIgY2hlY2tQYWlyID0gcmVxdWlyZShcIi4vY2hlY2tQYWlyXCIpO1xuICAgIGNoZWNrUGFpci5jaGVjaygpO1xuXG59XG5cbm1vZHVsZS5leHBvcnRzLmNyZWF0ZSA9IGNyZWF0ZU1lbW9yeTtcbiIsIlwidXNlIHN0cmljdFwiO1xuLyoqXG4gKiBHZXRzIHRoZSBtZW1vcnkgdGVtcGxhdGVcbiAqL1xuZnVuY3Rpb24gbG9hZGluZ0NhcmRzKCkge1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbW9yeS10ZW1wbGF0ZVwiKTtcbiAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgIHZhciBjbGlja0NvdW50ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNsaWNrQ291bnRlclwiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCB3aW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKVtjb3VudGVyIC0gMV0uaW5zZXJ0QmVmb3JlKGNsb25lLCBjbGlja0NvdW50ZXJbY291bnRlciAtIDFdKTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmxvYWQgPSBsb2FkaW5nQ2FyZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBHZXRzIHRoZW1lXG4gKiBHaXZlcyBlbGVtZW50IGFwcHJvcHJpYXRlIGFuZCBtYXRjaGluZyBpbWFnZXMgdGhhdCByZXByZXNlbnRzIGNhcmRzLlxuICovXG5mdW5jdGlvbiBzZXRDYXJkcygpIHtcbiAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gICAgdmFyIG1lbVdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxhc3RUaGVtZSA9IFwiXCI7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgbWVtV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICBsYXN0VGhlbWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRoZW1lXCIpO1xuICAgICAgICBtZW1XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgbGFzdFRoZW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBtZW1XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgXCJwbGFpblwiKTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgY2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcblxuICAgICAgICAvL0lmIHRoZXJlJ3Mgbm8gaW1hZ2UgLSBzZXQgdGhlIGltYWdlcyB3aXRoIHRoZSBsYXN0IHVzZWQgdGhlbWUuXG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShjYXJkc1tpXSkuZ2V0UHJvcGVydHlWYWx1ZShcImJhY2tncm91bmQtaW1hZ2VcIikgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBsYXN0VGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy9JZiB0aGVyZSdzIG5vIHRoZW1lLCB0aGVuIHVzZSB0aGUgcGxhaW4gdGhlbWUuXG4gICAgICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMuc2V0ID0gc2V0Q2FyZHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBNYWtlcyBpdCBhdmFpbGFibGUgZm9yIHRoZSB1c2VyIHRvIGNoYW5nZSB0aGUgdGhlbWUgb2YgdGhlIG1lbW9yeS5cbiAqL1xuZnVuY3Rpb24gdGhlbWVDaGFuZ2VyKCkge1xuICAgIHZhciBoYXNDYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGhlbWUtc2VsZWN0b3JcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBoYXNDYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgLy9TZWxlY3QgYWxsIGNhcmRzLlxuICAgIHZhciBjYXJkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZC1jb250YWluZXJcIilbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2FyZFwiKTtcblxuICAgIC8vQ2hlY2sgYW5kIGdldCAoaWYpIHRoZW1lXG4gICAgZnVuY3Rpb24gd2hhdENhcmRzKGNvbG9yKSB7XG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ0aGVtZVwiLCBjb2xvcik7XG5cbiAgICAgICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS10aGVtZVwiLCBjb2xvcik7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjYXJkc1tpXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjb2xvciArIFwiLzAucG5nJylcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVswXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoYXRDYXJkcyhcInBsYWluXCIpO1xuICAgIH0pO1xuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVsxXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoYXRDYXJkcyhcInJlZFwiKTtcbiAgICB9KTtcblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGF0Q2FyZHMoXCJibHVlXCIpO1xuICAgIH0pO1xuXG4gICAgaGFzQ2FyZHNbY291bnRlciAtIDFdLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGlja2VyLWNvbnRhaW5lclwiKVszXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHdoYXRDYXJkcyhcImdyZWVuXCIpO1xuICAgIH0pO1xuXG4gICAgdmFyIHRoZW1lQnV0dG9uID0gaGFzQ2FyZHNbY291bnRlciAtIDFdLnBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQ7XG5cbiAgICBmdW5jdGlvbiBicmluZ1RoZW1lKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QudG9nZ2xlKFwibmljay1jb2ctcm90YXRlXCIpO1xuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC50b2dnbGUoXCJ0aGVtZS1maWVsZC1nb25lXCIpO1xuICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC50b2dnbGUoXCJjYXJkLWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICB9XG5cbiAgICB0aGVtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYnJpbmdUaGVtZSk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSB0aGVtZUNoYW5nZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBBZGRzIGEgd2lubmluZyBtZXNzYWdlIHRvIHRoZSB0aGUgc3BlY2lmaWMgd2luZG93IChDdXJyZW50IHdpbmRvdykuXG4gKiBAcGFyYW0gY3VycmVudFdpbmRvd1xuICovXG5mdW5jdGlvbiB3aW5DaGVjayhjdXJyZW50V2luZG93KSB7XG4gICAgdmFyIHlvdVdpbiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiWU9VIFdJTiFcIik7XG4gICAgdmFyIGJyZWFraW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkJSXCIpO1xuICAgIHZhciBwdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgcHRhZy5hcHBlbmRDaGlsZCh5b3VXaW4pO1xuICAgIHB0YWcuY2xhc3NMaXN0LmFkZChcIndpbm5pbmctbWVzc2FnZVwiKTtcbiAgICBjdXJyZW50V2luZG93LmFwcGVuZENoaWxkKGJyZWFraW5nKTtcbiAgICBjdXJyZW50V2luZG93LmFwcGVuZENoaWxkKHB0YWcpO1xuICAgIGN1cnJlbnRXaW5kb3cuY2xhc3NMaXN0LmFkZChcInByZXNlbnQtY2xpY2tcIik7XG59XG5cbi8vT2ZmIHRvIGNoZWNrUGFpclxubW9kdWxlLmV4cG9ydHMud2luID0gd2luQ2hlY2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBNYWtlcyB0aGUgd2luZG93IGRyYWdnYWJsZS5cbiAqL1xuZnVuY3Rpb24gbW92YWJsZSgpIHtcblxuICAgIHZhciBmaW5kV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoKSB7XG5cbiAgICAgICAgLy9Mb29rIGZvciB0aGUgd2luZG93IGFuZCBhZGQgbW91c2Vkb3duICsgYW5kIG1vdXNldXBcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGZpbmRXaW5kb3dzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICBmaW5kV2luZG93c1tjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBtb3VzZURvd24sIGZhbHNlKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgbW91c2VVcCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8vRGVjbGFyZXMgdmFyaWFibGVzIHVzZWQgZm9yIGxvY2F0aW5nIHBvaW50ZXIuXG4gICAgdmFyIGFWYXJZID0gMDtcbiAgICB2YXIgYVZhclggPSAwO1xuICAgIHZhciBzYXZlVGFyZ2V0ID0gMDtcblxuICAgIGZ1bmN0aW9uIG1vdXNlRG93bihldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB0YXJnZXQgaGFzIHRoZSBjbGFzc25hbWUgXCJ0b3BcIi5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc05hbWUuc2xpY2UoMCwgMykgPT09IFwidG9wXCIpIHtcblxuICAgICAgICAgICAgLy9TYXZlcyB0aGUgY3VycmVudCBjb3JkcyAtIGFuZCB0aGUgY3VycmVudCB0YXJnZXQuXG4gICAgICAgICAgICBhVmFyWSA9IGV2ZW50Lm9mZnNldFk7XG4gICAgICAgICAgICBhVmFyWCA9IGV2ZW50Lm9mZnNldFg7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0ID0gZXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XG5cbiAgICAgICAgICAgIC8vR2l2ZXMgdGhlIGN1cnJlbnQgdGFyZ2V0IGEgJ3ByZXR0eScgYW5kIHByYWN0aWNhbCBvcGFjaXR5LlxuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwLjg1O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbW91c2VVcCgpIHtcblxuICAgICAgICAvL1NldHMgdGhlIG9wYWNpdHkgdG8gMSB3aGVuIHRoZSB1c2VyIGRyb3BzIHRoZSB3aW5kb3cuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZmluZFdpbmRvd3NbaV0uc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkaXZNb3ZlLCB0cnVlKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRpdk1vdmUoZXZlbnQpIHtcblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgd2luZG93IHNob3VsZCBtb3ZlIC0gc2V0cyBib3VuZGluZy1ib3ggKGZvciBib3RoIHggYW5kIHkpLlxuICAgICAgICBpZiAoZXZlbnQueSAtIGFWYXJZIDwgMCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXZlbnQueSAtIGFWYXJZKTtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS50b3AgPSBcIjBweFwiO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnkgLSBhVmFyWSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICogMC41KSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC0gc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKiAwLjUgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gZXZlbnQueSAtIGFWYXJZICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LnggLSBhVmFyWCA8IDApIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC54IC0gYVZhclggPiB3aW5kb3cuaW5uZXJXaWR0aCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCAqIDAuNSkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLmxlZnQgPSB3aW5kb3cuaW5uZXJXaWR0aCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCArIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCAqIDAuNSArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gZXZlbnQueCAtIGFWYXJYICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcnMoKTtcblxufVxuXG4vL09mZiB0byByZW5kZXJXaW5kb3dcbm1vZHVsZS5leHBvcnRzLm1vdmUgPSBtb3ZhYmxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIHByZWxvYWRpbmcoKSB7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbWcxID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWczID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc0ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc1ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc3ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc4ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWc5ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaW1nMS5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMC5wbmdcIjtcbiAgICAgICAgaW1nMi5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMS5wbmdcIjtcbiAgICAgICAgaW1nMy5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMi5wbmdcIjtcbiAgICAgICAgaW1nNC5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvMy5wbmdcIjtcbiAgICAgICAgaW1nNS5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNC5wbmdcIjtcbiAgICAgICAgaW1nNi5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNS5wbmdcIjtcbiAgICAgICAgaW1nNy5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNi5wbmdcIjtcbiAgICAgICAgaW1nOC5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvNy5wbmdcIjtcbiAgICAgICAgaW1nOS5zcmMgPSBcIi4uL2ltYWdlL2JsdWUvOC5wbmdcIjtcbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgaW1nMTAgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzExID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE0ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE3ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxOCA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGltZzEwLnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzAucG5nXCI7XG4gICAgICAgIGltZzExLnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzEucG5nXCI7XG4gICAgICAgIGltZzEyLnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzIucG5nXCI7XG4gICAgICAgIGltZzEzLnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzMucG5nXCI7XG4gICAgICAgIGltZzE0LnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzQucG5nXCI7XG4gICAgICAgIGltZzE1LnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzUucG5nXCI7XG4gICAgICAgIGltZzE2LnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzYucG5nXCI7XG4gICAgICAgIGltZzE3LnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzcucG5nXCI7XG4gICAgICAgIGltZzE4LnNyYyA9IFwiLi4vaW1hZ2UvcmVkLzgucG5nXCI7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGltZzE5ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjEgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIyID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjQgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI1ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjcgPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICB2YXIgaW1nMjggPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBpbWcxOS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzAucG5nXCI7XG4gICAgICAgIGltZzIwLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMS5wbmdcIjtcbiAgICAgICAgaW1nMjEuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8yLnBuZ1wiO1xuICAgICAgICBpbWcyMi5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzMucG5nXCI7XG4gICAgICAgIGltZzIzLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNC5wbmdcIjtcbiAgICAgICAgaW1nMjQuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi81LnBuZ1wiO1xuICAgICAgICBpbWcyNS5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzYucG5nXCI7XG4gICAgICAgIGltZzI2LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNy5wbmdcIjtcbiAgICAgICAgaW1nMjcuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi84LnBuZ1wiO1xuXG4gICAgICAgIGltZzI4LnNyYyA9IFwiLi4vaW1hZ2UvaWNvbnMvY29nZ3JleS5wbmdcIjtcblxuICAgIH0pO1xuXG59XG5cbi8vT2ZmIHRvIGFwcFxubW9kdWxlLmV4cG9ydHMubG9hZGluZyA9IHByZWxvYWRpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBJbml0aWFsaXplIGFsbCB3aW5kb3dzIHJlYWR5IGZvciB1c2UuXG4gKi9cbmZ1bmN0aW9uIHJlbmRlcldpbmRvdygpIHtcblxuICAgIHZhciBtb3ZhYmxlID0gcmVxdWlyZShcIi4vbW92YWJsZVwiKTtcbiAgICB2YXIgd2luZG93RGVzdHJveWVyID0gcmVxdWlyZShcIi4vd2luZG93RGVzdHJveWVyXCIpO1xuICAgIHZhciBjcmVhdGVNZW1vcnkgPSByZXF1aXJlKFwiLi9tZW1vcnkvY3JlYXRlTWVtb3J5XCIpO1xuICAgIHZhciBjcmVhdGVDaGF0ID0gcmVxdWlyZShcIi4vY2hhdC9jcmVhdGVDaGF0XCIpO1xuICAgIHZhciBjb2xvclNjaGVtZWVyID0gcmVxdWlyZShcIi4vY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyXCIpO1xuICAgIHZhciB3aW5kb3dQbGFjZW1lbnQgPSByZXF1aXJlKFwiLi93aW5kb3dQbGFjZW1lbnRcIik7XG4gICAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xuXG4gICAgLy9DaGVja3MgaWYgd2hpY2ggbmF2LWJ1dHRvbiBpcyBiZWluZyBwcmVzc2VkLlxuICAgIGZ1bmN0aW9uIG5hdkNsaWNrKCkge1xuICAgICAgICB2YXIgZmluZE5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaWNvbjFcIik7XG5cbiAgICAgICAgZnVuY3Rpb24gY2hlY2tOYXYoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMF0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzFdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyTWVtKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsyXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlclNjaGVtZWUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kTmF2Lmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgICAgIGZpbmROYXZbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNoZWNrTmF2KTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBuYXZDbGljaygpO1xuXG4gICAgLy9DcmVhdGVzIGNoYXQgaW5zdGFuY2UuXG4gICAgZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NoYXQtdGVtcGxhdGVcIik7XG4gICAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICAgIHZhciBiZWZvcmVUaGlzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53cmFwcGVyLWhlcm9cIik7XG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XG5cbiAgICAgICAgLy9pbml0aWFsaXplcyBQbGFjZW1lbnQsIGNoYXQtcGFydCwgbW92YWJsZS13aW5kb3csIHotaW5kZXgsIGFibGUgdG8gZGVzdHJveSB3aW5kb3cuXG4gICAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xuICAgICAgICBjcmVhdGVDaGF0LmNoYXQoKTtcbiAgICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICAgIHNldFouc2V0KCk7XG4gICAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG5cbiAgICB9XG5cbiAgICAvL0NyZWF0ZSBtZW1vcnlcbiAgICBmdW5jdGlvbiByZW5kZXJNZW0oKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dpbmRvdy10ZW1wbGF0ZVwiKTtcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgLy9pbml0aWFsaXplcyBQbGFjZW1lbnQsIGNyZWF0ZS1tZW1vcnksIG1vdmFibGUtd2luZG93LCB6LWluZGV4LCBhYmxlIHRvIGRlc3Ryb3kgd2luZG93LlxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICBjcmVhdGVNZW1vcnkuY3JlYXRlKCk7XG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcbiAgICAgIHNldFouc2V0KCk7XG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xuICB9XG5cbiAgICAvL0NyZWF0ZXMgU2NoZW1lZSAoVGhpcmQgJ2FwcCcpXG4gICAgZnVuY3Rpb24gcmVuZGVyU2NoZW1lZSgpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2NoZW1lZS10ZW1wbGF0ZVwiKTtcbiAgICAgIHZhciBjbG9uZSA9IGRvY3VtZW50LmltcG9ydE5vZGUodGVtcGxhdGUuY29udGVudCwgdHJ1ZSk7XG4gICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIikuaW5zZXJ0QmVmb3JlKGNsb25lLCBiZWZvcmVUaGlzKTtcblxuICAgICAgLy9pbml0aWFsaXplcyBQbGFjZW1lbnQsIHNjaGVtZWVyLWluaXQsIG1vdmFibGUtd2luZG93LCB6LWluZGV4LCBhYmxlIHRvIGRlc3Ryb3kgd2luZG93LlxuICAgICAgd2luZG93UGxhY2VtZW50LnBsYWNlKCk7XG4gICAgICBjb2xvclNjaGVtZWVyLmluaXRpYWxpemUoKTtcbiAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgc2V0Wi5zZXQoKTtcbiAgICAgIHdpbmRvd0Rlc3Ryb3llci5kZXN0cm95KCk7XG4gIH1cblxufVxuXG4vL09mZiB0byBhcHBcbm1vZHVsZS5leHBvcnRzLnJlbmRlciA9IHJlbmRlcldpbmRvdztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBzZXRaKCkge1xuICAgIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFza2JhclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBuZXdBcnIgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGhpZ2VzdFoodGhlV2luZG93cywgbmF2aW5nKSB7XG5cbiAgICAgICAgdmFyIGdsYXNzU3F1YXJlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGVXaW5kb3dzKTtcbiAgICAgICAgdmFyIGhpZ2hlc3QgPSAwO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2xhc3NTcXVhcmUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIC8vQ2hlY2tzIGFsbCB0aGUgd2luZG93cyBmb3Igei1pbmRleFxuICAgICAgICAgICAgdmFyIHppbmRleCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGdsYXNzU3F1YXJlW2ldKS5nZXRQcm9wZXJ0eVZhbHVlKFwiei1pbmRleFwiKTtcbiAgICAgICAgICAgIGlmICgoemluZGV4ICE9PSBcImF1dG9cIikpIHtcblxuICAgICAgICAgICAgICAgIC8vSWYgaXQncyB0aGUgbmF2IC0gdGhlbiBhZGQgMjAwIHRvIHRoZSB6LWluZGV4LCBlbHNlIGp1c3Qgb25lIGZvciBub3JtYWwgd2luZG93cy5cbiAgICAgICAgICAgICAgICBpZiAobmF2aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZ2hlc3QgPSBwYXJzZUludCh6aW5kZXgpICsgMjAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZ2hlc3QgPSBwYXJzZUludCh6aW5kZXgpICsgMTtcblxuICAgICAgICAgICAgICAgICAgICAvL1B1c2ggdmFsdWVzIGludG8gYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbmV3QXJyLnB1c2goaGlnaGVzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9Tb3J0IGFycmF5XG4gICAgICAgIG5ld0Fyci5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBiIC0gYTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy9JZiB0aGUgaGlnaGVzdCBpbiBhcnJheSBpc24ndCB1bmRlZmluZWQsIHJldHVybiB0aGF0IHZhbHVlLCBlbHNlIHJldHVybiBub3JtYWwgaGlnaGVzdC5cbiAgICAgICAgaWYgKG5ld0FyclswXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3QXJyWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGhpZ2hlc3Q7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8vV2hlbiBydW4sIGdldCB0aGUgaGlnaGVzdCB6LWluZGV4IGFuZCBzZXQgdGhhdCB0byB0aGUgbmF2YmFyXG4gICAgbmF2LnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIsIHRydWUpKTtcblxuICAgIGZ1bmN0aW9uIHNldHRpbmdOZSgpIHtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9JbiBvcmRlciBmb3IgbmF2IHRvIGdldCB0aGUgaGlnaGVzdCB6LWluZGV4LCBnaXZlIHRoZSB3aW5kb3dzIHotaW5kZXggb24gaW5pdC5cbiAgICAgICAgd2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUuekluZGV4ID0gcGFyc2VJbnQoaGlnZXN0WihcIi53aW5kb3dcIikpO1xuXG4gICAgICAgIC8vV2hlbiBjbGlja2luZyBhIHdpbmRvdywgY2hlY2sgdGhlIGhpZ2hlc3Qgei1pbmRleCBhbmQgYWRkIHRoYXQgdG8gdGhhdCBzcGVjaWZpYyB3aW5kb3cuXG4gICAgICAgIHdpbmRvd3NbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIsIGZhbHNlKSk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBzZXR0aW5nTmUoKTtcblxufVxuXG4vL09mZiB0byByZW5kZXJXaW5kb3cgKyB3aW5kb3dQbGFjZW1lbnRcbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldFo7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKkxldCdzIHRoZSBuYXZiYXIgYXBwZWFyIG9uIGxvYWQgKEdpdmVzIGEgdmlzdWFsbHkgcGxlYXNpbmcgZWZmZWN0KS5cbiAqL1xuZnVuY3Rpb24gdGFza2JhcigpIHtcbiAgICB2YXIgZmluZFRhc2tiYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgZmluZFRhc2tiYXIuY2xhc3NMaXN0LmFkZChcInRhc2stYXBwZWFyXCIpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMuYnJpbmdGb3J0aCA9IHRhc2tiYXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBNYWtlcyB0aGUgd2luZG93cyByZW1vdmFibGUuXG4gKi9cbmZ1bmN0aW9uIHdpbmRvd0Rlc3Ryb3llcigpIHtcbiAgICB2YXIgZmluZEV4aXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmV4aXRcIik7XG4gICAgdmFyIGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcblxuICAgIGZ1bmN0aW9uIHJlbW92aW5nKGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3Mgc3BlY2lmaWNhbGx5IGZvciB0aGUgZmFjdCB0aGF0IHdlJ3JlIG5vdCB0cnlpbmcgdG8gcmVtb3ZlIHRoZSBib2R5LlxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50ICE9PSBib2R5KSB7XG5cbiAgICAgICAgICAgIC8vVGhlbiByZW1vdmVzLlxuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kRXhpdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBmaW5kRXhpdFtpXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgcmVtb3ZpbmcpO1xuICAgIH1cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5kZXN0cm95ID0gd2luZG93RGVzdHJveWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBuZXdDb3VudGVyID0gMDtcbnZhciBoZWlnaHQgPSAwO1xudmFyIHdpZHRoID0gMDtcbnZhciBjb3VudGluZyA9IDA7XG5cbi8qKlxuICogV2hlcmUgdGhlIHdpbmRvdyBzaG91bGQgYmUgcGxhY2VkIG9uIGxvYWQuXG4gKi9cbmZ1bmN0aW9uIHdpbmRvd1BsYWNlbWVudCgpIHtcblxuICAgIGZ1bmN0aW9uIHdoZXJlVG9QbGFjZSgpIHtcbiAgICAgICAgdmFyIGZpbmRBbGxXaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGkgPSAwO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kQWxsV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNldFogPSByZXF1aXJlKFwiLi9zZXRaXCIpO1xuICAgICAgICBzZXRaLnNldCgpO1xuXG4gICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgMzAgKiBuZXdDb3VudGVyICsgXCJweFwiO1xuICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyAzMCAqIG5ld0NvdW50ZXIgKyBcInB4XCI7XG5cbiAgICAgICAgaGVpZ2h0ICs9IDMwO1xuICAgICAgICB3aWR0aCArPSAzMDtcblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgd2luZG93cyBhcmUgdG9vIGNsb3NlIHRvIHRoZSBib3R0b20gb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgaWYgKCh3aWR0aCkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSA1MDApIHtcbiAgICAgICAgICAgIG5ld0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgd2lkdGggPSAzMDtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS50b3AgPSBcIlwiICsgd2lkdGggKyBcInB4XCI7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUubGVmdCA9IFwiXCIgKyBoZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHdpbmRvd3MgYXJlIHRvbyBjbG9zZSB0byB0aGUgcmlnaHQgYm9yZGVyIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgIGlmICgoaGVpZ2h0KSA+IHdpbmRvdy5pbm5lcldpZHRoIC0gNDUwKSB7XG4gICAgICAgICAgICBjb3VudGluZyArPSAxO1xuICAgICAgICAgICAgaGVpZ2h0ID0gNSAqIGNvdW50aW5nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgd2hlcmVUb1BsYWNlKCk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5wbGFjZSA9IHdpbmRvd1BsYWNlbWVudDtcbiJdfQ==
