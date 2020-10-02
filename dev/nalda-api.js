const asynchandler = require("@allnulled/asynchandler");
let NaldaAPI = undefined;
const noop = () => {};

class Parser {

	static async parseFile(naldaFile) {
		try {
			const naldaParser = require(__dirname + "/nalda-parser.js");
			const fs = require("fs");
			const path = require("path");
			const ejs = require("ejs");
			const filename = path.basename(naldaFile);
			const aldaFile = path.resolve(path.dirname(naldaFile), filename.replace(/\.nalda/g, ".alda"));
			const caldaFile = path.resolve(path.dirname(naldaFile), filename.replace(/\.nalda/g, ".calda"));
			const taldaFile = path.resolve(path.dirname(naldaFile), filename.replace(/\.nalda/g, ".talda"));
			//
			const naldaSource = fs.readFileSync(naldaFile).toString();
			console.log(`(1/4) nalda file (${naldaSource.length}, original):`, naldaFile);
			//
			const caldaSource = naldaSource.replace(/\/\*((?!\*\/)(.|\n))+\*\//g, ""); // enable comments in nalda scripts
			console.log(`(2/4) calda file (${caldaSource.length}, no comments):`, caldaFile);
			await new Promise((ok, fail) => fs.writeFile(caldaFile, caldaSource, "utf8", asynchandler(ok, fail)));
			//
			const taldaSource = await ejs.renderFile(caldaFile, { fs, ejs, nalda: NaldaAPI }, {delimiter: "/"});
			console.log(`(3/4) talda file (${taldaSource.length}, template):`, taldaFile);
			fs.writeFile(taldaFile, taldaSource, "utf8", noop);
			//
			const aldaSource = naldaParser.parse(taldaSource);
			console.log(`(4/4) alda file  (${aldaSource.length}, final):`, aldaFile);
			fs.writeFileSync(aldaFile, aldaSource, "utf8");
			return { file: aldaFile, code: aldaSource };
		} catch(error) {
			console.error(error);
			throw error;
		}
	}

}

class Utils {
	
	static printModifiers(modifiers) {
		if(typeof modifiers !== "object") {
			throw new Error("Required <modifiers> to be an object on <Utils.printModifiers>");
		}
		let code = "";
		const modifierKeys = Object.keys(modifiers)
		for(let index=0; index < modifierKeys.length; index++) {
			if(index !== 0) {
				code += " ";
			}
			const modifierType = modifierKeys[index];
			const modifierValue = modifiers[modifierType];
			const mType = modifierType.toUpperCase();
			const magnitude = mType.startsWith("L") ? "L" : mType.startsWith("D") ? "D" : mType.startsWith("Q") ? "Q" : mType.startsWith("V") ? "V" : false;
			if(magnitude === false) {
				throw new Error("Required <modifiers.*> have keys that start with : L(ongitude), D(uration), Q(uantification), V(olume) on <Utils.printModifiers>");
			}
			code += " " + modifierValue + magnitude;
		}
		return code;
	}

}

class Chord {

	static create(...args) {
		return new this(...args);
	}

	constructor(options = {}) {
		Object.assign(this, {notes: [], modifiers: {}}, options);
		if(!Array.isArray(this.notes)) {
			throw new Error("Required <this.notes> to be an array on <Chord.constructor>");
		}
		if(Array.isArray(this.modifiers) || typeof this.modifiers !== "object") {
			throw new Error("Required <this.modifiers> to be an object on <Chord.constructor>");
		}
	}

	toString() {
		let code = "";
		code += "{";
		for(let index=0; index < this.notes.length; index++) {
			const note = this.notes[index];
			if(index !== 0) {
				code += " ";
			}
			if(typeof note === "string") {
				code += note;
			} else if(typeof note === "object") {
				code += note.toString();
			} else if(typeof note === "number") {
				code += note;
			} else throw new Error("Required <notes.*> to be a string or object on <Chord.toString>");
		}
		code += "}";
		code += Utils.printModifiers(this.modifiers);
		return code;
	}

}

class Note {

	static create(...args) {
		return new this(...args);
	}

	constructor(note = "", modifiers = {}) {
		Object.assign(this, {note: undefined, modifiers: {}}, options);
		if(!Array.isArray(this.note)) {
			throw new Error("Required <this.note> to be an array on <Note.constructor>");
		}
		if(Array.isArray(this.modifiers) || typeof this.modifiers !== "object") {
			throw new Error("Required <this.modifiers> to be an object on <Note.constructor>");
		}
	}

	toString() {
		let code = "";
		if(typeof note === "string") {
			if(note === "") {
				throw new Error("Required <note> to not be empty on <Note.toString>")
			}
			code += note;
		} else if(typeof note === "object") {
			code += note.toString();
		} else if(typeof note === "number") {
			code += note;
		} else throw new Error("Required <note> to be a string or object on <Note.toString>");
		code += " " + Utils.printModifiers(this.modifiers);
		return code;
	}

}

NaldaAPI = { Chord, Note, Utils, Parser };

module.exports = NaldaAPI;