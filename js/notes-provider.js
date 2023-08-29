export class NotesProvider {
    constructor() {
        // Initialize the notesList, shuffledNotes, and currentIndex properties
        this.notesList = [];
        this.shuffledNotes = [];
        this.currentIndex = 0;
        this.shuffledAmount = 0;
        this.strings = ['Ê', 'B', 'G', 'D', 'A', 'E'];
        this.notes = ['C', 'C♯', 'D', 'D♭', 'D♯', 'E', 'E♭', 'F', 'F♯', 'G', 'G♭', 'G♯', 'A', 'A♭', 'A♯', 'B', 'B♭'];
        // const notes = ['C', 'C♯', 'D', 'D♯',];

        // Set the notes list during object construction
        this.setNotesList();
    }

    /**
     * Sets the notes list by generating all possible guitar notes on the fretboard.
     * Includes notes ranging from C to B for each string.
     */
    setNotesList() {
        // Generate all possible note combinations for each string and note
        for (const string of this.strings) {
            for (const note of this.notes) {
                // Not adding open strings
                if (note !== string) {
                    const noteCombination = `${string}|${note}`;
                    this.notesList.push(noteCombination); // Add the note combination to the notesList
                }
            }
        }
        this.shuffleNotes();
    }

    /**
     * Shuffles the notes list while ensuring each succeeding note is different from the
     * previous and avoids only halftone differences.
     */
    shuffleNotes() {
        // Create a copy of the notesList using the spread operator
        let notesListCopy = [...this.notesList];

        this.shuffledNotes = [];

        let previousNoteCombination = null;
        // Counter how many times a note could not be added to the shuffled notes array
        let combinationNotAddedCount = 0;

        // Loop until all notes have been shuffled
        while (notesListCopy.length > 0) {
            // Generate a random index within the remaining notesListCopy
            const randomIndex = Math.floor(Math.random() * notesListCopy.length);

            // Get the note combination at the random index
            const noteCombination = notesListCopy[randomIndex];

            // Or if the amount of times a combination could not be added is 5 times greater than the length of
            // the remaining notes to be attributed. It is assumed, that it's impossible to add the remaining
            // notes to the shuffled array so that they are always at least half a tone appart.
            let addNotesEvenIfNotHalfToneAppart = false;
            if (combinationNotAddedCount > (notesListCopy.length * 5)) {
                this.shuffledAmount++;
                if (this.shuffledAmount < 10) {
                    // Restart the entire shuffle
                    console.debug(`Re-shuffling all notes because remaining ${notesListCopy.length} notes could not be added 
                    to shuffled list with ${notesListCopy.length * 5} trials`);
                    this.shuffleNotes();
                    return;
                } else {
                    // If shuffled amount exceeds 5, the notes should be added even if not half a tone appart
                    addNotesEvenIfNotHalfToneAppart = true;
                    console.debug('Notes added even if not half tone appart because everything was re-shuffled 10 times' +
                        'already with no success');
                }
            }

            // Check if the current note combination is the first one or if there is no halftone difference between the previous and current note
            if ((previousNoteCombination === null || !this.isHalfToneDifference(previousNoteCombination, noteCombination))
                || addNotesEvenIfNotHalfToneAppart === true) {
                // Add the current note combination to the shuffledNotes array
                this.shuffledNotes.push(noteCombination);

                // Update the previousNoteCombination variable with the current note combination
                previousNoteCombination = noteCombination;

                // Remove the selected note combination from notesListCopy
                notesListCopy.splice(randomIndex, 1);
                // Reset the counter that 
                combinationNotAddedCount = 0;
            } else {
                // If the current note is the same or half a tone higher or lower than the previous note, count it
                combinationNotAddedCount++;
            }
        }

        // Reset the currentIndex to the beginning
        this.currentIndex = 0;
        // The following shuffled notes used to create errors if the first one B|F♯ was not played, the second one B|C♯
        // played right and then the odds choose the only existing challenging note B|F♯ which is also not played
        // because the next in the line would be the third one G|F♯ meaning that the choice is G|F♯ or B|F♯ which have
        // the same note.
        // this.shuffledNotes = "B|F♯,B|C♯,G|F♯,G|E,B|G,A|D,G|C,A|C♯,B|D,A|F,G|D♯,G|B,A|G,D|A♯,E|F,B|E,E|B,G|G♯,D|C♯,E|G,D|G♯,E|A♯,G|D,B|C,D|F,E|C♯,A|B,D|E,E|A,A|A♯,E|C,D|A,B|G♯,E|D♯,B|F,B|A♯,D|G,G|C♯,D|B,E|D,D|C,A|G♯,A|C,D|F♯,A|E,B|D♯,G|A♯,B|A,E|G♯,A|D♯,G|F,E|F♯,G|A,D|D♯,A|F♯".split(",");
        console.debug('Shuffled combinations: ' + this.shuffledNotes);
    }


    /**
     * Checks if there is a halftone difference on the same string between two note combinations
     * or the same note across any string.
     * @param {string|null} noteCombination1 The first note combination.
     * @param {string} noteCombination2 The second note combination.
     * @returns {boolean} True if there is a halftone difference, false otherwise.
     */
    isHalfToneDifference(noteCombination1, noteCombination2) {
        const [string1, noteName1] = noteCombination1.split('|');
        const [string2, noteName2] = noteCombination2.split('|');

        // Get the index of the note and string names
        const noteIndex1 = this.notes.indexOf(noteName1);
        const stringIndex1 = this.strings.indexOf(string1);
        const noteIndex2 = this.notes.indexOf(noteName2);
        const stringIndex2 = this.strings.indexOf(string2);

        // Check if the string is the same and if so, if the notes are half a tone appart
        // (Math.abs turns a negative into positive value and if the note indices is 1 or -1 it indicates a halftone difference
        return (stringIndex1 === stringIndex2 && Math.abs(noteIndex2 - noteIndex1) === 1)
            // Or the notes are the same across any string
            || noteIndex1 === noteIndex2;

    }


    /**
     * Retrieves the next note combination from the shuffled list.
     * Returns the note combination.
     * The current index is updated in prepareNextCombination function.
     * @returns {string} The next note combination.
     */
    getNextNoteCombination() {
        // Get the next note from the shuffled list
        return this.shuffledNotes[this.currentIndex];
        // The index is incremented in function prepareNextCombination
    }

    incrementShuffledNotesIndex() {
        // Increment the index and wrap around if necessary
        this.currentIndex = (this.currentIndex + 1) % this.shuffledNotes.length;
    }
}
