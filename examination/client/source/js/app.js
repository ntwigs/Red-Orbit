"use strict";

var renderWindow = require("./renderWindow");
renderWindow.render();

var taskbar = require("./taskbar");
taskbar.bringForth();

var preloading = require("./preloading");
preloading.loading();

//Check on window icon
