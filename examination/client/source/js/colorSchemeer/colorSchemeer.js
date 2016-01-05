function colorSchemeer() {

  var loadScheme = require("./loadScheme");
  loadScheme.load();

  var fetchColor = require("./fetchColor");
  fetchColor.fetch();

}

module.exports.initialize = colorSchemeer;
