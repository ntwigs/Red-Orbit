"use strict";

function createMemory() {

  var loadCards = require("./loadCards");
  loadCards.cards(4, 4);

  var cardCheck = require("./cardCheck");
  cardCheck.check();

  var pairCheck = require("./pairCheck");
  pairCheck.pair();

}

module.exports.create = createMemory;
