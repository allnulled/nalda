const fs = require("fs");
const files = fs.readdirSync(__dirname + "/composer").filter(file => file.endsWith(".nalda"));
const exec = require("execute-command-sync");
const ejsLint = require("ejs-lint");
let errors = 0;
for(let index=0; index < files.length; index++) {
	const file = files[index];
	const filepath = __dirname + "/composer/" + file;
	const naldaContents = fs.readFileSync(filepath).toString();
	const syntaxError = ejsLint(naldaContents, {delimiter: "/"});
	if(syntaxError) {
		console.log();
		console.log("  - FILE:", filepath.replace(__dirname, ""));
		console.log("  - FAIL:", (++errors));
		console.log("  - ERROR:", syntaxError);
		console.log();
	}
}