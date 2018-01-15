"use strict";

import '../style/index.css'

//Init windows
var renderWindow = require("./renderWindow");
renderWindow.render();

//Init taskbar
var taskbar = require("./taskbar");
taskbar.bringForth();

//Preload images
var preloading = require("./preloading");
preloading.loading();
