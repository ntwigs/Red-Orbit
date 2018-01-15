"use strict";

function createMemory() {

    //Gets template
    var loadingCards = require("./loadingCards");
    loadingCards.load();

    //Implements the theme changer
    var themeChanger = require("./themeChanger");
    themeChanger.change();

    //Gives card img depending on class value
    var setCards = require("./setCards");
    setCards.set();

    //Randomizing cards
    var cardRandomizer = require("./cardRandomizer");
    cardRandomizer.run();

    //The game logic.
    var checkPair = require("./checkPair");
    checkPair.check();

}

//Off to renderWindow
module.exports.create = createMemory;
