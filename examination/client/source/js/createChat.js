function createChat() {

  var findSubmit = document.querySelectorAll(".submit");
  var findTextArea = document.querySelectorAll(".text-mess");
  var findNickSubmit = document.querySelectorAll(".accept-name");
  var findNickArea = document.querySelectorAll(".enter-nick");
  var textContainer = document.querySelectorAll(".text-container");
  var findNameField = document.querySelectorAll(".name-field");
  var textContainer = document.querySelectorAll(".text-container");
  var enteredMessage = "";

  var socket = new WebSocket("ws://vhost3.lnu.se:20080/socket/", "chattext");
  for (var i = 0; i < findSubmit.length; i += 1) {
    findNickSubmit[i].addEventListener("click", function() {
      // *Hide after use - send to local storage  -> *Ish
      if (findNickArea[i - 1].value !== "") {
        data["username"] = findNickArea[i - 1].value;
        findNameField[i - 1].classList.add("name-field-gone");
        textContainer[i - 1].classList.add("text-container-after");
      }
    });

    findSubmit[i].addEventListener("click", function() {
        data["data"] = findTextArea[i - 1].value;
    });
  }


  var data = {
    "type": "message",
    "data" : "",
    "username": "",
    "channel": "",
    "key": "eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd"
  };

  socket.addEventListener("open", function (event) {
    for (var i = 0; i < findSubmit.length; i += 1) {
      findSubmit[i].addEventListener("click", function(event) {
        socket.send(JSON.stringify(data));
        findTextArea[i - 1].value = "";
        event.preventDefault();
      });
    }
  });

  socket.addEventListener("message", function (event) {
    var pTagUser = document.createElement("P");
    var pTagMess = document.createElement("P");
    var divTagText = document.createElement("DIV");
    // var brTag = document.createElement("BR");
    var chatData = JSON.parse(event.data).data;
    var chatUser = JSON.parse(event.data).username;
    var createText = document.createTextNode(chatData);
    var createUser = document.createTextNode(chatUser);
    pTagUser.appendChild(createUser);
    // pTag.appendChild(brTag);
    pTagMess.appendChild(createText);
    divTagText.appendChild(pTagUser);
    divTagText.appendChild(pTagMess);

    for (var i = 0; i < textContainer.length; i += 1) {
      if (chatUser !== "" && chatData !== "") {
        textContainer[i].appendChild(divTagText);
        textContainer[i].scrollTop = textContainer[i].scrollHeight;
      }
    }
  });



}

module.exports.chat = createChat;
