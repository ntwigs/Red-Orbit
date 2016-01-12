"use strict";

function colorSchemeer() {

    //Gets the template
    var loadScheme = require("./loadScheme");
    loadScheme.load();

    //Gets the input tags hex-codes
    var fetchColor = require("./fetchColor");
    fetchColor.fetch();

    //Gets hex-code and styling for the font.
    var setFontFamily = require("./setFontFamily");
    setFontFamily.set();

}

module.exports.initialize = colorSchemeer;
