{

/*
guitar:
voice 1:
  octave:2
  {0 7 12 15 19 24}
  {0 7 12 15 19 24}
  {3 7 10 15 22 27}
  {3 7 10 15 22 27}
  {0 5 10 17 22 26}
  {0 5 10 17 22 26}
  {0 7 12 15 19 24}

piano:
voice 1:1
voice 2:1
voice 3:1
//*/

const fromNaldaToAlda = function(data) {
  let code = "";
  for(let i=0; i<data.length; i++) {
    const instrumentData = data[i];
    code += fromInstrumentToAlda(instrumentData);
    code += "\n\n";
  }
  return code;
}

const fromInstrumentToAlda = function(instrumentData) {
  let code = "";
  const instrument = instrumentData.instrument;
  const voices = instrumentData.voices;
  code += instrument + ":\n";
  for(let i=0; i<voices.length; i++) {
    const voiceData = voices[i];
    code += fromVoiceToAlda(voiceData);
    code += "\n";
  }
  return code;
}

const fromVoiceToAlda = function(voiceData) {
  let code = "";
  const voice = voiceData.voice;
  const contents = voiceData.contents;
  code += "V" + voice + ":";
  for(let i=0; i<contents.length; i++) {
    const item = contents[i];
    code += fromMusicalItemToAlda(item);
  }
  return code;
}

const fromMusicalItemToAlda = function(musicalItem) {
  let code = "";
  const musicalType = musicalItem.type;
  switch(musicalType) {
    case "octave":
      code += fromOctaveToAlda(musicalItem);
      break;
    case "chord":
      code += fromChordToAlda(musicalItem);
      break;
    case "note":
      code += fromNoteToAlda(musicalItem);
      break;
    case "silence":
      code += fromSilenceToAlda(musicalItem);
      break;
    case "global tempo":
    case "local tempo":
      code += fromTempoToAlda(musicalItem);
      break;
    case "moment definition":
    case "moment usage":
      code += fromMomentToAlda(musicalItem);
      break;
    case "scale up":
    case "scale down":
      code += fromScaleToAlda(musicalItem);
      break;
    case "alda injection":
      code += " " + musicalItem.code + " ";
      break;
    default:
    console.log(musicalItem);
      throw new Error("Type not identified: " + musicalType);
      break;
  }
  return code;
}

const fromOctaveToAlda = function(octave) {
  return " o" + octave.octave + " ";
};

const fromChordToAlda = function(chord) {
  let code = " ";
  const notes = chord.notes;
  const modifiers = chord.modifiers;
  for(let i=0; i<notes.length; i++) {
    const noteData = notes[i];
    if(i !== 0) {
      code += " / ";
    }
    code += fromNoteToAlda(noteData, modifiers);
  }
  code += "";
  return code;
};

const fromNoteToAlda = function(noteData, externalModifiers = {}) {
  let code = "";
  const note = noteData.note;
  const modifiers = noteData.modifiers;
  code += "a" + "+".repeat(note);
  const longitude = modifiers.longitude ? modifiers.longitude : externalModifiers.longitude ? externalModifiers.longitude : false;
  const timing = modifiers.timing ? modifiers.timing : externalModifiers.timing ? externalModifiers.timing : false;
  const quantification = modifiers.quantification ? modifiers.quantification : externalModifiers.quantification ? externalModifiers.quantification : false;
  const volume = modifiers.volume ? modifiers.volume : externalModifiers.volume ? externalModifiers.volume : false;
  code = addModifiers({longitude, timing, quantification, volume}, code);
  return code;
};

const fromSilenceToAlda = function(silenceData) {
  let code = "";
  const modifiers = silenceData.modifiers;
  code += "r";
  const longitude = modifiers.longitude ? modifiers.longitude : false;
  const timing = modifiers.timing ? modifiers.timing : false;
  const quantification = modifiers.quantification ? modifiers.quantification : false;
  code = addModifiers({longitude, timing, quantification}, code);
  return code;
};

const fromTempoToAlda = function(tempoData) {
  const isGlobal = tempoData.type.indexOf("global") !== -1;
  return "(tempo" + (isGlobal ? "! " : " ") + tempoData.tempo + ") ";
}

const addModifiers = function(modifiers, code = "") {
  const {timing = false, longitude = false, quantification = false, volume = false, tempo = false} = modifiers;

  if(longitude !== false) {
  	code += longitude;
  } else {
  	code += "4";
  }
  if(timing !== false) {
    code += "~" + timing + "ms";
  }
  if(quantification !== false) {
  	code = "(quant " + quantification + ") " + code;
  } else {
  	code = "(quant 100) " + code;
  }
  if(volume !== false) {
  	code = "(vol " + volume + ") " + code;
  } else {
  	code = "(vol 100) " + code;
  }
  return code;
};

const fromMomentToAlda = function(momentData, code = "") {
	const { moment, type: momentType } = momentData;
	if(momentType === "moment definition") {
		code += " %" + moment;
	} else if(momentType === "moment usage") {
		code += " @" + moment;
	}
	return code;
}

const fromScaleToAlda = function(scaleData, code = "") {
	const { times, type: scaleType } = scaleData;
	if(scaleType === "scale up") {
		code += " > ";
	} else if(scaleType === "scale down") {
		code += " < ";
	}
	return code;
}

}

Lenguaje = _* ast:Sentencia_completa* _* {
  //return ast;
  return fromNaldaToAlda(ast)
}
Sentencia_completa = instrument:Instrumento _* voices:Voces {return {instrument, voices}}
Instrumento = _* instrument:Palabra ":" {return instrument}
Voces = Voces_multiples / Voz_unica
Voces_multiples = Voz_multiple+
Voz_multiple = _* "voice " voice:Numero ":" _* contents:Contenido_musical {return {voice, contents}}
Voz_unica = _* contents:Contenido_musical {return [{voice:1, contents}]}
Contenido_musical = Item_musical*
Item_musical = Octava
  / Nota
  / Acorde
  / Tempo_global
  / Tempo_local
  / Movimiento_de_escala
  / Momento
  / Silencio
  / Inyeccion_de_codigo_alda
Octava = _* "octave:" octave:Numero {return {type: "octave", octave}}
Nota = _* "+"? note:Numero modifiers:Modificadores_de_nota? {return {type: "note", note, modifiers: modifiers ? modifiers : {}}}
Modificadores_de_nota = 
  _* longitude:Modificador_de_longitud_de_nota?
  _* timing:Modificador_de_tiempo_de_nota?
  _* duration:Modificador_de_duracion_de_nota?
  _* quantification:Modificador_de_cuantificacion_de_nota?
  _* volume:Modificador_de_volumen_de_nota?
  {return Object.assign({}, longitude, timing, duration, quantification, volume)}
Acorde = _* "{" _* notes:Nota+ _* "}" _* modifiers:Modificadores_de_nota? {return {type: "chord", notes, modifiers: modifiers ? modifiers : {}}}
Tempo_global = _* "tempo:" _* tempo:Numero "!" {return {type: "global tempo", tempo}}
Tempo_local = _* "tempo:" _* tempo:Numero {return {type: "local tempo", tempo}}
Movimiento_de_escala = _* scale:(Movimiento_de_escala_arriba / Movimiento_de_escala_abajo) {return scale}
Movimiento_de_escala_arriba = _* Identificador_de_escala_arriba times:(":" Numero)? { return {type:"scale up", times: times ? times[1] : 1}}
Movimiento_de_escala_abajo = _* Identificador_de_escala_abajo times:(":" Numero)? { return {type:"scale down", times: times ? times[1] : 1}}
Momento = Definicion_de_momento / Uso_de_momento
Definicion_de_momento = _* "@" moment:Palabra_amplia "!" {return {type: "moment definition", moment}}
Uso_de_momento = _* "@" moment:Palabra_amplia ":" {return {type: "moment usage", moment}}
Modificador_de_longitud_de_nota = _* longitude:Numero Identificador_de_longitud_de_nota {return {longitude}}
Modificador_de_tiempo_de_nota = _* timing:Numero_con_decimales magnitude:Identificador_de_tiempo_de_nota {return {timing: magnitude === "seconds" ? (timing * 1000) : timing}}
Modificador_de_duracion_de_nota = _* duration:Numero Identificador_de_duracion_de_nota {return {duration}}
Modificador_de_cuantificacion_de_nota = _* quantification:Numero Identificador_de_cuantificacion_de_nota {return {quantification}}
Modificador_de_volumen_de_nota = _* volume:Numero Identificador_de_volumen_de_nota {return {volume}}
Numero = [0-9]+ {return parseInt(text())}
Numero_con_decimales = [0-9]+ ("." [0-9]+)? {return parseFloat(text())}
_ = [\n\r\t ]
Palabra = [A-Za-z]+ {return text()}
Palabra_amplia = [A-Za-z0-9\-]+ {return text()}
Identificador_de_longitud_de_nota = ("L"/"l"/"longitude"/"length") {}
Identificador_de_tiempo_de_nota = ("MS"/"ms"/"milliseconds"/"S"/"s"/"seconds") {return (text().toLowerCase().indexOf("m") !== -1) ? "milliseconds" : "seconds"}
Identificador_de_duracion_de_nota = ("D"/"d"/"duration") {}
Identificador_de_cuantificacion_de_nota = ("Q"/"q"/"quantification") {}
Identificador_de_volumen_de_nota = ("V"/"v"/"volume") {}
Identificador_de_escala_arriba = ("scaleup" / "up") {}
Identificador_de_escala_abajo = ("scaledown" / "down") {}
Silencio = _* "." modifiers:Modificadores_de_nota {return {type: "silence", modifiers: modifiers ? modifiers : {}}}
Inyeccion_de_codigo_alda = _* "[[" code:Codigo_alda "]]" {return {type: "alda injection", code}}
Codigo_alda = (!("]]").)+ {return text()}