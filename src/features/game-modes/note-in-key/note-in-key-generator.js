import {ArrayShuffler} from "../../shuffler/array-shuffler.js?v=1.2.0";

export class NoteInKeyGenerator {
    notesOnStrings;
    possibleStringsAndKeys;
    combinationsToBeShuffled = [];
    shuffledCombinations;
    // Index of the current combination to be displayed from the shuffledCombinations array
    currentIndex = 0;

    constructor() {
    }

    /**
     * Return random string and random key from that string
     */
    getNewStringAndKey() {
        console.log(`All available strings and notes`, this.possibleStringsAndKeys);
        const strings = Object.keys(this.possibleStringsAndKeys);
        this.string = strings[Math.floor(Math.random() * strings.length)];
        // Keys for given string
        const keys = this.possibleStringsAndKeys[this.string];
        // Get random key from possible keys for string
        this.key = keys[Math.floor(Math.random() * keys.length)];
        return {keyString: this.string, keyNote: this.key};
    }

    /**
     * Load the this.notesOnStrings attribute which is the possible notes that can be displayed.
     * Related to the given key and difficulty level.
     * @param keyString
     * @param keyNote
     */
    loadShuffledCombinations(keyString, keyNote) {
        // Convert the range of possibleKeysOnStrings to the diatonic scale of the given keyNote
        let diatonicNotesOnStrings = this.getPossibleStringsAndKeysInDiatonicScale(
            keyNote, this.possibleStringsAndKeys
        );

        // const keyIndex = this.possibleKeysOnStrings[keyString].indexOf(keyNote);
        const difficulty = parseInt(document.getElementById('difficulty-range-slider').value) ?? 1;

        // Get index of note that is key on string from freshly created diatonicNotesOnStrings
        const keyIndex = diatonicNotesOnStrings[keyString].findIndex(noteObject => noteObject.noteName === keyNote);
        console.debug(`String ${keyString} Key ${keyNote}`);
        console.debug(`Diatonic notes`, diatonicNotesOnStrings);

        // Remove notes that are not nearby the key note, according to the difficulty level
        this.notesOnStrings = this.removeNotesAccordingToDifficultyLevel(diatonicNotesOnStrings, keyIndex, difficulty);
        // Fill the combinationsToBeShuffled array with all possible combinations
        this.createArrayWithCombinationsToBeShuffled();

        // Shuffle the array with the combinations
        this.shuffledCombinations = ArrayShuffler.shuffleArray(this.combinationsToBeShuffled);
    }

    /**
     * Shuffles the notes from each string with the note shuffler
     * and puts them into the shuffledCombinations attribute
     */
    createArrayWithCombinationsToBeShuffled() {
        this.combinationsToBeShuffled = [];
        // Shuffle the notes on each string
        for (let string in this.notesOnStrings) {
            // Fretboard game mote shuffler cannot be taken as it shuffles creates combinations with all strings with
            // every note.
            // We want combinations with only specific notes going with each string.
            this.combinationsToBeShuffled.push(...this.notesOnStrings[string].map(noteObject => [string, noteObject.noteName]));
        }
        console.debug('Combinations to be shuffled', this.combinationsToBeShuffled);
    }


    getNextCombination() {
        // The note shuffler returns a string with the format 'string|note'
        let [string, note] = this.shuffledCombinations[this.currentIndex];

        // If the current index is reached, re shuffle all the notes and reset it to 0
        if (this.currentIndex === this.shuffledCombinations.length - 1) {
            // replace the shuffled combinations with a freshly shuffled array
            this.shuffledCombinations = ArrayShuffler.shuffleArray(this.combinationsToBeShuffled);
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }
        // Split the string into an array containing the string and the note
        // let [string, note] = combination.split('|');
        // Get the note number from the note object
        let noteNumber = this.notesOnStrings[string].find(noteObject => noteObject.noteName === note).number;
        return {stringName: string, noteName: {noteName: note, number: noteNumber}};

        const strings = Object.keys(this.notesOnStrings);
        const stringToPlayNote = strings[Math.floor(Math.random() * strings.length)];

        // Available note numbers
        const notes = this.notesOnStrings[stringToPlayNote];
        // Get the number of the object chosen by randomness
        const noteNameAndNumber = notes[Math.floor(Math.random() * notes.length)];

        return {stringName: stringToPlayNote, noteName: noteNameAndNumber};
    }

    getPossibleStringsAndKeysInDiatonicScale(keyNote, possibleKeysOnStrings) {
        let diatonicScale = this.generateDiatonicScale(keyNote);
        let diatonicNotesOnStrings = [];
        // For each string, filter-out notes that should not be playable
        for (let string in possibleKeysOnStrings) {
            let notesOnString = possibleKeysOnStrings[string];
            // Remove all non-diatonic tones from the notes on a string
            // Result: {note: 'A', number: 1}, {nte: 'B', number: 2}
            diatonicNotesOnStrings[string] = notesOnString
                // Add the note number to the note object
                .map(note => ({noteName: note, number: diatonicScale.indexOf(note) + 1}))
                .filter(noteObject => diatonicScale.includes(noteObject.noteName));
        }
        return diatonicNotesOnStrings;
    }

    /**
     * Remove notes that are hard to reach, according to the difficulty level
     * @param diatonicNotesOnStrings
     * @param keyIndex
     * @param difficulty
     * @return {*[]}
     */
    removeNotesAccordingToDifficultyLevel(diatonicNotesOnStrings, keyIndex, difficulty) {
        let possibleNotesOnStrings = [];
        // Remove notes that are hard to reach, according to the difficulty level,
        // Calculate the start and end indices for the slice method
        let start = Math.max(0, keyIndex - difficulty);
        let end = keyIndex + difficulty;
        console.log(`Key index ${keyIndex} Start ${start} End ${end}`);

        for (let string in diatonicNotesOnStrings) {
            // Use the slice method to get the nearby notes +1 because the end index is not included in the slice
            possibleNotesOnStrings[string] = diatonicNotesOnStrings[string].slice(start, end + 1);
        }
        console.debug(`Notes after removal. Difficulty ${difficulty}`, possibleNotesOnStrings);
        this.notesOnStrings = possibleNotesOnStrings;
        return possibleNotesOnStrings;
    }

    /**
     * Generates diatonic scale for given key note
     * @param keyNote
     * @return {*[]}
     */
    generateDiatonicScale(keyNote) {
        const chromaticScale = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
        const wholeWholeHalfPattern = [2, 2, 1, 2, 2, 2, 1];

        let keyIndex = chromaticScale.indexOf(keyNote);
        let diatonicScale = [keyNote];

        for (let step of wholeWholeHalfPattern) {
            keyIndex = (keyIndex + step) % chromaticScale.length;
            diatonicScale.push(chromaticScale[keyIndex]);
        }

        // Remove the last note which is the 1 again
        diatonicScale.pop();

        return diatonicScale;
    }

}