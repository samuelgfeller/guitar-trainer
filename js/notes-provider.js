export class NotesProvider {
    constructor() {
        // Initialize the notesList, shuffledNotes, and currentIndex properties
        this.notesList = [];
        this.shuffledNotes = [];
        this.currentIndex = 0;
        this.shuffledAmount = 0;
        this.strings = ['E', 'B', 'G', 'D', 'A'];
        this.notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
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
        let combinationNotAdded = 0;

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
            if (combinationNotAdded > (notesListCopy.length * 5)) {
                this.shuffledAmount++;
                if (this.shuffledAmount > 5) {
                    // If shuffled amount exceeds 5, the notes should be added even if not half a tone appart
                    addNotesEvenIfNotHalfToneAppart = true;
                } else {
                    // Restart the entire shuffle
                    this.shuffleNotes();
                    return;
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
                combinationNotAdded = 0;
            } else {
                // If the current note is the same or half a tone higher or lower than the previous note, count it
                combinationNotAdded++;
            }
        }

        // Reset the currentIndex to the beginning
        this.currentIndex = 0;
        console.log(this.shuffledNotes);
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
        const stringIndex2 = this.strings.indexOf(noteName2);

        // Check if the string is the same and if so, if the notes are half a tone appart
        // (Math.abs turns a negative into positive value and if the note indices is 1 or -1 it indicates a halftone difference
        if ((stringIndex1 === stringIndex2 && Math.abs(noteIndex2 - noteIndex1) === 1)
            // Or the notes are the same across any string
            || noteIndex1 === noteIndex2) {
            return true
        }

    }


    /**
     * Shuffles the notes list while ensuring each succeeding note is different from the
     * previous and avoids only halftone differences.
     */
    shuffleNotes2() {
        // Set to store previously selected notes
        const previousNotes = new Set();
        this.shuffledNotes = []; // Array to store the shuffled notes

        // Shuffle the notes while ensuring each succeeding note is different from the previous
        for (let i = 0; i < this.notesList.length; i++) {
            // Generate a random index within the notesList
            let randomIndex = Math.floor(Math.random() * this.notesList.length);
            // Get the note combination at the random index
            let noteCombination = this.notesList[randomIndex];

            // Check if the succeeding note is the same as the previous or a halftone lower or higher
            while (// Check if the note combination is in the previousNotes set
            previousNotes.has(noteCombination) ||
            // Check if there is a halftone difference
            (i > 0 && this.isHalfToneDifference(this.shuffledNotes[i - 1], noteCombination))
                ) {
                randomIndex = Math.floor(Math.random() * this.notesList.length); // Generate a new random index
                noteCombination = this.notesList[randomIndex]; // Get the note combination at the new random index
            }

            // Add the note combination to the shuffledNotes array and previousNotes set
            this.shuffledNotes.push(noteCombination);
            previousNotes.add(noteCombination);
        }

        this.currentIndex = 0; // Reset the current index to the beginning
    }


    /**
     * Retrieves the next note combination from the shuffled list.
     * Returns the note combination and updates the current index.
     * If the end of the list is reached, wraps around to the beginning.
     * @returns {string} The next note combination.
     */
    getNextNoteCombination() {
        // Get the next note from the shuffled list
        const nextNote = this.shuffledNotes[this.currentIndex];
        // Increment the index and wrap around if necessary
        this.currentIndex = (this.currentIndex + 1) % this.shuffledNotes.length;
        return nextNote;
    }
}
