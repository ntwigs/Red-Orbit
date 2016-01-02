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
