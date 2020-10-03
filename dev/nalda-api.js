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
			const naldaDir = path.resolve(__dirname + "/..");
			const taldaSource = await ejs.renderFile(caldaFile, { fs, ejs, nalda: NaldaAPI, require, naldaDir }, {delimiter: "/"});
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

/*-----GUITAR CHORDS----->

0__5__10__15__19__24
1  6  11  16  20  25
2  7  12  17  21  26
3  8  13  18  22  27
4  9  14      23  28

<------------------------*/
const chord = {
  do: 		"{ 0  8 12 15 20 24 }",
  dom: 		"{ 0  8 15 19 23 27 }",
  do7: 		"{ 0  8 12 18 20 24 }",
  doSos: 	"{ 1  9 13 16 21 25 }",
  doSosm:	"{ 1  9 16 20 24 28 }",
  doSos7:	"{ 1  9 13 19 21 25 }",
  re: 		"{ 2  5 10 17 22 26 }",
  rem: 		"{ 1  5 10 17 22 25 }",
  re7: 		"{ 2  5 10 17 20 26 }",
  reSos: 	"{ 3  6 11 18 23 27 }",
  reSosm: 	"{ 2  6 11 18 23 26 }",
  reSos7: 	"{ 3  6 11 18 21 27 }",
  mi: 		"{ 0  7 12 16 19 24 }",
  mim: 		"{ 0  7 12 15 19 24 }",
  mi7: 		"{ 0  7 10 16 19 24 }",
  miSos: 	"{ 1  8 13 17 20 25 }",
  miSosm:	"{ 1  8 13 16 20 25 }",
  miSos7:	"{ 1  8 11 17 20 25 }",
  fa: 		"{ 1  8 13 17 20 25 }",
  fam: 		"{ 1  8 13 16 20 25 }",
  fa7: 		"{ 1  8 11 17 20 25 }",
  faSos: 	"{ 2  9 14 18 21 26 }",
  faSosm: 	"{ 2  9 14 17 21 26 }",
  faSos7: 	"{ 2  9 12 18 21 26 }",
  sol: 		"{ 3  7 10 15 19 27 }",
  solm: 	"{ 3 10 15 18 22 27 }",
  sol7: 	"{ 3  7 10 15 19 25 }",
  solSos: 	"{ 4  8 11 16 20 28 }",
  solSosm: 	"{ 4 11 16 19 23 28 }",
  solSos7: 	"{ 4  8 11 16 20 26 }",
  la: 		"{ 0  5 12 17 21 24 }",
  lam: 		"{ 0  5 12 17 20 24 }",
  la7: 		"{ 0  5 12 15 21 24 }",
  laSos: 	"{ 1  6 13 18 22 25 }",
  laSosm: 	"{ 1  6 13 18 21 25 }",
  laSos7: 	"{ 1  6 13 16 22 25 }",
  si: 		"{ 2  7 14 19 23 26 }",
  sim: 		"{ 2  7 14 19 22 26 }",
  si7: 		"{ 2  7 11 17 19 26 }",
};

chord.A  = chord.la;
chord.Am = chord.lam;
chord.A7 = chord.la7;

chord.ASos  = chord.laSos;
chord.ASosm = chord.laSosm;
chord.ASos7 = chord.laSos7;

chord.B  = chord.si;
chord.Bm = chord.sim;
chord.B7 = chord.si7;

chord.BSos  = chord.siSos;
chord.BSosm = chord.siSosm;
chord.BSos7 = chord.siSos7;

chord.C  = chord.do;
chord.Cm = chord.dom;
chord.C7 = chord.do7;

chord.CSos  = chord.doSos;
chord.CSosm = chord.doSosm;
chord.CSos7 = chord.doSos7;

chord.D  = chord.re;
chord.Dm = chord.rem;
chord.D7 = chord.re7;

chord.DSos  = chord.reSos;
chord.DSosm = chord.reSosm;
chord.DSos7 = chord.reSos7;

chord.E  = chord.mi;
chord.Em = chord.mim;
chord.E7 = chord.mi7;

chord.ESos  = chord.miSos;
chord.ESosm = chord.miSosm;
chord.ESos7 = chord.miSos7;

chord.F  = chord.fa;
chord.Fm = chord.fam;
chord.F7 = chord.fa7;

chord.FSos  = chord.faSos;
chord.FSosm = chord.faSosm;
chord.FSos7 = chord.faSos7;

chord.G  = chord.sol;
chord.Gm = chord.solm;
chord.G7 = chord.sol7;

chord.GSos  = chord.solSos;
chord.GSosm = chord.solSosm;
chord.GSos7 = chord.solSos7;

NaldaAPI = { Chord, Note, Utils, Parser, chord };

module.exports = NaldaAPI;