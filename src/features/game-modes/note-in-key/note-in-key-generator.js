export class NoteInKeyGenerator {
    notesOnStrings;
    /**
     *
     * @param possibleStringsAndKeys
     */
    constructor(possibleStringsAndKeys) {
        this.possibleStringsAndKeys = possibleStringsAndKeys;
    }

    /**
     * Return random string and random key from that string
     */
    getNewStringAndKey() {
        const strings = Object.keys(this.possibleStringsAndKeys);
        this.string = strings[Math.floor(Math.random() * strings.length)];
        // Keys for given string
        const keys = this.possibleStringsAndKeys[this.string];
        // Get random key from possible keys for string
        this.key = keys[Math.floor(Math.random() * keys.length)];
        return {keyString: this.string, keyNote: this.key};
    }

    loadNotesAndStrings(keyString, keyNote) {
               // Convert the range of possibleKeysOnStrings to the diatonic scale of the given keyNote
        let diatonicNotesOnStrings = this.getPossibleStringsAndKeysInDiatonicScale(
            keyNote, this.possibleStringsAndKeys
        );
        console.log(diatonicNotesOnStrings);

        // const keyIndex = this.possibleKeysOnStrings[keyString].indexOf(keyNote);
        const difficulty = parseInt(document.getElementById('difficulty-range-slider').value) ?? 1;

        // Get index of key-note on string with newly created diatonicNotesOnStrings
        const keyIndex = diatonicNotesOnStrings[keyString].findIndex(noteObject => noteObject.noteName === keyNote);
        console.log(keyIndex);

        // Remove notes that are not nearby the key note, according to the difficulty level
        let notesOnStrings = this.removeNotesAccordingToDifficultyLevel(diatonicNotesOnStrings, keyIndex, difficulty);
        console.log(notesOnStrings);

        this.notesOnStrings = notesOnStrings;
    }

    getNextCombination() {
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
        console.log(diatonicScale);
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
        let end = keyIndex + difficulty + 1; // +1 because the end index is not included in the slice

        for (let string in diatonicNotesOnStrings) {
            // Use the slice method to get the nearby notes
            possibleNotesOnStrings[string] = diatonicNotesOnStrings[string].slice(start, end);
        }
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