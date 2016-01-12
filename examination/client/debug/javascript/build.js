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
 * Gamelogic (Is it pair? What if it isn't? Etc.)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2hvbWUvdmFncmFudC8ubnZtL3ZlcnNpb25zL25vZGUvdjUuMi4wL2xpYi9ub2RlX21vZHVsZXMvd2F0Y2hpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImNsaWVudC9zb3VyY2UvanMvYXBwLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jaGF0L2NoYXRTZXR0aW5ncy5qcyIsImNsaWVudC9zb3VyY2UvanMvY2hhdC9jaGVja05pY2suanMiLCJjbGllbnQvc291cmNlL2pzL2NoYXQvY3JlYXRlQ2hhdC5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9jb2xvclNjaGVtZWVyLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9jb2xvclNjaGVtZWVyL2ZldGNoQ29sb3IuanMiLCJjbGllbnQvc291cmNlL2pzL2NvbG9yU2NoZW1lZXIvbG9hZFNjaGVtZS5qcyIsImNsaWVudC9zb3VyY2UvanMvY29sb3JTY2hlbWVlci9zZXRGb250RmFtaWx5LmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tZW1vcnkvY2FyZFJhbmRvbWl6ZXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jaGVja1BhaXIuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9jcmVhdGVNZW1vcnkuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9sb2FkaW5nQ2FyZHMuanMiLCJjbGllbnQvc291cmNlL2pzL21lbW9yeS9zZXRDYXJkcy5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3RoZW1lQ2hhbmdlci5qcyIsImNsaWVudC9zb3VyY2UvanMvbWVtb3J5L3dpbkNoZWNrLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9tb3ZhYmxlLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9wcmVsb2FkaW5nLmpzIiwiY2xpZW50L3NvdXJjZS9qcy9yZW5kZXJXaW5kb3cuanMiLCJjbGllbnQvc291cmNlL2pzL3NldFouanMiLCJjbGllbnQvc291cmNlL2pzL3Rhc2tiYXIuanMiLCJjbGllbnQvc291cmNlL2pzL3dpbmRvd0Rlc3Ryb3llci5qcyIsImNsaWVudC9zb3VyY2UvanMvd2luZG93UGxhY2VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiO1xuXG4vL0luaXQgd2luZG93c1xudmFyIHJlbmRlcldpbmRvdyA9IHJlcXVpcmUoXCIuL3JlbmRlcldpbmRvd1wiKTtcbnJlbmRlcldpbmRvdy5yZW5kZXIoKTtcblxuLy9Jbml0IHRhc2tiYXJcbnZhciB0YXNrYmFyID0gcmVxdWlyZShcIi4vdGFza2JhclwiKTtcbnRhc2tiYXIuYnJpbmdGb3J0aCgpO1xuXG4vL1ByZWxvYWQgaW1hZ2VzXG52YXIgcHJlbG9hZGluZyA9IHJlcXVpcmUoXCIuL3ByZWxvYWRpbmdcIik7XG5wcmVsb2FkaW5nLmxvYWRpbmcoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBjaGF0U2V0dGluZ3MoKSB7XG4gICAgdmFyIGNoYW5nZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmljay1jaGFuZ2VyXCIpO1xuICAgIHZhciBuaWNraW5nID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5lbnRlci1uaWNrXCIpO1xuICAgIHZhciBrID0gMDtcbiAgICB2YXIgaiA9IDA7XG5cbiAgICBmb3IgKGogPSAwOyBqIDwgY2hhbmdlQnV0dG9uLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgIGsgKz0gMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaW5kQW5kU2V0KGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIGNoZWNrTmljayBoYXMgdHJpZ2dlcmVkIChuYW1lLWZpZWxkLWdvbmUpXG4gICAgICAgIG5pY2tpbmdbayAtIDFdLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIikpO1xuICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcIm5pY2stY29nLXJvdGF0ZVwiKTtcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwibmFtZS1maWVsZC1nb25lXCIpKSB7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzFdLmNsYXNzTGlzdC5yZW1vdmUoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmNoaWxkcmVuWzJdLmNsYXNzTGlzdC5yZW1vdmUoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMV0uY2xhc3NMaXN0LmFkZChcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMl0uY2xhc3NMaXN0LmFkZChcInRleHQtY29udGFpbmVyLWFmdGVyXCIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBjaGFuZ2VCdXR0b25bayAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmaW5kQW5kU2V0KTtcblxufVxuXG4vL09mZiB0byBjcmVhdGVDaGF0XG5tb2R1bGUuZXhwb3J0cy5jaGFuZ2UgPSBjaGF0U2V0dGluZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2hlY2tOaWNrKCkge1xuXG4gICAgdmFyIG5pY2tJbnB1dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcblxuICAgIHZhciBpID0gMDtcbiAgICB2YXIgayA9IDA7XG4gICAgdmFyIG5pY2tuYW1lID0gXCJcIjtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuaWNrSW5wdXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgayArPSAxO1xuICAgIH1cblxuICAgIC8vQ2hlY2sgaWYgdGhlcmUgaXMgYSBuaWNrbmFtZSBpbiBsb2NhbHN0b3JhZ2VcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xuXG4gICAgICAgIC8vR2V0IG5pY2sgZnJvbSBsb2NhbCBzdG9yYWdlXG4gICAgICAgIG5pY2tuYW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKTtcbiAgICAgICAgbmlja0lucHV0W2sgLSAxXS5jbGFzc0xpc3QuYWRkKFwibmFtZS1maWVsZC1nb25lXCIpO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgLy9FbHNlIGRpc3BsYXkgbmljayBib3guXG4gICAgICAgIG5pY2tJbnB1dFtrIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcIm5hbWUtZmllbGQtZ29uZVwiKTtcbiAgICB9XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlQ2hhdFxubW9kdWxlLmV4cG9ydHMuY2hlY2sgPSBjaGVja05pY2s7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY3JlYXRlQ2hhdCgpIHtcblxuICAgIHZhciBmaW5kU3VibWl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zdWJtaXRcIik7XG4gICAgdmFyIGZpbmRUZXh0QXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1tZXNzXCIpO1xuICAgIHZhciBmaW5kTmlja1N1Ym1pdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWNjZXB0LW5hbWVcIik7XG4gICAgdmFyIGZpbmROaWNrQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZW50ZXItbmlja1wiKTtcbiAgICB2YXIgZmluZE5hbWVGaWVsZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIubmFtZS1maWVsZFwiKTtcbiAgICB2YXIgdGV4dENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIudGV4dC1jb250YWluZXJcIik7XG4gICAgdmFyIGNoZWNrTmljayA9IHJlcXVpcmUoXCIuL2NoZWNrTmlja1wiKTtcbiAgICB2YXIgY2hhdFNldHRpbmdzID0gcmVxdWlyZShcIi4vY2hhdFNldHRpbmdzXCIpO1xuICAgIHZhciBub1JlcGVhdENvdW50ZXIgPSAwO1xuXG4gICAgLy9DcmVhdGVzIG5ldyBzb2NrZXRcbiAgICB2YXIgc29ja2V0ID0gbmV3IFdlYlNvY2tldChcIndzOi8vdmhvc3QzLmxudS5zZToyMDA4MC9zb2NrZXQvXCIsIFwiY2hhdHRleHRcIik7XG5cbiAgICAvL0NoZWNrIGZvciBjaGF0IHNldHRpbmdzXG4gICAgY2hhdFNldHRpbmdzLmNoYW5nZSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaW5kU3VibWl0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNoZWNrTmljay5jaGVjaygpO1xuICAgICAgICBub1JlcGVhdENvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICAvL0dvZXMgYWhlYWQgYW5kIHNldCBhIHVzZXJuYW1lIHdpdGggdGhlIGhlbHAgZnJvbSB0aGUgbmljayBjaGFuZ2VyLlxuICAgIGZpbmROaWNrU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gKkhpZGUgYWZ0ZXIgdXNlIC0gc2VuZCB0byBsb2NhbCBzdG9yYWdlICAtPiAqSXNoXG4gICAgICAgIGlmIChmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGRhdGEudXNlcm5hbWUgPSBmaW5kTmlja0FyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcIm5pY2tuYW1lXCIsIGZpbmROaWNrQXJlYVtub1JlcGVhdENvdW50ZXIgLSAxXS52YWx1ZSk7XG4gICAgICAgICAgICBmaW5kTmFtZUZpZWxkW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJuYW1lLWZpZWxkLWdvbmVcIik7XG4gICAgICAgICAgICB0ZXh0Q29udGFpbmVyW25vUmVwZWF0Q291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJ0ZXh0LWNvbnRhaW5lci1hZnRlclwiKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9DaGVja3MgaWYgZXZlcnl0aGluZyBuZWNlc3NhcnkgaXMgdGhlcmUgZm9yIGEgbWVzc2FnZS5cbiAgICBmaW5kU3VibWl0W25vUmVwZWF0Q291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS5uaWNrbmFtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgZGF0YS51c2VybmFtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwibmlja25hbWVcIik7XG4gICAgICAgICAgICBkYXRhLmRhdGEgPSBmaW5kVGV4dEFyZWFbbm9SZXBlYXRDb3VudGVyIC0gMV0udmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vVGhlIGtleXMgYW5kIHZhbHVlcyBuZWVkZWQgZm9yIGEgbWVzc2FnZS5cbiAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgdHlwZTogXCJtZXNzYWdlXCIsXG4gICAgICAgIGRhdGE6IFwiXCIsXG4gICAgICAgIHVzZXJuYW1lOiBcIlwiLFxuICAgICAgICBjaGFubmVsOiBcIlwiLFxuICAgICAgICBrZXk6IFwiZURCRTc2ZGVVN0wwSDltRUJneFVLVlIwVkNucTBYQmRcIixcbiAgICAgICAgZGlkVXNlclNlbmQ6IFwidXNlclNlbnRcIlxuICAgIH07XG5cbiAgICAvL09wZW4gc29ja2VyXG4gICAgc29ja2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJvcGVuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFN1Ym1pdC5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9DaGVja3MgYWdhaW4gZm9yIG5pY2suXG4gICAgICAgIGZpbmRTdWJtaXRbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgIT09IFwiXCIgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAhPT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgLy8gU2VuZCBtZXNzYWdlXG4gICAgICAgICAgICAgICAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgIGZpbmRUZXh0QXJlYVtjb3VudGVyIC0gMV0udmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvL0VuYWJsZSBvbiBlbnRlciBwcmVzcyBzZW5kaW5nLlxuICAgICAgICBmaW5kVGV4dEFyZWFbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgZmluZFN1Ym1pdFtjb3VudGVyIC0gMV0uY2xpY2soKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy9XaGVuIHNlbnQsIHJlbmRlciB0aGUgZm9sbG93aW5nIHRvIHRoZSB1c2VyIHRleHQgd2luZG93LlxuICAgIHNvY2tldC5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgcFRhZ1VzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiUFwiKTtcbiAgICAgICAgdmFyIHBUYWdNZXNzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIlBcIik7XG4gICAgICAgIHZhciBkaXZUYWdUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcbiAgICAgICAgdmFyIGlzTWUgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRpZFVzZXJTZW5kO1xuICAgICAgICB2YXIgY2hhdERhdGEgPSBKU09OLnBhcnNlKGV2ZW50LmRhdGEpLmRhdGE7XG4gICAgICAgIHZhciBjaGF0VXNlciA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSkudXNlcm5hbWU7XG4gICAgICAgIHZhciBjcmVhdGVUZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hhdERhdGEpO1xuICAgICAgICB2YXIgY3JlYXRlVXNlciA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoYXRVc2VyKTtcbiAgICAgICAgcFRhZ1VzZXIuYXBwZW5kQ2hpbGQoY3JlYXRlVXNlcik7XG4gICAgICAgIHBUYWdNZXNzLmFwcGVuZENoaWxkKGNyZWF0ZVRleHQpO1xuICAgICAgICBkaXZUYWdUZXh0LmFwcGVuZENoaWxkKHBUYWdVc2VyKTtcbiAgICAgICAgZGl2VGFnVGV4dC5hcHBlbmRDaGlsZChwVGFnTWVzcyk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZXh0Q29udGFpbmVyLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoY2hhdFVzZXIgIT09IG51bGwgJiYgY2hhdERhdGEgIT09IHVuZGVmaW5lZCAmJiBjaGF0RGF0YSAhPT0gXCJcIikge1xuXG4gICAgICAgICAgICAgICAgLy9JZiBpdCB3YXMgc2VudCBieSB0aGUgdXNlciAtIHB1dCBpdCBvbiB0aGUgdXNlciBzaWRlIG9mIHRoZSBjaGF0LlxuICAgICAgICAgICAgICAgIGlmIChjaGF0VXNlciA9PT0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJuaWNrbmFtZVwiKSAmJiBpc01lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2VGFnVGV4dC5jbGFzc0xpc3QuYWRkKFwidXNlci1zZW50XCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQXBwZW5kIHRoZSBlbGVtZW50cyBhYm92ZS5cbiAgICAgICAgICAgICAgICB0ZXh0Q29udGFpbmVyW2ldLmFwcGVuZENoaWxkKGRpdlRhZ1RleHQpO1xuXG4gICAgICAgICAgICAgICAgLy9TY3JvbGwgdG8gYm90dG9tLlxuICAgICAgICAgICAgICAgIHRleHRDb250YWluZXJbaV0uc2Nyb2xsVG9wID0gdGV4dENvbnRhaW5lcltpXS5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG4vL09mZiB0byByZW5kZXJXaW5kb3dcbm1vZHVsZS5leHBvcnRzLmNoYXQgPSBjcmVhdGVDaGF0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNvbG9yU2NoZW1lZXIoKSB7XG5cbiAgICAvL0dldHMgdGhlIHRlbXBsYXRlXG4gICAgdmFyIGxvYWRTY2hlbWUgPSByZXF1aXJlKFwiLi9sb2FkU2NoZW1lXCIpO1xuICAgIGxvYWRTY2hlbWUubG9hZCgpO1xuXG4gICAgLy9HZXRzIHRoZSBpbnB1dCB0YWdzIGhleC1jb2Rlc1xuICAgIHZhciBmZXRjaENvbG9yID0gcmVxdWlyZShcIi4vZmV0Y2hDb2xvclwiKTtcbiAgICBmZXRjaENvbG9yLmZldGNoKCk7XG5cbiAgICAvL0dldHMgaGV4LWNvZGUgYW5kIHN0eWxpbmcgZm9yIHRoZSBmb250LlxuICAgIHZhciBzZXRGb250RmFtaWx5ID0gcmVxdWlyZShcIi4vc2V0Rm9udEZhbWlseVwiKTtcbiAgICBzZXRGb250RmFtaWx5LnNldCgpO1xuXG59XG5cbi8vT2ZmIHRvIHJlbmRlcldpbmRvd1xubW9kdWxlLmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGNvbG9yU2NoZW1lZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBPYnRhaW5zIHRoZSBjb2xvcnMgZnJvbSBpbnB1dCBhbmQgY2hlY2tzIGZvciBlcnJvcnMuXG4gKi9cbmZ1bmN0aW9uIGZldGNoQ29sb3IoKSB7XG4gICAgdmFyIGhleENvbnRhaW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIG5ld0NvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBoZXhDb250YWluLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgaGV4SW4gPSBoZXhDb250YWluW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNvbG9yLXJvdyBpbnB1dFwiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBoZXhJbi5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIG5ld0NvdW50ZXIgKz0gMTtcblxuICAgICAgICBoZXhJbltpXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNhdmVUYXJnZXQgPSB0aGlzLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgc2F2ZVRhcmdldCA9IHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uY2hpbGRyZW5bMF07XG5cbiAgICAgICAgICAgICAgICAvL1NlbGVjdGlvbiBpcyB0aGUgY3VycmVudCBpbnB1dCAodGhpcykuXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc2V0Qmcoc2VsZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24gPT09IGhleEluWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzBdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleEluWzBdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvbiA9PT0gaGV4SW5bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuY2hpbGRyZW5bMV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gaGV4SW5bMV0udmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uID09PSBoZXhJblsyXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBoZXhJblsyXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb24gPT09IGhleEluWzNdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LmNoaWxkcmVuWzJdLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGhleEluWzNdLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA2ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSdzIHNpeCBsZXR0ZXJzIGFuZCBubyBoYXNodGFnLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgc2V0QmcodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID09PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgPT09IFwiI1wiKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSdzIDYgbGV0dGVycyArIGEgaGFzaHRhZyAtIHByb2NlZWQgYXMgbm9ybWFsLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bMF0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgc2V0QmcodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmFsdWUubGVuZ3RoID49IDcgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL0lmIHRoZXJlJ3MgNyBvciBtb3JlIGxldHRlcnMgKE1vcmUgc2hvdWxkIGJlIGltcG9zc2libGUpIC0gdGhlbiByZW1vdmUgdGhhdCBsYXN0IGFuZCBhZGQgYSBoYXNoLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlLnNsaWNlKDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0QmcodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9DaGVjayBpZiBlbnRlcmVkIHRleHQgaXMgdmFsaWQgaGV4LlxuICAgICAgICAgICAgICAgIHZhciByZWcgPSAvXiMoW0EtRmEtZjAtOV17Nn18W0EtRmEtZjAtOV17M30pJC87XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDcpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL1NldHMgY29sb3JzIG9uIGlucHV0cyBkZXBlbmRpbmcgb24gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZWcudGVzdCh0aGlzLnZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4YjMwMzBcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjNTlBRTM3XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy52YWx1ZS5sZW5ndGggPCA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuLy9PZmYgdG8gY29sb3JTY2hlbWVlclxubW9kdWxlLmV4cG9ydHMuZmV0Y2ggPSBmZXRjaENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGxvYWRTY2hlbWUoKSB7XG4gICAgdmFyIGZpbmRTcXVhcmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmRlc2lnbi1zcXVhcmVcIik7XG4gICAgdmFyIHRlbXBPbmUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Rlc2lnbi1vbmVcIik7XG4gICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wT25lLmNvbnRlbnQsIHRydWUpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICB2YXIgc2V0UG9pbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJlZm9yZS10aGlzXCIpO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGZpbmRTcXVhcmUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIC8vQXBwZW5kcyB0aGUgdGVtcGxhdGVcbiAgICBmaW5kU3F1YXJlW2NvdW50ZXIgLSAxXS5pbnNlcnRCZWZvcmUoY2xvbmUsIHNldFBvaW50W2NvdW50ZXIgLSAxXSk7XG5cbn1cblxuLy9PZmYgdG8gY29sb3JTY2hlbWVlclxubW9kdWxlLmV4cG9ydHMubG9hZCA9IGxvYWRTY2hlbWU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0Rm9udEZhbWlseSgpIHtcbiAgICB2YXIgaGV4Q29udGFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIub3Zlci1zcXVhcmVcIik7XG4gICAgdmFyIHRlbXBsYXRlc0hlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaGVhZGVyLW9uZSBpbnB1dFwiKTtcbiAgICB2YXIgc3dpdGNoQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zd2l0Y2gtY29udGFpbmVyXCIpO1xuICAgIHZhciBzd2l0Y2hDb250YWluZXJCb2xkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5zd2l0Y2gtY29udGFpbmVyLWJvbGRcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBoZXhDb250YWluLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICB9XG5cbiAgICB2YXIgaGV4SW4gPSBoZXhDb250YWluW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yKFwiaW5wdXRcIik7XG5cbiAgICAvL0V4YW1wbGUgdGV4dFxuICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0udmFsdWUgPSBcIkxPUkVNIElQU1VNXCI7XG5cbiAgICBoZXhJbi5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzYXZlVGFyZ2V0ID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgICAgICAgICAgLy9HZXRzIGEgIyBpbiB0aGVyZSAtIHRvIGRlY2xhcmUgdGhlIGlucHV0IGFzIGhleC4gLT4gQWRkIGNvbG9yIHRvIHRleHQuXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZS5sZW5ndGggPT09IDYgJiYgdGhpcy52YWx1ZS5zbGljZSgwLCAxKSAhPT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gXCIjXCIgKyB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuY29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNyAmJiB0aGlzLnZhbHVlLnNsaWNlKDAsIDEpID09PSBcIiNcIikge1xuICAgICAgICAgICAgICAgIHNhdmVUYXJnZXQuc3R5bGUuY29sb3IgPSB0aGlzLnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA+PSA3ICYmIHRoaXMudmFsdWUuc2xpY2UoMCwgMSkgIT09IFwiI1wiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFwiI1wiICsgdGhpcy52YWx1ZS5zbGljZSgwLCAtMSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vQ2hlY2sgaWYgZW50ZXJlZCB0ZXh0IGlzIHZhbGlkIGhleC5cbiAgICAgICAgICAgIHZhciByZWcgPSAvXiMoW0EtRmEtZjAtOV17Nn18W0EtRmEtZjAtOV17M30pJC87XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA9PT0gNykge1xuXG4gICAgICAgICAgICAgICAgLy9TZXRzIGNvbG9yIHRvIGlucHV0IGRlcGVuZGluZyBvbiB2YWx1ZVxuICAgICAgICAgICAgICAgIGlmICghcmVnLnRlc3QodGhpcy52YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiNhZTM3MzdcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzU5QUUzN1wiO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZhbHVlLmxlbmd0aCA8IDcpIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJ3aGl0ZVwiO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIC8vU3dpdGNoIGZvciBzZXJpZlxuICAgIHN3aXRjaENvbnRhaW5lcltjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzKTtcbiAgICAgICAgaWYgKHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmNvbnRhaW5zKFwic2VyaWZcIikpIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LnJlbW92ZShcInNlcmlmXCIpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRlbXBsYXRlc0hlYWRlcltjb3VudGVyIC0gMV0uY2xhc3NMaXN0LmFkZChcInNlcmlmXCIpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIyNXB4XCI7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vU3dpdGNoIGZvciBib2xkXG4gICAgc3dpdGNoQ29udGFpbmVyQm9sZFtjb3VudGVyIC0gMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGVtcGxhdGVzSGVhZGVyW2NvdW50ZXIgLSAxXS5jbGFzc0xpc3QuY29udGFpbnMoXCJib2xkXCIpKSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5yZW1vdmUoXCJib2xkXCIpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIyNXB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZW1wbGF0ZXNIZWFkZXJbY291bnRlciAtIDFdLmNsYXNzTGlzdC5hZGQoXCJib2xkXCIpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEVsZW1lbnRDaGlsZC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIwcHhcIjtcbiAgICAgICAgfVxuICAgIH0pO1xuXG59XG5cbi8vT2ZmIHRvIGNvbG9yU2NoZW1lZXJcbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldEZvbnRGYW1pbHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gY2FyZFJhbmRvbWl6ZXIoKSB7XG4gICAgdmFyIHdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGogPSAwO1xuICAgIHZhciBjYXJkQXJyID0gW107XG4gICAgdmFyIG5ld051bWJlciA9IDA7XG4gICAgdmFyIG5ld0NvdW50ZXIgPSAwO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGogPSAwOyBqIDwgMjsgaiArPSAxKSB7XG4gICAgICAgICAgICBjYXJkQXJyLnB1c2goaSArIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9GaXNoZXIgeWF0ZXMgc2h1ZmZsZSBmdW5jdGlvblxuICAgIGZ1bmN0aW9uIHNodWZmbGUoY2FyZEFycikge1xuICAgICAgICB2YXIgbSA9IGNhcmRBcnIubGVuZ3RoO1xuICAgICAgICB2YXIgdDtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgLy8gV2hpbGUgdGhlcmUgcmVtYWluIGVsZW1lbnRzIHRvIHNodWZmbGXigKZcbiAgICAgICAgd2hpbGUgKG0pIHtcblxuICAgICAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW504oCmXG4gICAgICAgICAgICBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG0gLT0gMSkpO1xuXG4gICAgICAgICAgICAvLyBBbmQgc3dhcCBpdCB3aXRoIHRoZSBjdXJyZW50IGVsZW1lbnQuXG4gICAgICAgICAgICB0ID0gY2FyZEFyclttXTtcbiAgICAgICAgICAgIGNhcmRBcnJbbV0gPSBjYXJkQXJyW2ldO1xuICAgICAgICAgICAgY2FyZEFycltpXSA9IHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2FyZEFycjtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBuZXdDb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmFuZG9tQW5kU2V0KCkge1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHZhciB3aW5kb3dDb3VudCA9IDA7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHdpbmRvd0NvdW50ICs9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvL1NlbGVjdHMgYWxsIHRoZSBjYXJkc1xuICAgICAgICB2YXIgY2FyZHNJbldpbmRvd3MgPSB3aW5kb3dzW3dpbmRvd0NvdW50IC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuXG4gICAgICAgIC8vRm9yIGVhIHZhbHVlIGluIGFycmF5IGFkZHMgY2FyZCBudW1iZXIgdG8gY2xhc3MuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCAxNjsgaSArPSAxKSB7XG4gICAgICAgICAgICBuZXdOdW1iZXIgPSBzaHVmZmxlKGNhcmRBcnIpLnNwbGljZSgwLCAxKTtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIGNhcmRzSW5XaW5kb3dzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQobmV3TnVtYmVyKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmFuZG9tQW5kU2V0KCk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5ydW4gPSBjYXJkUmFuZG9taXplcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIEdhbWVsb2dpYyAoSXMgaXQgcGFpcj8gV2hhdCBpZiBpdCBpc24ndD8gRXRjLilcbiAqL1xuZnVuY3Rpb24gY2hlY2tQYWlyKCkge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIG5ld0FyciA9IFtdO1xuICAgIHZhciB0YXJnZXRBcnIgPSBbXTtcbiAgICB2YXIgc2F2ZVRhcmdldCA9IFtdO1xuICAgIHZhciBjbGlja3MgPSAwO1xuICAgIHZhciB0cmllcyA9IDA7XG4gICAgdmFyIHBhaXJDb3VudGVyID0gMDtcbiAgICB2YXIgd2luQ2hlY2sgPSByZXF1aXJlKFwiLi93aW5DaGVja1wiKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBjb250YWluZXIubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIHZhciBjYXJkc0luV2luZG93ID0gY29udGFpbmVyW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG4gICAgdmFyIGNvdW50ZXJJbldpbmRvdyA9IGNvbnRhaW5lcltjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiLmNsaWNrQ291bnRlclwiKTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRW50ZXIoKSB7XG4gICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgICAgdGhpcy5jbGljaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsaXN0ZW5lcihldmVudCkge1xuXG4gICAgICAgIGlmIChjbGlja3MgPCAyKSB7XG5cbiAgICAgICAgICAgIGNsaWNrcyArPSAxO1xuXG4gICAgICAgICAgICB0cmllcyArPSAxO1xuXG4gICAgICAgICAgICB2YXIgZ2V0V2luZG93ID0gdGhpcy5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUaGVtZSA9IGdldFdpbmRvdy5nZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIpO1xuXG4gICAgICAgICAgICAvLyBpZiAobG9jYWxTdG9yYWdlLnRoZW1lICE9PSBcIlwiKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9cIiArIGN1cnJlbnRUaGVtZSArIFwiL1wiICsgdGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSArIFwiLnBuZycpXCI7XG5cbiAgICAgICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgLy9Iw6RyIHNrYSBtYW4ga3VubmEgw6RuZHJhIHZpbGtlbiBiaWxkZW4gc2thIHZhcmEuXG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnIubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyci5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0QXJyLnB1c2godGhpcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0YXJnZXRBcnJbMF0gPT09IHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEFyciA9IHRhcmdldEFyci5zcGxpY2UoMCwgMSk7XG4gICAgICAgICAgICAgICAgY2xpY2tzID0gY2xpY2tzIC09IDE7XG4gICAgICAgICAgICAgICAgcGFpckNvdW50ZXIgPSBwYWlyQ291bnRlciAtPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb3VudGVySW5XaW5kb3cudGV4dENvbnRlbnQgPSB0cmllcztcblxuICAgICAgICAgICAgaWYgKHRhcmdldEFyclswXSAhPT0gdGFyZ2V0QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0Fyci5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0Fyci5wdXNoKHRoaXMucGFyZW50RWxlbWVudC5jbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdBcnIubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0QXJyWzBdICYmIHRhcmdldEFyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3QXJyLnB1c2godGhpcy5wYXJlbnRFbGVtZW50LmNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0LnB1c2godGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5ld0Fyci5sZW5ndGggPj0gMikge1xuICAgICAgICAgICAgICAgICAgICBuZXdBcnIubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5sZW5ndGggPSAwO1xuICAgICAgICAgICAgICAgICAgICBuZXdBcnIucHVzaCh0aGlzLnBhcmVudEVsZW1lbnQuY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldC5wdXNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChuZXdBcnJbMF0gJiYgbmV3QXJyWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdBcnJbMF0gPT09IG5ld0FyclsxXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzFdLmNsYXNzTGlzdC5hZGQoXCJhUGFpclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlVGFyZ2V0WzBdLnNldEF0dHJpYnV0ZShcInRhYmluZGV4XCIsIFwiMFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja3MgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhaXJDb3VudGVyICs9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhaXJDb3VudGVyID49IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luQ2hlY2sud2luKGNvdW50ZXJJbldpbmRvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB2YXIgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFswXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvXCIgKyBjdXJyZW50VGhlbWUgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY3VycmVudFRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVUYXJnZXRbMF0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL3BsYWluLzAucG5nJylcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZVRhcmdldFsxXS5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBcInVybCgnLi4vaW1hZ2UvcGxhaW4vMC5wbmcnKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrcyA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkc0luV2luZG93Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNhcmRzSW5XaW5kb3dbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGNoZWNrRW50ZXIpO1xuICAgICAgICBjYXJkc0luV2luZG93W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsaXN0ZW5lcik7XG4gICAgfVxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLmNoZWNrID0gY2hlY2tQYWlyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIGNyZWF0ZU1lbW9yeSgpIHtcblxuICAgIC8vR2V0cyB0ZW1wbGF0ZVxuICAgIHZhciBsb2FkaW5nQ2FyZHMgPSByZXF1aXJlKFwiLi9sb2FkaW5nQ2FyZHNcIik7XG4gICAgbG9hZGluZ0NhcmRzLmxvYWQoKTtcblxuICAgIC8vSW1wbGVtZW50cyB0aGUgdGhlbWUgY2hhbmdlclxuICAgIHZhciB0aGVtZUNoYW5nZXIgPSByZXF1aXJlKFwiLi90aGVtZUNoYW5nZXJcIik7XG4gICAgdGhlbWVDaGFuZ2VyLmNoYW5nZSgpO1xuXG4gICAgLy9HaXZlcyBjYXJkIGltZyBkZXBlbmRpbmcgb24gY2xhc3MgdmFsdWVcbiAgICB2YXIgc2V0Q2FyZHMgPSByZXF1aXJlKFwiLi9zZXRDYXJkc1wiKTtcbiAgICBzZXRDYXJkcy5zZXQoKTtcblxuICAgIC8vUmFuZG9taXppbmcgY2FyZHNcbiAgICB2YXIgY2FyZFJhbmRvbWl6ZXIgPSByZXF1aXJlKFwiLi9jYXJkUmFuZG9taXplclwiKTtcbiAgICBjYXJkUmFuZG9taXplci5ydW4oKTtcblxuICAgIC8vVGhlIGdhbWUgbG9naWMuXG4gICAgdmFyIGNoZWNrUGFpciA9IHJlcXVpcmUoXCIuL2NoZWNrUGFpclwiKTtcbiAgICBjaGVja1BhaXIuY2hlY2soKTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cy5jcmVhdGUgPSBjcmVhdGVNZW1vcnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogR2V0cyB0aGUgbWVtb3J5IHRlbXBsYXRlXG4gKi9cbmZ1bmN0aW9uIGxvYWRpbmdDYXJkcygpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciB3aW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIik7XG4gICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW1vcnktdGVtcGxhdGVcIik7XG4gICAgdmFyIGNsb25lID0gZG9jdW1lbnQuaW1wb3J0Tm9kZSh0ZW1wbGF0ZS5jb250ZW50LCB0cnVlKTtcbiAgICB2YXIgY2xpY2tDb3VudGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jbGlja0NvdW50ZXJcIik7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgd2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb3VudGVyICs9IDE7XG4gICAgfVxuXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi53aW5kb3dcIilbY291bnRlciAtIDFdLmluc2VydEJlZm9yZShjbG9uZSwgY2xpY2tDb3VudGVyW2NvdW50ZXIgLSAxXSk7XG5cbn1cblxuLy9PZmYgdG8gY3JlYXRlTWVtb3J5XG5tb2R1bGUuZXhwb3J0cy5sb2FkID0gbG9hZGluZ0NhcmRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogR2V0cyB0aGVtZVxuICogR2l2ZXMgZWxlbWVudCBhcHByb3ByaWF0ZSBhbmQgbWF0Y2hpbmcgaW1hZ2VzIHRoYXQgcmVwcmVzZW50cyBjYXJkcy5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FyZHMoKSB7XG4gICAgdmFyIGNhcmRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkXCIpO1xuICAgIHZhciBtZW1XaW5kb3dzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jYXJkLWNvbnRhaW5lclwiKTtcbiAgICB2YXIgY291bnRlciA9IDA7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsYXN0VGhlbWUgPSBcIlwiO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG1lbVdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIGlmIChsb2NhbFN0b3JhZ2UudGhlbWUgIT09IFwiXCIpIHtcbiAgICAgICAgbGFzdFRoZW1lID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0aGVtZVwiKTtcbiAgICAgICAgbWVtV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIGxhc3RUaGVtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbWVtV2luZG93c1tjb3VudGVyIC0gMV0ucGFyZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXRoZW1lXCIsIFwicGxhaW5cIik7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGNhcmRzLmxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgLy9JZiB0aGVyZSdzIG5vIGltYWdlIC0gc2V0IHRoZSBpbWFnZXMgd2l0aCB0aGUgbGFzdCB1c2VkIHRoZW1lLlxuICAgICAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoY2FyZHNbaV0pLmdldFByb3BlcnR5VmFsdWUoXCJiYWNrZ3JvdW5kLWltYWdlXCIpID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZS50aGVtZSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGxhc3RUaGVtZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidGhlbWVcIik7XG4gICAgICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgbGFzdFRoZW1lICsgXCIvMC5wbmcnKVwiO1xuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vSWYgdGhlcmUncyBubyB0aGVtZSwgdGhlbiB1c2UgdGhlIHBsYWluIHRoZW1lLlxuICAgICAgICAgICAgICAgIGNhcmRzW2ldLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKCcuLi9pbWFnZS9wbGFpbi8wLnBuZycpXCI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG4vL09mZiB0byBjcmVhdGVNZW1vcnlcbm1vZHVsZS5leHBvcnRzLnNldCA9IHNldENhcmRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWFrZXMgaXQgYXZhaWxhYmxlIGZvciB0aGUgdXNlciB0byBjaGFuZ2UgdGhlIHRoZW1lIG9mIHRoZSBtZW1vcnkuXG4gKi9cbmZ1bmN0aW9uIHRoZW1lQ2hhbmdlcigpIHtcbiAgICB2YXIgaGFzQ2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRoZW1lLXNlbGVjdG9yXCIpO1xuICAgIHZhciBjb3VudGVyID0gMDtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKGkgPSAwOyBpIDwgaGFzQ2FyZHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgY291bnRlciArPSAxO1xuICAgIH1cblxuICAgIC8vU2VsZWN0IGFsbCBjYXJkcy5cbiAgICB2YXIgY2FyZHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmQtY29udGFpbmVyXCIpW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcmRcIik7XG5cbiAgICAvL0NoZWNrIGFuZCBnZXQgKGlmKSB0aGVtZVxuICAgIGZ1bmN0aW9uIHdoYXRDYXJkcyhjb2xvcikge1xuXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwidGhlbWVcIiwgY29sb3IpO1xuXG4gICAgICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtdGhlbWVcIiwgY29sb3IpO1xuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBjYXJkcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2FyZHNbaV0uc3R5bGUuYmFja2dyb3VuZEltYWdlID0gXCJ1cmwoJy4uL2ltYWdlL1wiICsgY29sb3IgKyBcIi8wLnBuZycpXCI7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMF0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGF0Q2FyZHMoXCJwbGFpblwiKTtcbiAgICB9KTtcblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbMV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGF0Q2FyZHMoXCJyZWRcIik7XG4gICAgfSk7XG5cbiAgICBoYXNDYXJkc1tjb3VudGVyIC0gMV0ucXVlcnlTZWxlY3RvckFsbChcIi5waWNrZXItY29udGFpbmVyXCIpWzJdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgd2hhdENhcmRzKFwiYmx1ZVwiKTtcbiAgICB9KTtcblxuICAgIGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5xdWVyeVNlbGVjdG9yQWxsKFwiLnBpY2tlci1jb250YWluZXJcIilbM10uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB3aGF0Q2FyZHMoXCJncmVlblwiKTtcbiAgICB9KTtcblxuICAgIHZhciB0aGVtZUJ1dHRvbiA9IGhhc0NhcmRzW2NvdW50ZXIgLSAxXS5wYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkO1xuXG4gICAgZnVuY3Rpb24gYnJpbmdUaGVtZShldmVudCkge1xuICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LnRvZ2dsZShcIm5pY2stY29nLXJvdGF0ZVwiKTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsxXS5jbGFzc0xpc3QudG9nZ2xlKFwidGhlbWUtZmllbGQtZ29uZVwiKTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5jaGlsZHJlblsyXS5jbGFzc0xpc3QudG9nZ2xlKFwiY2FyZC1jb250YWluZXItYWZ0ZXJcIik7XG4gICAgfVxuXG4gICAgdGhlbWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJyaW5nVGhlbWUpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMuY2hhbmdlID0gdGhlbWVDaGFuZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogQWRkcyBhIHdpbm5pbmcgbWVzc2FnZSB0byB0aGUgdGhlIHNwZWNpZmljIHdpbmRvdyAoQ3VycmVudCB3aW5kb3cpLlxuICogQHBhcmFtIGN1cnJlbnRXaW5kb3dcbiAqL1xuZnVuY3Rpb24gd2luQ2hlY2soY3VycmVudFdpbmRvdykge1xuICAgIHZhciB5b3VXaW4gPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIllPVSBXSU4hXCIpO1xuICAgIHZhciBicmVha2luZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJCUlwiKTtcbiAgICB2YXIgcHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJQXCIpO1xuICAgIHB0YWcuYXBwZW5kQ2hpbGQoeW91V2luKTtcbiAgICBwdGFnLmNsYXNzTGlzdC5hZGQoXCJ3aW5uaW5nLW1lc3NhZ2VcIik7XG4gICAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChicmVha2luZyk7XG4gICAgY3VycmVudFdpbmRvdy5hcHBlbmRDaGlsZChwdGFnKTtcbiAgICBjdXJyZW50V2luZG93LmNsYXNzTGlzdC5hZGQoXCJwcmVzZW50LWNsaWNrXCIpO1xufVxuXG4vL09mZiB0byBjaGVja1BhaXJcbm1vZHVsZS5leHBvcnRzLndpbiA9IHdpbkNoZWNrO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWFrZXMgdGhlIHdpbmRvdyBkcmFnZ2FibGUuXG4gKi9cbmZ1bmN0aW9uIG1vdmFibGUoKSB7XG5cbiAgICB2YXIgZmluZFdpbmRvd3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLndpbmRvd1wiKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXJzKCkge1xuXG4gICAgICAgIC8vTG9vayBmb3IgdGhlIHdpbmRvdyBhbmQgYWRkIG1vdXNlZG93biArIGFuZCBtb3VzZXVwXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBmaW5kV2luZG93cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY291bnRlciArPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgZmluZFdpbmRvd3NbY291bnRlciAtIDFdLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgbW91c2VEb3duLCBmYWxzZSk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIG1vdXNlVXAsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvL0RlY2xhcmVzIHZhcmlhYmxlcyB1c2VkIGZvciBsb2NhdGluZyBwb2ludGVyLlxuICAgIHZhciBhVmFyWSA9IDA7XG4gICAgdmFyIGFWYXJYID0gMDtcbiAgICB2YXIgc2F2ZVRhcmdldCA9IDA7XG5cbiAgICBmdW5jdGlvbiBtb3VzZURvd24oZXZlbnQpIHtcblxuICAgICAgICAvL0NoZWNrcyBpZiB0aGUgdGFyZ2V0IGhhcyB0aGUgY2xhc3NuYW1lIFwidG9wXCIuXG4gICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NOYW1lLnNsaWNlKDAsIDMpID09PSBcInRvcFwiKSB7XG5cbiAgICAgICAgICAgIC8vU2F2ZXMgdGhlIGN1cnJlbnQgY29yZHMgLSBhbmQgdGhlIGN1cnJlbnQgdGFyZ2V0LlxuICAgICAgICAgICAgYVZhclkgPSBldmVudC5vZmZzZXRZO1xuICAgICAgICAgICAgYVZhclggPSBldmVudC5vZmZzZXRYO1xuICAgICAgICAgICAgc2F2ZVRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGRpdk1vdmUsIHRydWUpO1xuXG4gICAgICAgICAgICAvL0dpdmVzIHRoZSBjdXJyZW50IHRhcmdldCBhICdwcmV0dHknIGFuZCBwcmFjdGljYWwgb3BhY2l0eS5cbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMC44NTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1vdXNlVXAoKSB7XG5cbiAgICAgICAgLy9TZXRzIHRoZSBvcGFjaXR5IHRvIDEgd2hlbiB0aGUgdXNlciBkcm9wcyB0aGUgd2luZG93LlxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZpbmRXaW5kb3dzW2ldLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgZGl2TW92ZSwgdHJ1ZSk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkaXZNb3ZlKGV2ZW50KSB7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHdpbmRvdyBzaG91bGQgbW92ZSAtIHNldHMgYm91bmRpbmctYm94IChmb3IgYm90aCB4IGFuZCB5KS5cbiAgICAgICAgaWYgKGV2ZW50LnkgLSBhVmFyWSA8IDApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LnkgLSBhVmFyWSk7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUudG9wID0gXCIwcHhcIjtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudC55IC0gYVZhclkgPiB3aW5kb3cuaW5uZXJIZWlnaHQgLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCAqIDAuNSkge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICogMC41ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2F2ZVRhcmdldC5wYXJlbnRFbGVtZW50LnN0eWxlLnRvcCA9IGV2ZW50LnkgLSBhVmFyWSArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC54IC0gYVZhclggPCAwKSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IFwiMHB4XCI7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQueCAtIGFWYXJYID4gd2luZG93LmlubmVyV2lkdGggLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKiAwLjUpIHtcbiAgICAgICAgICAgIHNhdmVUYXJnZXQucGFyZW50RWxlbWVudC5zdHlsZS5sZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLSBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKyBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggKiAwLjUgKyBcInB4XCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzYXZlVGFyZ2V0LnBhcmVudEVsZW1lbnQuc3R5bGUubGVmdCA9IGV2ZW50LnggLSBhVmFyWCArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXJzKCk7XG5cbn1cblxuLy9PZmYgdG8gcmVuZGVyV2luZG93XG5tb2R1bGUuZXhwb3J0cy5tb3ZlID0gbW92YWJsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBwcmVsb2FkaW5nKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW1nMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nNSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nNiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nNyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nOCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nOSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAgIGltZzEuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzAucG5nXCI7XG4gICAgICAgIGltZzIuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzEucG5nXCI7XG4gICAgICAgIGltZzMuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzIucG5nXCI7XG4gICAgICAgIGltZzQuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzMucG5nXCI7XG4gICAgICAgIGltZzUuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzQucG5nXCI7XG4gICAgICAgIGltZzYuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzUucG5nXCI7XG4gICAgICAgIGltZzcuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzYucG5nXCI7XG4gICAgICAgIGltZzguc3JjID0gXCIuLi9pbWFnZS9ibHVlLzcucG5nXCI7XG4gICAgICAgIGltZzkuc3JjID0gXCIuLi9pbWFnZS9ibHVlLzgucG5nXCI7XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGltZzEwID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxMSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTIgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzEzID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNCA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTUgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzE2ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcxNyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMTggPSBuZXcgSW1hZ2UoKTtcblxuICAgICAgICBpbWcxMC5zcmMgPSBcIi4uL2ltYWdlL3JlZC8wLnBuZ1wiO1xuICAgICAgICBpbWcxMS5zcmMgPSBcIi4uL2ltYWdlL3JlZC8xLnBuZ1wiO1xuICAgICAgICBpbWcxMi5zcmMgPSBcIi4uL2ltYWdlL3JlZC8yLnBuZ1wiO1xuICAgICAgICBpbWcxMy5zcmMgPSBcIi4uL2ltYWdlL3JlZC8zLnBuZ1wiO1xuICAgICAgICBpbWcxNC5zcmMgPSBcIi4uL2ltYWdlL3JlZC80LnBuZ1wiO1xuICAgICAgICBpbWcxNS5zcmMgPSBcIi4uL2ltYWdlL3JlZC81LnBuZ1wiO1xuICAgICAgICBpbWcxNi5zcmMgPSBcIi4uL2ltYWdlL3JlZC82LnBuZ1wiO1xuICAgICAgICBpbWcxNy5zcmMgPSBcIi4uL2ltYWdlL3JlZC83LnBuZ1wiO1xuICAgICAgICBpbWcxOC5zcmMgPSBcIi4uL2ltYWdlL3JlZC84LnBuZ1wiO1xuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBpbWcxOSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjAgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzIxID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyMiA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjMgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI0ID0gbmV3IEltYWdlKCk7XG4gICAgICAgIHZhciBpbWcyNSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICB2YXIgaW1nMjYgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgdmFyIGltZzI3ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgdmFyIGltZzI4ID0gbmV3IEltYWdlKCk7XG5cbiAgICAgICAgaW1nMTkuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8wLnBuZ1wiO1xuICAgICAgICBpbWcyMC5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzEucG5nXCI7XG4gICAgICAgIGltZzIxLnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vMi5wbmdcIjtcbiAgICAgICAgaW1nMjIuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi8zLnBuZ1wiO1xuICAgICAgICBpbWcyMy5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzQucG5nXCI7XG4gICAgICAgIGltZzI0LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vNS5wbmdcIjtcbiAgICAgICAgaW1nMjUuc3JjID0gXCIuLi9pbWFnZS9ncmVlbi82LnBuZ1wiO1xuICAgICAgICBpbWcyNi5zcmMgPSBcIi4uL2ltYWdlL2dyZWVuLzcucG5nXCI7XG4gICAgICAgIGltZzI3LnNyYyA9IFwiLi4vaW1hZ2UvZ3JlZW4vOC5wbmdcIjtcblxuICAgICAgICBpbWcyOC5zcmMgPSBcIi4uL2ltYWdlL2ljb25zL2NvZ2dyZXkucG5nXCI7XG5cbiAgICB9KTtcblxufVxuXG4vL09mZiB0byBhcHBcbm1vZHVsZS5leHBvcnRzLmxvYWRpbmcgPSBwcmVsb2FkaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhbGwgd2luZG93cyByZWFkeSBmb3IgdXNlLlxuICovXG5mdW5jdGlvbiByZW5kZXJXaW5kb3coKSB7XG5cbiAgICB2YXIgbW92YWJsZSA9IHJlcXVpcmUoXCIuL21vdmFibGVcIik7XG4gICAgdmFyIHdpbmRvd0Rlc3Ryb3llciA9IHJlcXVpcmUoXCIuL3dpbmRvd0Rlc3Ryb3llclwiKTtcbiAgICB2YXIgY3JlYXRlTWVtb3J5ID0gcmVxdWlyZShcIi4vbWVtb3J5L2NyZWF0ZU1lbW9yeVwiKTtcbiAgICB2YXIgY3JlYXRlQ2hhdCA9IHJlcXVpcmUoXCIuL2NoYXQvY3JlYXRlQ2hhdFwiKTtcbiAgICB2YXIgY29sb3JTY2hlbWVlciA9IHJlcXVpcmUoXCIuL2NvbG9yU2NoZW1lZXIvY29sb3JTY2hlbWVlclwiKTtcbiAgICB2YXIgd2luZG93UGxhY2VtZW50ID0gcmVxdWlyZShcIi4vd2luZG93UGxhY2VtZW50XCIpO1xuICAgIHZhciBzZXRaID0gcmVxdWlyZShcIi4vc2V0WlwiKTtcblxuICAgIC8vQ2hlY2tzIGlmIHdoaWNoIG5hdi1idXR0b24gaXMgYmVpbmcgcHJlc3NlZC5cbiAgICBmdW5jdGlvbiBuYXZDbGljaygpIHtcbiAgICAgICAgdmFyIGZpbmROYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmljb24xXCIpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrTmF2KGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaW5kTmF2WzBdKSB7XG4gICAgICAgICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmluZE5hdlsxXSkge1xuICAgICAgICAgICAgICAgIHJlbmRlck1lbSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQgPT09IGZpbmROYXZbMl0pIHtcbiAgICAgICAgICAgICAgICByZW5kZXJTY2hlbWVlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZE5hdi5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgICAgICBmaW5kTmF2W2ldLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjaGVja05hdik7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgbmF2Q2xpY2soKTtcblxuICAgIC8vQ3JlYXRlcyBjaGF0IGluc3RhbmNlLlxuICAgIGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjaGF0LXRlbXBsYXRlXCIpO1xuICAgICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgICB2YXIgYmVmb3JlVGhpcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3JhcHBlci1oZXJvXCIpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5pbnNlcnRCZWZvcmUoY2xvbmUsIGJlZm9yZVRoaXMpO1xuXG4gICAgICAgIC8vaW5pdGlhbGl6ZXMgUGxhY2VtZW50LCBjaGF0LXBhcnQsIG1vdmFibGUtd2luZG93LCB6LWluZGV4LCBhYmxlIHRvIGRlc3Ryb3kgd2luZG93LlxuICAgICAgICB3aW5kb3dQbGFjZW1lbnQucGxhY2UoKTtcbiAgICAgICAgY3JlYXRlQ2hhdC5jaGF0KCk7XG4gICAgICAgIG1vdmFibGUubW92ZSgpO1xuICAgICAgICBzZXRaLnNldCgpO1xuICAgICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xuXG4gICAgfVxuXG4gICAgLy9DcmVhdGUgbWVtb3J5XG4gICAgZnVuY3Rpb24gcmVuZGVyTWVtKCkge1xuICAgICAgdmFyIHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN3aW5kb3ctdGVtcGxhdGVcIik7XG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XG5cbiAgICAgIC8vaW5pdGlhbGl6ZXMgUGxhY2VtZW50LCBjcmVhdGUtbWVtb3J5LCBtb3ZhYmxlLXdpbmRvdywgei1pbmRleCwgYWJsZSB0byBkZXN0cm95IHdpbmRvdy5cbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xuICAgICAgY3JlYXRlTWVtb3J5LmNyZWF0ZSgpO1xuICAgICAgbW92YWJsZS5tb3ZlKCk7XG4gICAgICBzZXRaLnNldCgpO1xuICAgICAgd2luZG93RGVzdHJveWVyLmRlc3Ryb3koKTtcbiAgfVxuXG4gICAgLy9DcmVhdGVzIFNjaGVtZWUgKFRoaXJkICdhcHAnKVxuICAgIGZ1bmN0aW9uIHJlbmRlclNjaGVtZWUoKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NjaGVtZWUtdGVtcGxhdGVcIik7XG4gICAgICB2YXIgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlLmNvbnRlbnQsIHRydWUpO1xuICAgICAgdmFyIGJlZm9yZVRoaXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLndyYXBwZXItaGVyb1wiKTtcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpLmluc2VydEJlZm9yZShjbG9uZSwgYmVmb3JlVGhpcyk7XG5cbiAgICAgIC8vaW5pdGlhbGl6ZXMgUGxhY2VtZW50LCBzY2hlbWVlci1pbml0LCBtb3ZhYmxlLXdpbmRvdywgei1pbmRleCwgYWJsZSB0byBkZXN0cm95IHdpbmRvdy5cbiAgICAgIHdpbmRvd1BsYWNlbWVudC5wbGFjZSgpO1xuICAgICAgY29sb3JTY2hlbWVlci5pbml0aWFsaXplKCk7XG4gICAgICBtb3ZhYmxlLm1vdmUoKTtcbiAgICAgIHNldFouc2V0KCk7XG4gICAgICB3aW5kb3dEZXN0cm95ZXIuZGVzdHJveSgpO1xuICB9XG5cbn1cblxuLy9PZmYgdG8gYXBwXG5tb2R1bGUuZXhwb3J0cy5yZW5kZXIgPSByZW5kZXJXaW5kb3c7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gc2V0WigpIHtcbiAgICB2YXIgd2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgIHZhciBuYXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnRhc2tiYXJcIik7XG4gICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbmV3QXJyID0gW107XG5cbiAgICBmdW5jdGlvbiBoaWdlc3RaKHRoZVdpbmRvd3MsIG5hdmluZykge1xuXG4gICAgICAgIHZhciBnbGFzc1NxdWFyZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhlV2luZG93cyk7XG4gICAgICAgIHZhciBoaWdoZXN0ID0gMDtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGdsYXNzU3F1YXJlLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICAvL0NoZWNrcyBhbGwgdGhlIHdpbmRvd3MgZm9yIHotaW5kZXhcbiAgICAgICAgICAgIHZhciB6aW5kZXggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShnbGFzc1NxdWFyZVtpXSkuZ2V0UHJvcGVydHlWYWx1ZShcInotaW5kZXhcIik7XG4gICAgICAgICAgICBpZiAoKHppbmRleCAhPT0gXCJhdXRvXCIpKSB7XG5cbiAgICAgICAgICAgICAgICAvL0lmIGl0J3MgdGhlIG5hdiAtIHRoZW4gYWRkIDIwMCB0byB0aGUgei1pbmRleCwgZWxzZSBqdXN0IG9uZSBmb3Igbm9ybWFsIHdpbmRvd3MuXG4gICAgICAgICAgICAgICAgaWYgKG5hdmluZykge1xuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0ID0gcGFyc2VJbnQoemluZGV4KSArIDIwMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0ID0gcGFyc2VJbnQoemluZGV4KSArIDE7XG5cbiAgICAgICAgICAgICAgICAgICAgLy9QdXNoIHZhbHVlcyBpbnRvIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIG5ld0Fyci5wdXNoKGhpZ2hlc3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vU29ydCBhcnJheVxuICAgICAgICBuZXdBcnIuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICByZXR1cm4gYiAtIGE7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vSWYgdGhlIGhpZ2hlc3QgaW4gYXJyYXkgaXNuJ3QgdW5kZWZpbmVkLCByZXR1cm4gdGhhdCB2YWx1ZSwgZWxzZSByZXR1cm4gbm9ybWFsIGhpZ2hlc3QuXG4gICAgICAgIGlmIChuZXdBcnJbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ld0FyclswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoaWdoZXN0O1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvL1doZW4gcnVuLCBnZXQgdGhlIGhpZ2hlc3Qgei1pbmRleCBhbmQgc2V0IHRoYXQgdG8gdGhlIG5hdmJhclxuICAgIG5hdi5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiLCB0cnVlKSk7XG5cbiAgICBmdW5jdGlvbiBzZXR0aW5nTmUoKSB7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vSW4gb3JkZXIgZm9yIG5hdiB0byBnZXQgdGhlIGhpZ2hlc3Qgei1pbmRleCwgZ2l2ZSB0aGUgd2luZG93cyB6LWluZGV4IG9uIGluaXQuXG4gICAgICAgIHdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnpJbmRleCA9IHBhcnNlSW50KGhpZ2VzdFooXCIud2luZG93XCIpKTtcblxuICAgICAgICAvL1doZW4gY2xpY2tpbmcgYSB3aW5kb3csIGNoZWNrIHRoZSBoaWdoZXN0IHotaW5kZXggYW5kIGFkZCB0aGF0IHRvIHRoYXQgc3BlY2lmaWMgd2luZG93LlxuICAgICAgICB3aW5kb3dzW2NvdW50ZXIgLSAxXS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5zdHlsZS56SW5kZXggPSBwYXJzZUludChoaWdlc3RaKFwiLndpbmRvd1wiLCBmYWxzZSkpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgc2V0dGluZ05lKCk7XG5cbn1cblxuLy9PZmYgdG8gcmVuZGVyV2luZG93ICsgd2luZG93UGxhY2VtZW50XG5tb2R1bGUuZXhwb3J0cy5zZXQgPSBzZXRaO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICpMZXQncyB0aGUgbmF2YmFyIGFwcGVhciBvbiBsb2FkIChHaXZlcyBhIHZpc3VhbGx5IHBsZWFzaW5nIGVmZmVjdCkuXG4gKi9cbmZ1bmN0aW9uIHRhc2tiYXIoKSB7XG4gICAgdmFyIGZpbmRUYXNrYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50YXNrYmFyXCIpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGZpbmRUYXNrYmFyLmNsYXNzTGlzdC5hZGQoXCJ0YXNrLWFwcGVhclwiKTtcbiAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmJyaW5nRm9ydGggPSB0YXNrYmFyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogTWFrZXMgdGhlIHdpbmRvd3MgcmVtb3ZhYmxlLlxuICovXG5mdW5jdGlvbiB3aW5kb3dEZXN0cm95ZXIoKSB7XG4gICAgdmFyIGZpbmRFeGl0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5leGl0XCIpO1xuICAgIHZhciBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG5cbiAgICBmdW5jdGlvbiByZW1vdmluZyhldmVudCkge1xuXG4gICAgICAgIC8vQ2hlY2tzIHNwZWNpZmljYWxseSBmb3IgdGhlIGZhY3QgdGhhdCB3ZSdyZSBub3QgdHJ5aW5nIHRvIHJlbW92ZSB0aGUgYm9keS5cbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gYm9keSkge1xuXG4gICAgICAgICAgICAvL1RoZW4gcmVtb3Zlcy5cbiAgICAgICAgICAgIGV2ZW50LnRhcmdldC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmluZEV4aXQubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgZmluZEV4aXRbaV0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlbW92aW5nKTtcbiAgICB9XG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMuZGVzdHJveSA9IHdpbmRvd0Rlc3Ryb3llcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbmV3Q291bnRlciA9IDA7XG52YXIgaGVpZ2h0ID0gMDtcbnZhciB3aWR0aCA9IDA7XG52YXIgY291bnRpbmcgPSAwO1xuXG4vKipcbiAqIFdoZXJlIHRoZSB3aW5kb3cgc2hvdWxkIGJlIHBsYWNlZCBvbiBsb2FkLlxuICovXG5mdW5jdGlvbiB3aW5kb3dQbGFjZW1lbnQoKSB7XG5cbiAgICBmdW5jdGlvbiB3aGVyZVRvUGxhY2UoKSB7XG4gICAgICAgIHZhciBmaW5kQWxsV2luZG93cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIud2luZG93XCIpO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHZhciBpID0gMDtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmluZEFsbFdpbmRvd3MubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBzZXRaID0gcmVxdWlyZShcIi4vc2V0WlwiKTtcbiAgICAgICAgc2V0Wi5zZXQoKTtcblxuICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIDMwICogbmV3Q291bnRlciArIFwicHhcIjtcbiAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgMzAgKiBuZXdDb3VudGVyICsgXCJweFwiO1xuXG4gICAgICAgIGhlaWdodCArPSAzMDtcbiAgICAgICAgd2lkdGggKz0gMzA7XG5cbiAgICAgICAgLy9DaGVja3MgaWYgdGhlIHdpbmRvd3MgYXJlIHRvbyBjbG9zZSB0byB0aGUgYm90dG9tIG9mIHRoZSBzY3JlZW4uXG4gICAgICAgIGlmICgod2lkdGgpID4gd2luZG93LmlubmVySGVpZ2h0IC0gNTAwKSB7XG4gICAgICAgICAgICBuZXdDb3VudGVyID0gMDtcbiAgICAgICAgICAgIHdpZHRoID0gMzA7XG4gICAgICAgICAgICBmaW5kQWxsV2luZG93c1tjb3VudGVyIC0gMV0uc3R5bGUudG9wID0gXCJcIiArIHdpZHRoICsgXCJweFwiO1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLmxlZnQgPSBcIlwiICsgaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluZEFsbFdpbmRvd3NbY291bnRlciAtIDFdLnN0eWxlLnRvcCA9IFwiXCIgKyB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGZpbmRBbGxXaW5kb3dzW2NvdW50ZXIgLSAxXS5zdHlsZS5sZWZ0ID0gXCJcIiArIGhlaWdodCArIFwicHhcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vQ2hlY2tzIGlmIHRoZSB3aW5kb3dzIGFyZSB0b28gY2xvc2UgdG8gdGhlIHJpZ2h0IGJvcmRlciBvZiB0aGUgc2NyZWVuLlxuICAgICAgICBpZiAoKGhlaWdodCkgPiB3aW5kb3cuaW5uZXJXaWR0aCAtIDQ1MCkge1xuICAgICAgICAgICAgY291bnRpbmcgKz0gMTtcbiAgICAgICAgICAgIGhlaWdodCA9IDUgKiBjb3VudGluZztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHdoZXJlVG9QbGFjZSgpO1xuXG59XG5cbi8vT2ZmIHRvIGNyZWF0ZU1lbW9yeVxubW9kdWxlLmV4cG9ydHMucGxhY2UgPSB3aW5kb3dQbGFjZW1lbnQ7XG4iXX0=
