function windowDestroyer() {
  var findExit = document.querySelectorAll(".exit");
  var body = document.querySelector("body");
  for (var i = 0; i < findExit.length; i += 1) {
    findExit[i].addEventListener("click", function(event) {
      if (event.target.parentElement.parentElement.parentElement !== body) {
        event.target.parentElement.parentElement.parentElement.remove();
      }
    });
  }
}

module.exports.destroy = windowDestroyer;
