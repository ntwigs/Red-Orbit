"use strict";

function colorSchemeer() {

    var loadScheme = require("./loadScheme");
    loadScheme.load();

    var fetchColor = require("./fetchColor");
    fetchColor.fetch();

    var setFontFamily = require("./setFontFamily");
    setFontFamily.set();

}

module.exports.initialize = colorSchemeer;
