"use strict";

function createMemory() {

  // var loadCards = require("./loadCards");
  // loadCards.cards(4, 4);
  //
  // var cardCheck = require("./cardCheck");
  // cardCheck.check();
  //
  // var pairCheck = require("./pairCheck");
  // pairCheck.pair();

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
