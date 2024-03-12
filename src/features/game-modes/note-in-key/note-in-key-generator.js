import {
    availableNotesOnStrings,
    pattern1keyNote,
    pattern2keyNote
} from "../../../components/configuration/config-data.js?v=2.4.0";
import {NoteInKeyShuffler} from "../../../components/game-modes/note-in-key/shuffler/note-in-key-shuffler.js?v=2.4.0";

export class NoteInKeyGenerator {
    diatonicNotesOnStrings;
    /** @type {object} not selected strings are removed */
    availableNotesOnStrings;
    combinationsToBeShuffled = [];
    shuffledCombinations;
    // Index of the current combination to be displayed from the shuffledCombinations array
    currentIndex = 0;
    // Both patterns can be selected or only one.
    selectedFretboardPattern = null;

    constructor() {
    }

    /**
     * Return random string and random key from that string
     * @returns [string, keyNoteObject]
     */
    getNewStringAndKey() {
        console.debug(`All available strings and notes`, this.availableNotesOnStrings);

        const availableKeyNotesOnStrings = this.getAvailableKeyNotesOnStrings();

        const strings = Object.keys(availableKeyNotesOnStrings);
        this.string = strings[Math.floor(Math.random() * strings.length)];
        // Keys for given string.
        // Using slice a copy with new indexes as availableKeyNotesOnStrings is keeping the index (fret number)
        const keys = availableKeyNotesOnStrings[this.string].filter(() => true);
        // Get random key from possible keys for string
        this.key = keys[Math.floor(Math.random() * keys.length)];
        // Fret number
        const keyNoteFretPosition = availableNotesOnStrings[this.string].indexOf(this.key);
        return {
            keyString: this.string,
            keyNoteObject: {noteName: this.key, number: 1, fretPosition: keyNoteFretPosition}
        };
    }

    /**
     * Depending on if the user has selected a fret range, the available notes on strings are filtered
     */
    getAvailableKeyNotesOnStrings() {
        // Get the selected fret range if there is one
        const selectedFretRange = this.getSelectedFretRange();
        const keyNotePositions = this.getKeyNotePositionsInPattern(selectedFretRange);

        // If no range is selected, return the original availableNotesOnStrings
        if (!selectedFretRange || !keyNotePositions) {
            return this.availableNotesOnStrings;
        }

        let strippedNotesOnStringsForKey = {};
        for (let string in this.availableNotesOnStrings) {
            // this.availableNotesOnStrings contains strings as keys and arrays of notes as values.
            // The note index is the fret number.
            // The array has to be initialized before adding notes to it
            strippedNotesOnStringsForKey[string] = [];
            for (let noteFretPosition in this.availableNotesOnStrings[string]) {
                if (keyNotePositions[string]) {
                    noteFretPosition = parseInt(noteFretPosition);
                    const keyNotePosition = parseInt(keyNotePositions[string]);
                    const lowerLimit = parseInt(selectedFretRange.lowerLimit);
                    const upperLimit = parseInt(selectedFretRange.upperLimit);

                    // Add the note to strippedNotesOnStringsForKey if the note is in the keyNotePositions
                    const spaceToTheRight = noteFretPosition - keyNotePosition + lowerLimit;
                    const spaceToTheLeft = 11 - (upperLimit - keyNotePosition) - noteFretPosition;

                    // If the key note requires more space than 0 to the left (towards negative) or more than 11,
                    // the pattern overflows and is not valid
                    if (spaceToTheRight >= 0 && spaceToTheLeft >= 0) {
                        strippedNotesOnStringsForKey[string][noteFretPosition] = this.availableNotesOnStrings[string][noteFretPosition];
                    }
                }
            }
            if (strippedNotesOnStringsForKey[string].length === 0) {
                delete strippedNotesOnStringsForKey[string];
            }

        }
        return strippedNotesOnStringsForKey;
    }

    /**
     * Load the this.notesOnStrings attribute which is the possible notes that can be displayed.
     * Related to the given key and difficulty level.
     * @param keyString
     * @param keyNoteObject containing name, number and fret position
     */
    loadShuffledCombinations(keyString, keyNoteObject) {
        // Convert the range of possibleKeysOnStrings to the diatonic scale of the given keyNote
        let diatonicNotesOnStrings = this.getAvailableNotesOnStringsInDiatonicScale(
            keyNoteObject.noteName, this.availableNotesOnStrings
        );

        // const keyIndex = this.possibleKeysOnStrings[keyString].indexOf(keyNote);
        // const difficulty = parseInt(document.getElementById('fret-gap-range-slider').value) ?? 1;

        // Get index of note that is key on string from freshly created diatonicNotesOnStrings
        // const keyIndex = diatonicNotesOnStrings[keyString].findIndex(noteObject => noteObject.noteName === keyNote);
        console.debug(`String ${keyString} Key ${keyNoteObject.noteName}`);
        // console.debug(`Diatonic notes`, diatonicNotesOnStrings);

        // Remove notes that are not nearby the key note, according to the difficulty level
        // this.diatonicNotesOnStrings = this.removeNotesAccordingToDifficultyLevel(diatonicNotesOnStrings, keyIndex, difficulty);
        this.diatonicNotesOnStrings = this.removeNotesOutsideOfSelectedRange(diatonicNotesOnStrings);
        // console.log('diatonicNotesOnStrings that will be shuffled: ', this.diatonicNotesOnStrings);
        // Fill the combinationsToBeShuffled array with all possible combinations
        this.createArrayWithCombinationsToBeShuffled();

        // Reset currentIndex
        this.currentIndex = 0;
        // Shuffle the array with the combinations
        // this.shuffledCombinations = ArrayShuffler.shuffleArray(
        //     this.combinationsToBeShuffled,
        //     [keyString, {noteName: keyNote, fretPosition: keyNoteFretPosition}]
        // );
        // console.log('combinationsToBeShuffled', this.combinationsToBeShuffled);
        this.shuffledCombinations = NoteInKeyShuffler.shuffleArray(
            this.combinationsToBeShuffled, [keyString, keyNoteObject],
        );
        // console.log(this.shuffledCombinations);
    }

    /**
     * @return {object|boolean} returns object with lowerLimit and upperLimit or false if no range is selected
     */
    getSelectedFretRange() {
        // Get selected fretboard nr
        const fretboardNr = this.getSelectedFretboardNr();
        // Get the selected range from local storage based on which pattern option is checked
        return fretboardNr ? JSON.parse(localStorage.getItem(`note-in-key-fret-range-${fretboardNr}`)) : false;
    }

    /**
     * @return {number|boolean|null}
     */
    getSelectedFretboardNr() {
        if (this.selectedFretboardPattern) {
            return this.selectedFretboardPattern;
        }

        const checkedPatternOptions = document.querySelectorAll('.custom-pattern-option input[type="checkbox"]:checked');
        if (checkedPatternOptions.length === 0) {
            return false;
        }

        // If multiple checkedPatternOptions, return randomly the 1 or 2, if only one, return that one
        const checkedPatternOption =
            checkedPatternOptions.length === 1 ? checkedPatternOptions[0] : checkedPatternOptions[Math.floor(Math.random() * 2)];

        this.selectedFretboardPattern = parseInt(checkedPatternOption.dataset.fretboardNr);
        return this.selectedFretboardPattern;
    }

    /**
     * @return {object|boolean} returns an object with the strings as key and fret positions of the key notes
     * inside the selected range as values or false if no range is selected
     */
    getKeyNotePositionsInPattern(selectedFretRange) {
        // Determine which pattern option is checked
        const fretboardNr = this.getSelectedFretboardNr();
        // If no range is selected, return the original diatonicNotesOnStrings
        if (!fretboardNr || !selectedFretRange) {
            return false;
        }
        // Get all key note positions from local storage based on which pattern option is checked
        let keyNotePositions = JSON.parse(localStorage.getItem(`fret-pattern-${fretboardNr}-key-positions`));

        // Remove key note positions that are outside the selected range
        for (let string in keyNotePositions) {
            if (keyNotePositions[string] < selectedFretRange.lowerLimit || keyNotePositions[string] > selectedFretRange.upperLimit) {
                delete keyNotePositions[string];
            }
        }
        return keyNotePositions;
    }

    removeNotesOutsideOfSelectedRange(diatonicNotesOnStrings) {
        // Get the selected fret range
        const selectedRange = this.getSelectedFretRange();
        const fretboardNr = this.getSelectedFretboardNr();

        if (!selectedRange || !fretboardNr) {
            return diatonicNotesOnStrings;
        }

        const patternKeyNote = fretboardNr === 1 ? pattern1keyNote : pattern2keyNote;
        const diatonicNotesOnStringsInPatternKey = this.getAvailableNotesOnStringsInDiatonicScale(patternKeyNote, availableNotesOnStrings);

        // If range is selected, remove notes outside the range
        let strippedDiatonicNotes = {};

        for (let string in diatonicNotesOnStrings) {
            strippedDiatonicNotes[string] = [];
            for (let noteObject of diatonicNotesOnStrings[string]) {
                // Get the fret number of the same note number but in the pattern key where the user defined the range
                const noteFretPositionInPatternKey = diatonicNotesOnStringsInPatternKey[string].find(
                    noteObjectFromPattern => noteObjectFromPattern.number === noteObject.number).fretPosition;
                // If the note is within the selected range of the "translated" key, add it to the strippedDiatonicNotes
                if (noteFretPositionInPatternKey >= selectedRange.lowerLimit && noteFretPositionInPatternKey <= selectedRange.upperLimit) {
                    strippedDiatonicNotes[string].push(noteObject);
                }
            }
        }

        return strippedDiatonicNotes;
    }

    /**
     * Create an array with all possible combinations of strings and notes
     */
    createArrayWithCombinationsToBeShuffled() {
        this.combinationsToBeShuffled = [];
        // Shuffle the notes on each string
        for (let string in this.diatonicNotesOnStrings) {
            // Fretboard game note shuffler cannot be taken as it shuffles combinations with all strings with
            // every note.
            // We want combinations with only specific notes (diatonic) going with each string.
            // this.combinationsToBeShuffled.push(...this.diatonicNotesOnStrings[string].map(noteObject => [string, noteObject.noteName]));
            this.combinationsToBeShuffled.push(...this.diatonicNotesOnStrings[string].map(noteObject => [string, noteObject]));

        }
        console.debug('Combinations to be shuffled', this.combinationsToBeShuffled);
    }


    getNextCombination() {
        // Error below should be fixed with currentIndex reset in loadShuffledCombinations()
        // Sometimes there is a bug after a few rounds where only the number 1 is displayed
        // The error line 81 is Uncaught TypeError: undefined is not iterable (cannot read property Symbol(Symbol.iterator))
        // Either the shuffledCombinations is undefined or the shuffledCombinations[currentIndex] is undefined
        // console.log('currentIndex: ' + this.currentIndex, 'shuffledCombinations: ' + this.shuffledCombinations
        //     + 'shuffledCombinations[currentIndex]' + this.shuffledCombinations[this.currentIndex]);
        // If this.shuffledCombinations[this.currentIndex] is undefined, inform user with alert
        if (this.currentIndex === undefined || this.shuffledCombinations.length === 0
            || !this.shuffledCombinations[this.currentIndex]) {
            console.log('currentIndex: ' + this.currentIndex, 'shuffledCombinations: ' + this.shuffledCombinations)
            alert('There was an error. Shuffled combinations array empty.' +
                'Please reload the page. ' + "\n" + 'currentIndex: ' + this.currentIndex);

        }
        // The note shuffler returns a string with the format 'string|note'
        let [string, noteObject] = this.shuffledCombinations[this.currentIndex];

        // If the current index is reached, re shuffle all the notes and reset it to 0
        if (this.currentIndex >= this.shuffledCombinations.length - 1 || !this.shuffledCombinations[this.currentIndex]) {
            const previousCombination = this.shuffledCombinations[this.currentIndex];
            // replace the shuffled combinations with a freshly shuffled array
            // this.shuffledCombinations = ArrayShuffler.shuffleArray(this.combinationsToBeShuffled, previousCombination);
            this.shuffledCombinations = NoteInKeyShuffler.shuffleArray(this.combinationsToBeShuffled, previousCombination);
            this.currentIndex = 0;
        } else {
            this.currentIndex++;
        }

        // Split the string into an array containing the string and the note
        // let [string, note] = combination.split('|');
        return {stringName: string, noteName: noteObject};

        const strings = Object.keys(this.diatonicNotesOnStrings);
        const stringToPlayNote = strings[Math.floor(Math.random() * strings.length)];

        // Available note numbers
        const notes = this.diatonicNotesOnStrings[stringToPlayNote];
        // Get the number of the object chosen by randomness
        const noteNameAndNumber = notes[Math.floor(Math.random() * notes.length)];

        return {stringName: stringToPlayNote, noteName: noteNameAndNumber};
    }

    /**
     * Get the available notes on each string in the diatonic scale of the given key note
     * @param {string}keyNote
     * @param {object} availableNotesOnStrings - Object with string names as keys and arrays of notes as values
     * where the note index is the fret number
     * @return {*[]}
     */
    getAvailableNotesOnStringsInDiatonicScale(keyNote, availableNotesOnStrings) {
        let diatonicScale = this.generateDiatonicScale(keyNote);
        let diatonicNotesOnStrings = [];
        // For each string, filter-out notes that should not be playable
        for (let string in availableNotesOnStrings) {
            let notesOnString = availableNotesOnStrings[string];
            // Remove all non-diatonic tones from the notes on a string
            // Result: {note: 'A', number: 1}, {note: 'B', number: 2}
            diatonicNotesOnStrings[string] = notesOnString
                // Add the note number to the note object
                .map(note => ({
                    noteName: note,
                    number: diatonicScale.indexOf(note) + 1,
                    fretPosition: notesOnString.indexOf(note)
                }))
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
        let strippedDiatonicNotes = [];
        // Remove notes that are hard to reach, according to the difficulty level,
        // Calculate the start and end indices for the slice method
        let start = Math.max(0, keyIndex - difficulty);
        let end = keyIndex + difficulty;
        console.debug(`Key index: ${keyIndex}; Start: ${start}; End ${end}`);

        for (let string in diatonicNotesOnStrings) {
            // Use the slice method to get the nearby notes +1 because the end index is not included in the slice
            strippedDiatonicNotes[string] = diatonicNotesOnStrings[string].slice(start, end + 1);
        }
        console.debug(`Notes after removal. Difficulty ${difficulty}`, strippedDiatonicNotes);
        this.diatonicNotesOnStrings = strippedDiatonicNotes;
        return strippedDiatonicNotes;
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