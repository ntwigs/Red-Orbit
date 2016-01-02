"use strict";

function createMemory() {

  var loadingCards = require("./loadingCards");
  loadingCards.load();

  var setCards = require("./setCards");
  setCards.set();

  var cardRandomizer = require("./cardRandomizer");
  cardRandomizer.run();

  var checkPair = require("./checkPair");
  checkPair.check();

}

module.exports.create = createMemory;
