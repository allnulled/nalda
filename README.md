# nalda

Programming language to create music by numbers and javascript templates.

`nalda` is a programming language, based on [`alda`](https://alda.io/), but uses numbers to refer to each musical note.

With `nalda`, you can write music as if it was a program, using numbers, and even javascript as templating language.

`nalda` is because of: **N**umbers + **Alda**.


## Prerequisites

### 1. Download and install `alda` tool

- [Here](https://github.com/alda-lang/alda/blob/master/README.md) you can find how to install and run Alda documents.

- [Here](https://blog.djy.io/alda-a-manifesto-and-gentle-introduction/) you can find an Alda tutorial, but you should not need it, as `nalda` should do the work.

### 2. Download and install `npm` and `node`

Once here, we can run `alda` scripts. But we need `npm` and `node` to be able to download and install `nalda` yet.

- [Here](https://nodejs.org/en/download/) you can install both `npm` and `node` at once.

### 3. Download and install `nalda`

Once here, we can install and manage packets for `node` and `npm`. But we still do not have `nalda` installed.

Now, go to [`nalda` github project](https://github.com/allnulled/nalda) and download the project.

Open the folder, and with the command-line console, install the dependencies runnning from the inside of the project folder:

```batch
npm install
```

This will install the `nalda` dependencies, and from there, you can start.

### 4. OK

If you arrived here, you are almost ready to go with `nalda`.

You do NOT have to repeat the previous steps anymore.


## Get started

Despite we installed all the tools we need to play with `nalda`, you still have to do 2 things before writting and listening your `nalda` scripts.

### 1. Set up alda server

The first thing you have to do to play with `nalda` is to turn `alda` server up like this:

```batch
alda up
```

This has to be done only once, this is a background process we need to have working for us to listen `alda` scripts. This step takes some time.

### 2. Set up nalda watchers

Now, we want `nalda` to start listening our programs. We can do this typing on the console:

```batch
node watcher
```

This command will make `nalda` to watch our files in order to, automatically, play them once it has detected that you saved a `nalda` file.

Finally, done. Now, we have the folder `composer/`, where anytime we save a file with the extension `*.nalda`, the `nalda` tool will compile the script automatically and play it.

#### About the nalda script compilation

The compilation of `nalda` scripts produce different files:

  - `*.nalda`: this is our script, the one we write.
  - `*.calda`: this is our script, without comments.
    - This is for you to use `/* .... */` style comments in your `alda` code.
  - `*.talda`: this is our script, without comments, and as already rendered template.
    - For programmers who know about javascript
    - This is for you to use [ejs templates](https://github.com/mde/ejs) in your scripts.
    - This allows you to play with javascript directly to create music.
    - Note that delimiters are set to `</` and `/>` for the ejs, instead of the common `<%` and `%>`.


## The language of nalda

`nalda` is a program, but also a programming language that can be interpreted by this program.

Now, we are going to talk about the language, and not the program.

Each script can play with different concepts, put them together and mix them as you prefer.

The following are all the concepts that you can play with in `nalda`.

### 1. Instruments

First of all, in your `nalda` script you have to specify an instrument.

```nalda
piano:  0
guitar: 0
```

This script, for example, is going to play a `do` note in both, piano and guitar. The `0` is a `do` here.

You can play and repeat as much instruments as you want.

### 2. Voices

After the instrument, you can specify various voices per each instrument, who will play simultaneously. For example:

```nalda
piano: 
  voice 1: 0
  voice 2: scaleup 0
  voice 3: scaleup 0
```

Here, we are playing 3 `do`s (of different scales, but that is explained later) with different pianos simultaneously.

Notice that this would be a way to create chords, but that is also explained later, and this is not the only, nor the best way to do it.


### 3. Octave

You can change the octave of the following notes by `octave` directive, like this:

```nalda
piano: octave:1 0
piano: octave:2 0
piano: octave:3 0
piano: octave:4 0
piano: octave:5 0
piano: octave:6 0
piano: octave:7 0
```

You can hear the different sounds of `0` depending on the octave they are being played over.

**Once you specify this directive, the following notes will be affected by it.**

### 4. Tempo

With `nalda` we can play with the tempo of the played notes too.

There are 2 ways of tempo specification: global, which affects to all the voices and instruments, or local, which affects only to the voice they are specified from.

The tempo directive affects a whole instrument, when local, and the whole following notes, when global.

**Once you specify this directive, the following notes will be affected by it.**

The following examples are the same script, but applying local tempo in the first, and global tempo in the second. You can hear the differences.

### 4.1. Local tempo

When you play this example:

```nalda
guitar:
  scaledown
  0 0 0 0
  tempo: 200
  0 0 0 0
  tempo: 400
  0 0 0 0
  tempo: 800
  0 0 0 0
piano:
  scaleup
  0 0 0 0
  0 0 0 0
  0 0 0 0
  0 0 0 0
```

As you can hear, this script makes the guitar play faster when tempo is increased, but not the piano. This is because we used a `local tempo` directive.

### 4.2. Global tempo

When you play this example:

```nalda
guitar:
  scaledown
  0 0 0 0
  tempo: 200!
  0 0 0 0
  tempo: 400!
  0 0 0 0
  tempo: 800!
  0 0 0 0
piano:
  scaleup
  0 0 0 0
  0 0 0 0
  0 0 0 0
  0 0 0 0
```

As you can hear, this script makes the guitar play faster when tempo is increased, and the piano too gets played faster. This is because we used a `global tempo` directive.

### 5. Scale

In order to abbreviate the calculus, basically, we can jump up and down scales. This means:

```nalda
piano:
  scaledown 0 2
  scaledown 0 2
  scaleup 0 2
  scaleup 0 2
```

This way, we play the same notes, but 12 semitones up, or down, but using the same numbers.

**Once you specify this directive, the following notes will be affected by it.**

### 6. Moment

Moments are just points on time that you label, so you can start writting music played at that moment in other parts of your script.

For this purpose, we have 2 directives:

  - Moment definition: directive that specifies a point to which we can insert music from other points.
    - `@moment-name!`
    - Ends with `!`
  - Moment usage: directive that specifies what to insert in a moment definition previously used.
    - `@moment-name:`
    - Ends with `:`

This example demonstrates how moments work in `nalda`:

```nalda
piano: 0 2 4 @introductionMoment! 6 8 10 12 14 16 18
guitar: @introductionMoment: 6 8 10 12 14 16 18
```

### 7. Note

The notes are the basic element of the language.

Notes are represented by numbers that represent semitone jumps.

So what we have is this equivalence between `nalda` and `alda` notes:

  - `0` is an `a`
  - `2` is an `b`
  - `3` is an `c`
  - `5` is an `d`
  - `7` is an `e`
  - `8` is an `f`
  - `10` is an `g`
  - `12` is an `>a`

So, for example, we can write this 2 voices that sound the same:

```
piano:
   voice 1:    0 2 3 5 7 8 10 12
   voice 2: [[ a b c d e f g  >a ]]
```

The `voice 1` is in `nalda` syntax.

The `voice 2` is in embedded `alda` syntax.

#### 7.1. Note modifiers

Notes accept modifiers:

  - `longitude`:
    - Represents the duration of a note.
    - Its syntax is: `4L` `8L` `16L` `32L` 
    - `4L` is the default (represents a black note, while `2L` represents a white note)
    - This magnitude represents the tempo divider, so, the higher this number is, the faster the note expires.
  - `timing`:
    - Represents the duration of a note, but directly into `seconds` or `milliseconds`.
    - Its syntax is: `2500MS` (2.5 seconds) `4S` (4 seconds) `1S` (1 second) and so on... 
    - There is no default value
    - This magnitude represents the longitude of a note, but directly into `seconds` or `milliseconds`
  - `quantification`:
    - Represents the length of a note without changing its duration
    - Its syntax is: `0D` `20D` `40D` `60D` `80D` `100D` 
    - `100D` is the default
    - This magnitude is a percentage
  - `volume`:
    - Represents the volume of a note
    - Its syntax is: `0V` `20V` `40V` `60V` `80V` `100V` 
    - `100V` is the default
    - This magnitude is a percentage

The order of the modifiers has to be always the same, so, for example, you cannot add the volume before the longitude.

To play with this modifiers, you have to add them just after the note.

This example demonstrates the **volume** of a note:

```nalda
piano:
	0  20V
	2  30V
	4  40V
	6  50V
	8  60V
	10 70V
	12 80V
	14 90V
	16 100V
```

This example demonstrates the **quantification** of a note:

```nalda
piano:
	0  10Q
	12 1000Q
```

This example demonstrates the **longitude** of a note:

```nalda
piano:
	0  16L
	.  4L
	0  8L
	.  4L
	0  4L
	.  4L
	0  2L
	.  4L
	0  1L
```

### 8. Chord

`nalda` accepts chords, which are just multiple notes starting at the same time.

The same modifiers appliable to notes, can be applied to chords.

When a chord receives modifiers, these modifiers affect to all the notes inside, except if the specific notes override that modifier(s), in which case the modifier applied to the note overrides the general chord modifiers.

For example:

```nalda
piano:
  { 0 1L 100V 7 12 } 4L 20V 
  { 3 1L 100V 7 10 } 2L 20V
  { 0 1L 100V 7 12 } 4L 60V
  { 0 1L 100V 5 10 } 2L 20V
```

As you will notice, the modifiers applied to the chord are maintained to all the notes inside, except for these which also specify their own modifiers.

You can put as much notes as you want in a chord.

### 9. Silence

The silence in `nalda` acts as if it was one more note, but without volume.

This means that you can apply the same note and chord modifiers.

Silences are represented with a `.` and its modifiers go behind, after a space, as in notes and chords.

For example:

```nalda
piano:
  0 . 8L 0 . 8L 
```

### 10. Embedded alda

As `nalda` is just an interface to generate `alda` code, we can also embed `alda` code directly to our scripts.

This is done by expressions between `[[` and `]]`.

We cannot, though, embed `alda` code anywhere.

The embedded `alda` code acts just like if it was a note or a chord, and we only can insert it in places where a note or a chord could go.

Note that `alda` and `nalda` are 2 separate syntax to write the same thing, but you cannot mix them except because of this feature of `nalda`.

For example:

```nalda
piano: [[ a b c ]]
```

The idea is to be able to do anything that the underlying `alda` version lets you, without affecting `nalda` syntax.

### 11. Comments

`nalda` allows you to embed comments in its code too, using the `/**` and `**/` multiline comments.

You can put wherever you want these symbols and whatever you want inside of them, because in the `alda` output script, they will not appear.

### 12. Templating

Finally, a very cool feature of `nalda` is that you can play with JavaScript to use variables, conditionals, functions, loops or whatever.

*How is that?*

This is because `nalda` scripts are [ejs templates](https://github.com/mde/ejs) before becoming `alda` scripts.

The only thing to know before getting hands dirty with this feature is that the `ejs` delimiter is set to `"/"` in `nalda` scripts, so instead of `<%` and `%>`, we have to use `</` and `/>`.

This is a very simple example demonstrating that `ejs` is absolutely valid for you to play with in your `nalda` scripts.

```nalda
</ const chord1 = "5 10 15 20" />
piano: { </- chord1 /> }
```

#### 12.1. EJS linter

Due to the problems that could arise, `nalda` comes bundled with a small functionality that can help you to identify syntax errors inside the scriptlets of `ejs`.

To check if the grammar of javascript inside your scriptlets seems correct, you can run this command from the command-line:

```batch
npm run lint
```

#### 12.2. Nalda JavaScript API

To accelerate the process of creating music, `nalda` comes with a very small and simple API, for you to manage programmatically, if you want:

   - chords: `nalda.Chord`
   - note: `nalda.Note`

You can try this example, which is quite simple but can demonstrate what we are talking about.

```nalda
</
const chord1 = nalda.Chord.create({ notes: [0,7,12,15,19,24], modifiers: {longitude: 2} }); // mi
const chord2 = nalda.Chord.create({ notes: [3,7,10,15,22,27] }); // sol
const chord3 = nalda.Chord.create({ notes: [0,5,10,17,22,26] }); // re
const chordLength = 8;
const silenceLength = 32;
/>

piano:
voice 1:
  octave:2

  </-chord1/> </-chord1/> . </-silenceLength/>L
  </-chord1/> </-chord1/> . </-silenceLength/>L

  </-chord2/> </-chordLength/>L </-chord2/> </-chordLength/>L . </-silenceLength/>L
  </-chord2/> </-chordLength/>L </-chord2/> </-chordLength/>L . </-silenceLength/>L

  </-chord3/> </-chordLength/>L </-chord3/> </-chordLength/>L . </-silenceLength/>L
  </-chord3/> </-chordLength/>L </-chord3/> </-chordLength/>L . </-silenceLength/>L

  </-chord1/>
```

But do not take this API too seriously, its purpose is more about suggesting, than giving true help, it just encapsulates programmatically the basic information of chords and notes, nothing else.

The API is defined at `dev/nalda-api.js`.

#### Predefined chords

You may find very useful to use the `nalda.chord` API, which lets you write chords fastly.

All the chords available right now are:

```nalda
nalda.chord.do
nalda.chord.dom
nalda.chord.do7
nalda.chord.doSos
nalda.chord.doSosm
nalda.chord.doSos7
nalda.chord.re
nalda.chord.rem
nalda.chord.re7
nalda.chord.reSos
nalda.chord.reSosm
nalda.chord.reSos7
nalda.chord.mi
nalda.chord.mim
nalda.chord.mi7
nalda.chord.miSos
nalda.chord.miSosm
nalda.chord.miSos7
nalda.chord.fa
nalda.chord.fam
nalda.chord.fa7
nalda.chord.faSos
nalda.chord.faSosm
nalda.chord.faSos7
nalda.chord.sol
nalda.chord.solm
nalda.chord.sol7
nalda.chord.solSos
nalda.chord.solSosm
nalda.chord.solSos7
nalda.chord.la
nalda.chord.lam
nalda.chord.la7
nalda.chord.laSos
nalda.chord.laSosm
nalda.chord.laSos7
nalda.chord.si
nalda.chord.sim
nalda.chord.si7
```

And their synonims, using the other popular notation:

```nalda
nalda.chord.C
nalda.chord.Cm
nalda.chord.C7
nalda.chord.CSos
nalda.chord.CSosm
nalda.chord.CSos7
nalda.chord.D
nalda.chord.Dm
nalda.chord.D7
nalda.chord.DSos
nalda.chord.DSosm
nalda.chord.DSos7
nalda.chord.E
nalda.chord.Em
nalda.chord.E7
nalda.chord.ESos
nalda.chord.ESosm
nalda.chord.ESos7
nalda.chord.F
nalda.chord.Fm
nalda.chord.F7
nalda.chord.FSos
nalda.chord.FSosm
nalda.chord.FSos7
nalda.chord.G
nalda.chord.Gm
nalda.chord.G7
nalda.chord.GSos
nalda.chord.GSosm
nalda.chord.GSos7
nalda.chord.A
nalda.chord.Am
nalda.chord.A7
nalda.chord.ASos
nalda.chord.ASosm
nalda.chord.ASos7
nalda.chord.B
nalda.chord.Bm
nalda.chord.B7
```

For example, a simple song could be written like this:

```nalda
/*********************************************
 **** Con el diablo al lado - Zona Ganjah ****
 *********************************************/

</

const { chord } = nalda;
const reggaeRythm = function(chord1, chord2, chord3, chord4) {
  return `
  . 0.500s ${ chord1 } 0.001s . 0.100s ${ chord1 } 0.001s
  . 0.500s ${ chord1 } 0.001s . 0.100s ${ chord1 } 0.001s
  . 0.500s ${ chord2 } 0.001s . 0.100s ${ chord2 } 0.001s
  . 0.500s ${ chord2 } 0.001s . 0.100s ${ chord2 } 0.001s
  . 0.500s ${ chord3 } 0.001s . 0.100s ${ chord3 } 0.001s
  . 0.500s ${ chord3 } 0.001s . 0.100s ${ chord3 } 0.001s
  . 0.500s ${ chord4 } 0.001s . 0.100s ${ chord4 } 0.001s
  . 0.500s ${ chord4 } 0.001s . 0.100s ${ chord4 } 0.001s`;
};
/>

accordion:
 voice 1:

  tempo: 1800!
  </-reggaeRythm(chord.Fm, chord.Fm, chord.ASosm, chord.Cm)/>
  </-reggaeRythm(chord.Fm, chord.Fm, chord.ASosm, chord.Cm)/>
```

If you wrap the last template tags in a template loop, you can repeat that chords all the times you want, so you could have a nice base with very few lines.

## Examples of nalda scripts

You can find the sample scripts found along this document on `composer/examples`.

Move them into `composer/` folder, and save them to hear them, if you turned already on the `alda` server, and the `nalda` watcher.


## Issues

Address your issues to the [issues](#) section of the Github project, if any.

## License

[WTFPL or What The Fuck Public License]. Okay, this is it:

```
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                   Version 2, December 2004

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.
 
           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
```