function movable() {

  function addListeners() {
      //
      document.querySelector('.window').addEventListener('mousedown', mouseDown, false);
      window.addEventListener('mouseup', mouseUp, false);
  }

  function mouseUp()
  {
      //When releasing mouse.
      window.removeEventListener('mousemove', divMove, true);
  }

  function mouseDown(event) {

    //Saving coordinates on click.
    aVarY = event.offsetY;
    aVarX = event.offsetX;

    //Runs mousemove - if dragging on the right place
    if(event.target.className === "top") {
      window.addEventListener('mousemove', divMove, true);
    }
  }

  function divMove(event){

    //Finds the window.
    var findWindow = document.querySelector('.window');

    //Sets top and left on absolute element.
    findWindow.style.top = event.y - aVarY + 'px';
    findWindow.style.left = event.x - aVarX + 'px';
  }

  addListeners();

};

module.exports.move = movable;
