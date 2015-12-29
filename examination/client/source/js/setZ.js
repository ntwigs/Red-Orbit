function setZ() {
  var windows = document.querySelectorAll(".window");
  var counter = 0;
  var i = 0;
  var j = 0;
  var newCounter = 0;
  var newArr = [];

  function higestZ(theWindows) {

    var glassSquare = document.querySelectorAll(theWindows);
    var highest = 0;

    for (var i = 0; i < glassSquare.length; i++) {
      var zindex = window.getComputedStyle(glassSquare[i]).getPropertyValue("z-index");

      if ((zindex > highest) && (zindex !== "auto")) {
        highest = zindex;
      }

    }

    return highest;

  }

function getHighest(increase) {
  for (i = 0; i < windows.length; i += 1) {
    if (windows[i].style.getPropertyValue("z-index") !== "") {
      newArr.push(parseInt(windows[i].style.getPropertyValue("z-index")));
    }
  }

  newArr.sort(function(a, b) {
    return b - a;
  });

  // console.log(newArr);

  var highestZ = newArr.slice(0, 1);

  newArr.push(parseInt(highestZ) + parseInt(increase));

  highestZ = newArr.slice(0, 1);

  return highestZ;

}

settingNe();


  function settingNe() {

    for (i = 0; i < windows.length; i += 1) {
      counter++;
    }

      windows[counter - 1].addEventListener("mousedown", function() {
        this.style.zIndex = parseInt(higestZ(".window")) + 1;
        // this.style.opacity = 0.85;
      });

      // windows[counter - 1].addEventListener("mouseup", function() {
      //   this.style.opacity = 1;
      // });

  }

  // settingNe();

  function woop() {

    for (i = 0; i < windows.length; i += 1) {
      counter++;
    }

    other();

  }

  // woop();

  function other() {
    windows[counter - 1].addEventListener("click", function() {
      // console.log(counter);
      for (var j = 0; j < windows.length; j += 1) {
        windows[counter - 1].style.zIndex = 998;
      }

      var newCounter = 0;
      var newArr = [];

        if (this.style.zIndex <= 998) {
          // console.log("was less than 999");
          this.style.zIndex = 999;
        }

    });
  }

// function setTo() {
//     window.addEventListener("click", function() {
//
//     });
// }


  // console.log(counter);

  // console.log(counter);



}

module.exports.set = setZ;
