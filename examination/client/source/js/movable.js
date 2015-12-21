function movable() {


  var findWindows = document.querySelectorAll(".window");
  var i = 0;

  function addListeners() {

      //Look for the window and add mousedown + and mouseup
      for (i = 0; i < findWindows.length; i += 1) {
        findWindows[i].addEventListener("mousedown", mouseDown, false);
      }

      window.addEventListener("mouseup", mouseUp, false);
  }

  function mouseUp() {
      //When releasing mouse.
      window.removeEventListener("mousemove", divMove, true);
  }

  function mouseDown(event) {

    //Saving coordinates on click.
    if (event.target.className === "top") {
      aVarY = event.offsetY;
      aVarX = event.offsetX;
      saveTarget = event.target;
    }

    //Runs mousemove - if dragging on the right place
    // if(saveTarget) {
    window.addEventListener("mousemove", divMove, true);
    // }
  }

  function divMove(event) {

    //Checks for window top.

    // if (event.target.className === "top") {

      //Sets top and left on absolute element.
      saveTarget.parentElement.style.top = event.y - aVarY + "px";
      saveTarget.parentElement.style.left = event.x - aVarX + "px";
    // }
  }

  addListeners();

};

module.exports.move = movable;
