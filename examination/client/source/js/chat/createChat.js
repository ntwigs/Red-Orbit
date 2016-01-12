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
