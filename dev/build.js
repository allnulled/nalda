const fs = require("fs");
const ejs = require("ejs");
const pegjs = require("pegjs");
const nalda = require(__dirname + "/nalda-api.js");

const parserDefinition = fs.readFileSync(__dirname + "/nalda-parser.pegjs").toString();
const parserSource = pegjs.generate(parserDefinition, {
	output: "source",
	format: "umd",
	exportVar: "NaldaParser"
});
fs.writeFileSync(__dirname + "/nalda-parser.js", parserSource, "utf8");