const chokidar = require("chokidar");
const exec = require("execute-command-sync");
const nalda = require(__dirname + "/dev/nalda-api.js");

chokidar.watch(`${__dirname}/composer/*.alda`).on("change", function(file, event) {
  exec(`alda play --file ${JSON.stringify(file)}`, { cwd: __dirname });
});

chokidar.watch(`${__dirname}/composer/*.nalda`).on("change", function(fileNalda, event) {
  const {file, code} = nalda.Parser.parseFile(fileNalda);
});